import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { protect, restrictToAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to sign access token (15 minutes lifespan for security)
const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforluxuryjewelryrentals', {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
};

// Helper to sign refresh token (7 days lifespan)
const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkeyforluxuryjewelryrentals', {
    expiresIn: '7d'
  });
};

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Required fields check
    if (!name?.trim() || !email?.trim() || !password || !phone?.trim() || !address?.trim()) {
      return res.status(400).json({ message: 'All details (name, email, phone, address, and password) are required.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // Phone format validation (simple character check)
    if (phone.trim().length < 8) {
      return res.status(400).json({ message: 'Please enter a valid phone number.' });
    }

    // Password strength check
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check duplicate email
    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account is already registered with this email.' });
    }

    // Check duplicate phone
    const existingPhone = await prisma.user.findFirst({
      where: { phone: phone.trim() }
    });
    if (existingPhone) {
      return res.status(400).json({ message: 'An account is already registered with this phone number.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Save to Database
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone.trim(),
        address: address.trim()
      }
    });

    const accessToken = signAccessToken(newUser.id);
    const refreshToken = signRefreshToken(newUser.id);

    // Save refresh token on user record
    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken }
    });

    // Omit password and refresh token from response
    const { password: _, refreshToken: __, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      status: 'success',
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: 'An error occurred during registration. Please try again.' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const identifier = (req.body.email || req.body.emailOrPhone || '').toLowerCase().trim();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please enter your email or phone number, and password.' });
    }

    // Search user by email OR phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Incorrect email, phone number, or password. Please try again.' });
    }

    // Lockout policy checks (5 failed attempts locks for 15 minutes)
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil - new Date()) / 60000);
      return res.status(403).json({ 
        message: `This account is temporarily locked due to too many failed attempts. Please try again in ${remainingMinutes} minutes.` 
      });
    }

    // Verify Password
    if (!bcrypt.compareSync(password, user.password)) {
      const attempts = user.loginAttempts + 1;
      let lockoutUntil = null;
      let message = 'Incorrect email, phone number, or password. Please try again.';

      if (attempts >= 5) {
        lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        message = 'This account has been temporarily locked for 15 minutes due to too many failed login attempts.';
      } else {
        message = `Incorrect password. You have ${5 - attempts} attempts remaining before account lockout.`;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: attempts,
          lockoutUntil
        }
      });

      return res.status(401).json({ message });
    }

    // Reset login attempts on success
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockoutUntil: null,
        refreshToken
      }
    });

    const { password: _, refreshToken: __, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'An error occurred during login. Please try again.' });
  }
});

// 3. REFRESH TOKEN
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required.' });
    }

    // Verify Token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkeyforluxuryjewelryrentals');
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token. Please sign in again.' });
    }

    // Verify token matches user record
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Session has been revoked or expired. Please sign in again.' });
    }

    // Generate new pair
    const newAccessToken = signAccessToken(user.id);
    const newRefreshToken = signRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    return res.status(200).json({
      status: 'success',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: 'Internal Server Error during session refresh.' });
  }
});

// 4. FORGOT PASSWORD (OTP Request)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ message: 'Please enter your email address.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(404).json({ message: 'No registered account found with this email address.' });
    }

    // Generate 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpires: expiry
      }
    });

    // Console output for direct local verification/debugging
    console.log(`\n======================================================`);
    console.log(`  [SECURITY ALERT] Verification Code Sent`);
    console.log(`  Recipient: ${user.email}`);
    console.log(`  OTP Code : ${otp}`);
    console.log(`  Expires  : ${expiry.toISOString()}`);
    console.log(`======================================================\n`);

    return res.status(200).json({
      status: 'success',
      message: 'A 6-digit verification code has been sent to your email address.'
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: 'Could not send verification code. Please try again.' });
  }
});

// 5. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email?.trim() || !code?.trim()) {
      return res.status(400).json({ message: 'Email address and verification code are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user || user.otpCode !== code.trim() || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired verification code. Please check and try again.' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Code verified successfully.'
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: 'Could not verify code. Please try again.' });
  }
});

// 6. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email?.trim() || !code?.trim() || !password) {
      return res.status(400).json({ message: 'Email, code, and new password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user || user.otpCode !== code.trim() || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired verification code session.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Save and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpires: null,
        loginAttempts: 0,
        lockoutUntil: null
      }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Your password has been reset successfully! Please log in with your new password.'
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: 'Could not reset password. Please try again.' });
  }
});

// 7. GET PROFILE
router.get('/profile', protect, async (req, res) => {
  const { password, refreshToken, ...userWithoutPassword } = req.user;
  return res.status(200).json({
    status: 'success',
    user: userWithoutPassword
  });
});

// 8. UPDATE PROFILE
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || req.user.name,
        phone: phone !== undefined ? phone : req.user.phone,
        address: address !== undefined ? address : req.user.address
      }
    });

    const { password, refreshToken, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({
      status: 'success',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: 'Internal Server Error updating profile.' });
  }
});

// 9. GET ALL USERS (Admin Only)
router.get('/users', protect, restrictToAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const sanitizedUsers = users.map(({ password, refreshToken, ...u }) => u);
    return res.status(200).json({
      status: 'success',
      users: sanitizedUsers
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: 'Error retrieving users.' });
  }
});

// 10. TOGGLE ADMIN ACCESS (Admin Only)
router.put('/users/:email/toggle-access', protect, restrictToAdmin, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        hasAdminAccess: !user.hasAdminAccess
      }
    });

    return res.status(200).json({
      status: 'success',
      message: `Admin access toggled successfully for ${user.name}.`,
      hasAdminAccess: updatedUser.hasAdminAccess
    });
  } catch (error) {
    console.error("Toggle admin access error:", error);
    return res.status(500).json({ message: 'Error toggling admin access.' });
  }
});

// 11. LOGOUT
router.post('/logout', protect, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null }
    });
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.'
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: 'Error during logout session termination.' });
  }
});

export default router;
