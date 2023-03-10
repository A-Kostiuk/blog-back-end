import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';

import { authValidation, postCreateValidation } from './validations/index.js';
import { userController, postController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

dotenv.config();
const PORT = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

mongoose.set('strictQuery', false);
mongoose
  .connect(mongoUri)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/auth/register', authValidation.register, handleValidationErrors, userController.register);
app.post('/auth/login', authValidation.login, handleValidationErrors, userController.login);
app.get('/auth/me', checkAuth, userController.getMe);

app.get('/tags', postController.getLastTags);
app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.update);
app.delete('/posts/:id', checkAuth, postController.remove);

app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log('Server OK', `Port ${PORT}`);
});
