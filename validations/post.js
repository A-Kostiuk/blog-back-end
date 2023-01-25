import { body } from 'express-validator';

export const postCreateValidation = [
  body('title', 'Enter the title of the article').isLength({ min: 3 }).isString(),
  body('text', 'Enter the text of the article').isLength({ min: 10 }).isString(),
  body('tags', 'Invalid tags format (waiting for an array)').optional().isArray(),
  body('imageUrl', 'Invalid image URL)').optional().isString(),
];
