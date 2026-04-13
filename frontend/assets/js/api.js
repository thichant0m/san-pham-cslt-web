//==============================================================
// FILE NÀY CHUYÊN LÀM NHIỆM VỤ GỌI ĐIỆN VÀ NHẮN TIN VỚI BACKEND (MÁY CHỦ BẾP ĐÓ)
// Tách gọn ra đây để file giao diện HTML đỡ bị rối!
//==============================================================

// Đầu tiên là khai báo Địa chỉ nhà của Backend (Mặc định thường chạy cổng 3000 hoặc 5000)
// Khi nào up code lên mạng (Host) thì thay chữ localhost:3000 bằng tienmiennha.com
const API_URL = 'http://localhost:3000/api'; 

/**
 * Hàm lấy dữ liệu (apiFetch)
 * @param {string} endpoint - Cái đuôi mở rộng của trang. Vd: /auth/login hoặc /posts
 * @param {string} method - Phương thức: "GET" (Lọc tin), "POST" (Gửi đồ), "PUT" (Sửa), "DELETE" (Xóa)
 * @param {any} body - Cục hàng hóa cần gửi (VD: Form nhập username/password)
 * @param {boolean} isFormData - Đánh dấu xem cục hàng gửi là Ảnh/Video (FormData) hay là chữ JSON bình thường.
 * @returns {object} Phản hồi từ Server Backend
 */
async function apiFetch(endpoint, method = 'GET', body = null, isFormData = false) {
    
    // 1. Tạo tập hồ sơ (cấu hình gọi) gửi đi
    const options = {
        method: method, 
        headers: {} // Cái đầu giấy thư (chứa token, hoặc tem chú thích)
    };

    // 2. NHÉT TEM "TOKEN" BẢO MẬT VÀO NẾU CÓ ĐĂNG NHẬP RỒI
    // Nếu trong trình duyệt của người dùng có lưu Token (Chứng minh nhân dân của họ)
    const token = localStorage.getItem('token');
    if (token) {
        // Đính kèm nó vào tiêu đề bức thư theo chuẩn Authorization: Bearer <token>
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. XỬ LÝ HÀNG HÓA KHI GỬI (NẾU CÓ)
    if (body) {
        // Trường hợp 1: Người dùng gửi File Ảnh lên (isFormData = true)
        if (isFormData) {
            // Cứ thế mà ném nguyên cái bọc FormData đó vào đường bưu điện (body) này luôn
            // Trình duyệt sẽ tự động hiểu và gán nhãn "Nhà có Gửi Ảnh" vành ngoài
            options.body = body;
        } 
        
        // Trường hợp 2: Gửi chỉ bằng chữ bình thường như Username / Mật khẩu
        else { 
            // Dán nhãn lên "Đầu bức thư" báo cho Backend biết: "Này, tui gửi JSON (Chữ) cho bạn nhé!"
            options.headers['Content-Type'] = 'application/json';
            
            // Ép đống Dữ liệu Javascript thành text JSON (vì truyền qua mạng chỉ truyền được chữ thôi)
            options.body = JSON.stringify(body);
        }
    }

    // 4. BẮT ĐẦU VẬN CHUYỂN
    // fetch() giống chiếc xe tải vận chuyển đồ đi đến nơi quy định (API_URL + endpoint)
    // 'await' là chờ xe tải đó đi vô tới kho Backend rồi cầm phản hồi của Backend về lại đây
    const response = await fetch(API_URL + endpoint, options);

    // 5. MỞ QUÀ PHẢN HỒI
    let data;
    try {
        // Cố gắng đọc phản hồi thành ngôn ngữ Object Javascript để dùng
        data = await response.json();
    } catch {
        // Nếu Backend trả về lỗi tè le mà k phải mã JSON thì đánh dấu Null
        data = null; 
    }

    // 6. KIỂM TRA BẮT LỖI
    // response.ok là bằng TRUE khi Backend xử lý chạy trơn tru mượt mà (HTTP Code: 200, 201)
    // HTTP Code: 400 trở lên (Lỗi sai mật khẩu, sập mạng, k đủ quyền...)
    if (!response.ok) {
        // Phát một tiếng thét Lỗi bắn ra ngoài mặt trang HTML để code HTML dùng alert() la lên
        throw new Error(data?.message || 'Có lỗi nghiêm trọng! Máy chủ xì khói rùi!');
    }

    // Nếu an toàn ngon nghẻ -> Ném dữ liệu thành phẩm về.
    return data;
}
