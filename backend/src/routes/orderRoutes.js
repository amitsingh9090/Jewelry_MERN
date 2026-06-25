import express from 'express';
import prisma from '../prisma.js';
import { protect, restrictToAdmin } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ALL ORDERS (Admin Only)
router.get('/', protect, restrictToAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({
      status: 'success',
      orders
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: 'Error retrieving active rentals.' });
  }
});

// 2. GET USER SPECIFIC ORDERS
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerEmail: req.user.email.toLowerCase() },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({
      status: 'success',
      orders
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({ message: 'Error retrieving rental history.' });
  }
});

// 3. PLACE BOOKING ORDER
router.post('/', protect, async (req, res) => {
  try {
    const { total, items } = req.body;
    if (total === undefined || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Booking totals and items array are required.' });
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderId,
        customerName: req.user.name,
        customerEmail: req.user.email.toLowerCase(),
        date: new Date().toISOString().split('T')[0],
        total: Number(total),
        status: 'Active',
        items: items // Store JSON array directly
      }
    });

    return res.status(201).json({
      status: 'success',
      order: newOrder
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({ message: 'Error placing booking order.' });
  }
});

// 4. UPDATE ORDER STATUS (Admin Only)
router.put('/:id/status', protect, restrictToAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Order status is required.' });
    }

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    return res.status(200).json({
      status: 'success',
      order: updatedOrder
    });
  } catch (error) {
    console.error("Update status error:", error);
    return res.status(500).json({ message: 'Error updating order status.' });
  }
});

// 5. INITIATE RETURN (Customer/Self Operation)
router.put('/:id/return', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Verify ownership
    if (order.customerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: 'Forbidden. You do not own this order.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'Returned' }
    });

    return res.status(200).json({
      status: 'success',
      order: updatedOrder
    });
  } catch (error) {
    console.error("Return order error:", error);
    return res.status(500).json({ message: 'Error submitting return request.' });
  }
});

export default router;
