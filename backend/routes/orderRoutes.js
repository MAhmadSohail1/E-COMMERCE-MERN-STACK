import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Public / Private (supports both token auth and explicit userId in body as per spec)
router.post('/', async (req, res) => {
  try {
    const { userId, products, totalPrice } = req.body;

    // Check if products array exists and is not empty
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items/products in cart' });
    }

    // Determine user ID: from req.body or auth header if present
    let finalUserId = userId;
    if (!finalUserId && req.headers.authorization) {
      // try to extract if token
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = (await import('jsonwebtoken')).default;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey123456789supersecure');
        finalUserId = decoded.id;
      } catch (e) {
        // ignore
      }
    }

    if (!finalUserId) {
      return res.status(400).json({ message: 'User ID is required to place an order' });
    }

    // Format products list
    const orderItems = products.map((item) => ({
      product: item._id || item.product || item.id,
      name: item.name,
      qty: item.qty || 1,
      price: item.price,
      image: item.image,
    }));

    // Calculate total price if not provided
    const calculatedTotal = totalPrice !== undefined 
      ? Number(totalPrice) 
      : orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const order = new Order({
      userId: finalUserId,
      products: orderItems,
      totalPrice: calculatedTotal,
      status: 'Pending (Cash on Delivery)',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (useful for verification and admin)
// @access  Public (or protected)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/myorders/:userId
// @desc    Get logged in user orders
// @access  Public / Private
router.get('/myorders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
