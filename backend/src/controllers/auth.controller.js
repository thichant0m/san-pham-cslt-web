const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đường dẫn tới file text chứa dữ liệu (nằm ở thư mục gốc backend)
const usersFile = path.join(__dirname, '../../users.json');

// Hàm hỗ trợ: Đọc danh sách user từ file
const getUsers = () => {
    if (!fs.existsSync(usersFile)) return []; // Nếu file chưa có thì trả về mảng rỗng
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data || '[]');
};

// Hàm hỗ trợ: Lưu danh sách user vào file
const saveUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// ĐĂNG KÝ
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const users = getUsers();

        // Kiểm tra email đã tồn tại chưa
        const userExists = users.find(u => u.email === email);
        if (userExists) return res.status(400).json({ message: "Email đã được sử dụng!" });

        // Mã hóa mật khẩu và tạo user mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = { 
            id: Date.now().toString(), // Tạo ID ngẫu nhiên bằng thời gian
            name, 
            email, 
            password: hashedPassword 
        };

        // Thêm user vào danh sách và lưu lại vào file
        users.push(newUser);
        saveUsers(users);

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = getUsers();

        // Tìm user theo email trong file
        const user = users.find(u => u.email === email);
        if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại!" });

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

        // Tạo Token
        const token = jwt.sign({ id: user.id }, 'khoa_bi_mat_tam_thoi', { expiresIn: '1d' });

        res.status(200).json({
            message: "Đăng nhập thành công!",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};