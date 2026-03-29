const { query, run } = require('../config/db');

exports.getApprovedPosts = async (req, res) => {
  try {
    let sql = "SELECT * FROM posts WHERE status = 'approved'";
    const params = [];

    if (req.query.city) {
      sql += " AND city LIKE ?";
      params.push(`%${req.query.city}%`);
    }
    if (req.query.price_max) {
      sql += " AND price <= ?";
      params.push(req.query.price_max);
    }
    
    sql += " ORDER BY created_at DESC";

    const posts = await query(sql, params);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const posts = await query(`
      SELECT p.*, u.name as owner_name, u.email as owner_email 
      FROM posts p JOIN users u ON p.owner_id = u.id 
      WHERE p.id = ?`, [req.params.id]);
      
    if (posts.length === 0) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    res.json(posts[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPost = async (req, res) => {
  const { title, description, price, area, city, address } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const owner_id = req.user.id;

  try {
    await run(`
      INSERT INTO posts (owner_id, title, description, price, area, city, address, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [owner_id, title, description, price, area, city, address, image]);
    res.status(201).json({ message: 'Đăng bài thành công, chờ admin duyệt' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};