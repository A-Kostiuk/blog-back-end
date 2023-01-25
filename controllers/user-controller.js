import bcrypt from 'bcrypt';
import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id,
      },
      jwtSecret,
      { expiresIn: '30d' });
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Register failed' });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User don\'t find' });

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPassword) return res.status(400).json({ message: 'Invalid login or password' });

    const token = jwt.sign({
        _id: user._id,
      },
      jwtSecret,
      { expiresIn: '30d' });
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) return res.status(404).json({ message: 'User don\'t find' });

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData });
  } catch (e) {
    return res.status(500).json({ message: 'No access' });
  }
};
