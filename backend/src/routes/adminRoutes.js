import express from 'express';
import prisma from '../prisma.js';
import { protect, restrictToAdmin } from '../middleware/auth.js';

const router = express.Router();

async function getOrCreateCredentials() {
  let creds = await prisma.adminCredentials.findFirst();
  if (!creds) {
    creds = await prisma.adminCredentials.create({
      data: {
        username: "amit9115",
        password: "12345"
      }
    });
  }
  return creds;
}

// 1. GET CREDENTIALS
router.get('/credentials', async (req, res) => {
  try {
    const creds = await getOrCreateCredentials();
    return res.status(200).json({
      status: 'success',
      username: creds.username,
      password: creds.password // Required to match the front-end lockscreen check
    });
  } catch (error) {
    console.error("Get credentials error:", error);
    return res.status(500).json({ message: 'Error retrieving security configurations.' });
  }
});

// 2. UPDATE CREDENTIALS (Admin Only)
router.put('/credentials', protect, restrictToAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const creds = await getOrCreateCredentials();
    const updated = await prisma.adminCredentials.update({
      where: { id: creds.id },
      data: {
        username,
        password
      }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Admin security keys updated successfully.',
      username: updated.username,
      password: updated.password
    });
  } catch (error) {
    console.error("Update credentials error:", error);
    return res.status(500).json({ message: 'Error updating security keys.' });
  }
});

export default router;
