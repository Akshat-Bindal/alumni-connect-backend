import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePic,
  deleteProfilePic
} from '../controllers/userController.js';

import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);
router.post('/upload', protect, upload.single('profilePic'), uploadProfilePic);
router.delete('/me/profile-pic', protect, deleteProfilePic);

export default router;


