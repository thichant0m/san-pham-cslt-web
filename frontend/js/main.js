// Cập nhật giao diện thanh điều hướng theo trạng thái đăng nhập
function updateNav() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.getElementById('nav-links');
    
    if (user) {
        let linksHtml = `<span>Chào, ${user.name}</span>`;
        if (user.role === 'admin') linksHtml += `<a href="admin.html" class="btn btn-outline">Quản lý Admin</a>`;
        if (user.role === 'owner' || user.role === 'admin') linksHtml += `<a href="post-create.html" class="btn">Đăng phòng</a>`;
        linksHtml += `<button onclick="logout()" class="btn btn-outline">Đăng xuất</button>`;
        navLinks.innerHTML = linksHtml;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', updateNav);