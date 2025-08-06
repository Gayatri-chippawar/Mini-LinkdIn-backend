const express = require('express');
const { createPost, getFeed,deletePost } = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getFeed);
router.delete('/:id', protect, deletePost);

module.exports = router;
