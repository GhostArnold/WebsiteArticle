import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.js';

// Создаем новый экземпляр Router
const router = new Router();

// Register
router.post('/register', register);
// Login
router.post('/login', login);
// Get me
router.get('/getMe', getMe);

export default router;
