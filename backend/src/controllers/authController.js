import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'pspa_secret_key_2024', { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, batch } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'student' });
    
    // Auto-link/create Student record for student users
    if (user.role === 'student') {
        let student = await Student.findOne({ email: user.email });
        if (student) {
            student.userId = user._id;
            if (rollNumber) student.rollNumber = rollNumber;
            if (batch) student.batch = batch;
            await student.save();
        } else {
            await Student.create({ 
              userId: user._id, 
              name: user.name, 
              email: user.email, 
              rollNumber: rollNumber || '', 
              batch: batch || '2024' 
            });
        }
    }

    const token = generateToken(user._id);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'your passwrod that are used found' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });

    const token = generateToken(user._id);

    // Self-healing: Ensure student record exists if role is student
    if (user.role === 'student') {
        const student = await Student.findOne({ $or: [{ userId: user._id }, { email: user.email }] });
        if (!student) {
            await Student.create({ userId: user._id, name: user.name, email: user.email });
        } else if (!student.userId) {
            student.userId = user._id;
            await student.save();
        }
    }

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};
