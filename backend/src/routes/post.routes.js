const express = require('express');
const router = express.Router();
const { getApprovedPosts, getPostById, createPost } = require('../controllers/post.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getApprovedPosts);
router.get('/:id', getPostById);
router.post('/', protect, authorize(['owner', 'admin']), upload.single('image'), createPost);

module.exports = router;