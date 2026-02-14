import User from '../models/User.js';
import { findUserById, updateUser as mockUpdateUser, getAllUsers as mockGetAllUsers, deleteUserById as mockDeleteUser } from '../config/mockDB.js';

export const getProfile = async (req, res) => {
  try {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (mongoError) {
      // Fall back to mock DB
      const user = findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).select('-password');

      return res.json({ message: 'Profile updated successfully', user });
    } catch (mongoError) {
      // Fall back to mock DB
      const user = mockUpdateUser(req.user.id, { name, email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.json({ message: 'Profile updated successfully (Demo)', user: userWithoutPassword });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    try {
      const users = await User.find().select('-password');
      return res.json(users);
    } catch (mongoError) {
      // Fall back to mock DB
      const users = mockGetAllUsers().map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });
      return res.json(users);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { role, updatedAt: Date.now() },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ message: 'User role updated successfully', user });
    } catch (mongoError) {
      // Fall back to mock DB
      const user = mockUpdateUser(userId, { role });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.json({ message: 'User role updated successfully (Demo)', user: userWithoutPassword });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ message: 'User deleted successfully' });
    } catch (mongoError) {
      // Fall back to mock DB
      const user = mockDeleteUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ message: 'User deleted successfully (Demo)' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
