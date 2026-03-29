const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Gọi API đăng ký / đăng nhập
app.use('/api/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại cổng ${PORT}. Dữ liệu lưu tại file users.json`);
});