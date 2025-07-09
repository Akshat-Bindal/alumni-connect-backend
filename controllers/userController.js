import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};


export const updateUserProfile = async (req, res) => {
  const { name, bio, department, batch, company, profilePic } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.department = department || user.department;
    user.batch = batch || user.batch;
    user.company = company || user.company;
    user.profilePic = profilePic || user.profilePic;

    const updatedUser = await user.save();

    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      department: updatedUser.department,
      batch: updatedUser.batch,
      company: updatedUser.company,
      profilePic: updatedUser.profilePic
    });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // 1. Delete old image if it exists
    if (user.profilePicId) {
      await cloudinary.uploader.destroy(user.profilePicId);
    }

    // 2. Save new Cloudinary image
    user.profilePic = req.file.path; // URL
    user.profilePicId = req.file.filename; // public_id

    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePic: user.profilePic
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};


export const deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.profilePicId) {
      await cloudinary.uploader.destroy(user.profilePicId);
    }

    user.profilePic = null;
    user.profilePicId = null;

    await user.save();

    res.json({ message: 'Profile picture deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

