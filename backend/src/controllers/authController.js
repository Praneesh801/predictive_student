import User from '../models/User.js';
import { generateToken, validateEmail } from '../utils/helpers.js';
import { findUserByEmail, createUser as mockCreateUser, findUserById } from '../config/mockDB.js';
import bcryptjs from 'bcryptjs';

// Flag to track if MongoDB is available
let isMongoDBConnected = false;

export const setMongoDBStatus = (status) => {
  isMongoDBConnected = status;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Try to use MongoDB first, fall back to mock DB
    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const user = new User({
        name,
        email,
        password,
        role: role || 'student',
      });

      await user.save();
      const token = generateToken(user);

      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      let existingUser = findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = mockCreateUser({
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        isActive: true,
      });

      const token = generateToken(user);

      return res.status(201).json({
        message: 'User registered successfully (Demo Mode)',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Try MongoDB first, fall back to mock DB
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);

      return res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const user = findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);

      return res.json({
        message: 'Login successful (Demo Mode)',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};
