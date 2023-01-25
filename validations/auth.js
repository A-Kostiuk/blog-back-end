import { body } from 'express-validator';

export const register = [
  body('email', 'Incorrect email format').isEmail(),
  body('password', 'The password length must be under five symbols').isLength({ min: 5 }),
  body('fullName', 'State your full name').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid link').optional().isURL(),
];

export const login = [
  body('email', 'Incorrect email format').isEmail(),
  body('password', 'The password length must be under five symbols').isLength({ min: 5 }),
];
