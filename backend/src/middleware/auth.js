import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

export async function protect(req, res, next) {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'You are not logged in. Please log in to get access.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforluxuryjewelryrentals');

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token session. Please log in again.' });
  }
}

export function restrictToAdmin(req, res, next) {
  if (req.user && req.user.hasAdminAccess) {
    next();
  } else {
    return res.status(403).json({ message: 'You do not have permission to perform this action.' });
  }
}
