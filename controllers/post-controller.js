import PostModel from '../models/post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('author').exec();
    res.json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Failed to get posts' });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (e, doc) => {
        if (e) {
          console.log(e);
          return res.status(500).json({ message: 'Failed to get post' });
        }
        if (!doc) return res.status(404).json({ message: 'Post not found' });
        res.json(doc);
      },
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Failed to get post' });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndRemove(
      { _id: postId },
      (e, doc) => {
        if (e) {
          console.log(e);
          return res.status(500).json({ message: 'Failed to delete post' });
        }
        if (!doc) return res.status(404).json({ message: 'Post not found' });

        res.json({
          success: true,
        });
      });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      author: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne({
      _id: postId,
    }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      author: req.userId,
      tags: req.body.tags,
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update post' });
  }
};
