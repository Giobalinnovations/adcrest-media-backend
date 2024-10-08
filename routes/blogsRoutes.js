import express from 'express';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
} from '../controllers/blogsController.js';
import { uploadFiles } from '../middleware/multerMiddleware.js';
import Blog from '../models/blogsModel.js';
import mongoose from 'mongoose';

const blogsRouter = express.Router();

blogsRouter.param('id', async (req, res, next, id) => {
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    const blog = isValidId
      ? await Blog.findById(id)
      : await Blog.findOne({ slug: id });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    next();
  } catch (error) {
    // next(error);
    return res.status(404).json({ message: 'Fail', error: error.message });
  }
});

blogsRouter
  .route('/')
  .get(getAllBlogs)
  .post(uploadFiles([{ name: 'imageCover', maxCount: 1 }]), createBlog);
blogsRouter
  .route('/:id')
  .get(getBlog)
  .put(uploadFiles([{ name: 'imageCover', maxCount: 1 }]), updateBlog)
  .delete(deleteBlog);

export default blogsRouter;
