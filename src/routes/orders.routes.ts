import { Router } from 'express';
import { OrderService } from '../services/order.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, async (req: any, res) => {
  try {
    const order = await OrderService.createOrder(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', requireAuth, async (req: any, res) => {
  try {
    if (req.user.role === 'admin') {
      const orders = await OrderService.getAllOrders();
      res.json(orders);
    } else {
      const orders = await OrderService.getUserOrders(req.user.id);
      res.json(orders);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', requireAuth, async (req: any, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    
    // Check if user is admin or owner of the order
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(order);
  } catch (error: any) {
    res.status(404).json({ error: 'Order not found' });
  }
});

export default router;
