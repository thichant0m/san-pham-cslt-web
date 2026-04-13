const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');

const app = express();

// 1. Kết nối Database
connectDB();

// 2. Cài đặt các công cụ phụ trợ (Middlewares)
app.use(cors()); // Cho phép Frontend gọi API không bị lỗi bảo mật
app.use(express.json()); // Cho phép server đọc hiểu dữ liệu JSON

// 3. Khai báo các đường dẫn (Routes)
app.use('/api/auth', authRoutes);

// 4. Bật server chạy lên
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy ngon lành tại cổng ${PORT}`);
});