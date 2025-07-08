import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', protect, getUserProfile);
router.put('/me', protect, updateUserProfile); 

export default router;

