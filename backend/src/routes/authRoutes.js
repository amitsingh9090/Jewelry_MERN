import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { protect, restrictToAdmin } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforluxuryjewelryrentals', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: 'Please set your phone number',
        address: 'Please set your shipping address'
      }
    });

    const token = signToken(newUser.id);

    // Omit password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      status: 'success',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: 'Internal Server Error during registration.' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    const token = signToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      status: 'success',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Internal Server Error during login.' });
  }
});

// 3. GET PROFILE
router.get('/profile', protect, async (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  return res.status(200).json({
    status: 'success',
    user: userWithoutPassword
  });
});

// 4. UPDATE PROFILE
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

    const { password, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({
      status: 'success',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: 'Internal Server Error updating profile.' });
  }
});

// 5. GET ALL USERS (Admin Only)
router.get('/users', protect, restrictToAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // Omit passwords
    const sanitizedUsers = users.map(({ password, ...u }) => u);
    return res.status(200).json({
      status: 'success',
      users: sanitizedUsers
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: 'Error retrieving users.' });
  }
});

// 6. TOGGLE ADMIN ACCESS (Admin Only)
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

export default router;
