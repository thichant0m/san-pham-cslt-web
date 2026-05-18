//==============================================================
// FILE NÀY CHỨA CÁC ĐOẠN CODE JAVASCRIPT CHẠY CHUNG CHO TOÀN BỘ WEBSITE
// Nó đảm nhận việc nạp Header và quản lý việc Đăng nhập/Đăng xuất
//==============================================================

// Hàm 1: Hàm này sẽ "nạp" nội dung của thanh điều hướng (header.html) vào các trang web khác
async function loadHeader() {
    try {
        // fetch là câu lệnh đi 'xin' dữ liệu từ đường dẫn tới file header.html
        const response = await fetch('components/header.html');
        
        if (!response.ok) throw new Error('Không thể tải file header.html');
        
        // Hứng lấy kết quả trả về dưới dạng chữ (đoạn text HTML)
        const html = await response.text();
        
        // Tìm cái thẻ `<div id="header-placeholder">` trong file gọi đến nó (như index.html)
        const placeholder = document.getElementById('header-placeholder');
        
        if (placeholder) {
            // Nhét toàn bộ đoạn chữ HTML của header vào bên trong thẻ div đó
            placeholder.innerHTML = html;
            
            // Sau khi nhét HTML xong, gọi hàm kiểm tra trạng thái đăng nhập để cập nhật lại mấy nút bấm (Login / Register / User)
            updateNav();
        }
    } catch (err) {
        console.error("Lỗi khi load header: ", err);
    }
}

// Hàm 2: Hàm này giúp thay đổi nút Đăng nhập / Đăng xuất tùy vào tình trạng (Đã vào trang web trước đó chưa)
function updateNav() {
    // 1. Lấy thông tin user đã lưu trong bộ nhớ tạm của trình duyệt (localStorage) khi nãy vừa đăng nhập
    // JSON.parse giúp biến một đoạn chuỗi text thành Object của Javascript (để lấy ra tên, quyền (role))
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    // 2. Tìm cái thẻ chứa các nút Đăng Nhập/Đăng Ký
    const navLinks = document.getElementById('nav-links');
    
    // Nếu navLinks không tồn tại (lỗi chưa tải HTML xong) thì bỏ qua tránh báo lỗi
    if (!navLinks) return;
    
    // 3. Bắt đầu xét điều kiện hiển thị
    if (user) {
        // NẾU ĐÃ ĐĂNG NHẬP:
        // Đổi nội dung thành dòng chào đón tên người dùng
        let linksHtml = `<span style="margin-right: 15px;">Xin chào, <b>${user.name}</b></span>`;
        
        // Nếu là tài khoản Admin, hiện nút "Quản lý Admin"
        if (user.role === 'admin') {
            linksHtml += `<a href="admin.html" class="btn btn-outline">Vào Quản Trị</a>`;
        }
        
        // Nếu là chủ nhà (owner) hoặc Admin, hiện thêm nút "Đăng phòng"
        if (user.role === 'owner' || user.role === 'admin') {
            linksHtml += `<a href="dang-tin.html" class="btn">Đăng phòng trọ</a>`;
        }
        
        // Cuối cùng, dù là ai vẫn luôn có nút "Đăng xuất"
        linksHtml += `<button onclick="logout()" class="btn btn-outline" style="margin-left: 10px; background: #dc3545; color: white;">Đăng xuất</button>`;
        
        // Gắn nút mới vào vị trí cũ (ghè đè lên chữ đăng nhập đăng ký)
        navLinks.innerHTML = linksHtml;
    } else {
        // NẾU CHƯA ĐĂNG NHẬP: Hiện lại nút ở Header ban đầu
        navLinks.innerHTML = `
            <a href="login.html" class="btn btn-outline">Đăng nhập</a>
            <a href="register.html" class="btn">Đăng ký</a>
            <a href="dang-tin.html" class="btn">Đăng Tin (Cần ĐN)</a>
        `;
    }
}

// Hàm 3: Hàm xử lý hành động Đăng xuất
function logout() {
    // Xóa Token (chìa khóa xác thực được cấp khi đăng nhập) và thông tin User trong bộ nhớ trình duyệt
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reload (chuyển hướng) người dùng trở lại Trang chủ sau khi xóa
    window.location.href = 'index.html';
}

// ==========================================
// CHẠY LỆNH: 
// Lắng nghe sự kiện DOMContentLoaded (có nghĩa là khi một file HTML như index.html được tải xong bố cục hoàn hoàn)
// thì bắt đầu chạy hàm `loadHeader` tự động.
// ==========================================
document.addEventListener('DOMContentLoaded', loadHeader);
