const Post = require('../models/Post');
const mongoose = require('mongoose');

exports.createPost = async (req, res) => {
  const { content } = req.body;
  try {
    const post = await Post.create({ content, author: req.user });
    res.status(201).json(post);
  } catch {
    res.status(500).json({ message: 'Error creating post' });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: 'Error fetching feed' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post id' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Sirf author hi delete kar sakta hai
    if (post.author.toString() !== req.user) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne(); // ya Post.findByIdAndDelete(id)
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error', err);
    res.status(500).json({ message: 'Error deleting post' });
  }
};
