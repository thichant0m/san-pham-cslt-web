const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Thay cái chuỗi ở dưới bằng đường link MongoDB của bạn
        const uri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/ten_database_cua_ban'; 
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Đã kết nối thành công với MongoDB!');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        process.exit(1); // Thoát chương trình nếu lỗi
    }
};

module.exports = connectDB;