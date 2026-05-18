const { query, run } = require('../config/db');

exports.getPendingPosts = async (req, res) => {
  try {
    const posts = await query("SELECT * FROM posts WHERE status = 'pending' ORDER BY created_at DESC");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approvePost = async (req, res) => {
  try {
    await run("UPDATE posts SET status = 'approved' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Đã duyệt bài' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await run("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.json({ message: 'Đã xóa bài' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};