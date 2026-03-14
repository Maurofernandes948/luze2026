import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { generateToken } from '../utils/jwt';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthService.registerUser(email, password);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthService.loginUser(email, password);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

router.get('/me', requireAuth, async (req: any, res) => {
  try {
    const user = await AuthService.getUserById(req.user.id);
    res.json({ user });
  } catch (error: any) {
    res.status(401).json({ user: null });
  }
});

export default router;
