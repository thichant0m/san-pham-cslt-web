document.addEventListener("DOMContentLoaded", () => {
    console.log("Main JS loaded.");
    
    let basePath = './';
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        if (script.src.includes('shared/main.js')) {
            const src = script.getAttribute('src');
            basePath = src.replace('shared/main.js', '');
            break;
        }
    }

    renderHeader(basePath);
    renderFooter(basePath);

    //vong lap doi nen
    const bgImages = [
        basePath + 'assets/images/background1.jpg',
        basePath + 'assets/images/background2.jpg',
        basePath + 'assets/images/background3.jpg',
        basePath + 'assets/images/background4.jpg'
    ];

    let currentIndex = 0;

    // Hhàm thực hiện đổi ảnh nền
    function changeBackground() {
        currentIndex = (currentIndex + 1) % bgImages.length;
        document.body.style.backgroundImage = `url('${bgImages[currentIndex]}')`;
    }

    // dặt ảnh nền mặc định ngay khi load trang
    document.body.style.backgroundImage = `url('${bgImages[0]}')`;

    // cài đặt vòng lặp 60 giây để đổi ảnh nền
    setInterval(changeBackground, 60000);
});

async function renderHeader(basePath) {
    const headerContainer = document.getElementById("header-container");
    if (!headerContainer) return;

    try {
        const response = await fetch(`${basePath}shared/components/header.html`);
        let html = await response.text();
        
        // thay thế biến {basePath} để đường dẫn luôn đúng với trang hiện tại
        html = html.replace(/{basePath}/g, basePath);
        
        headerContainer.innerHTML = html;

        // xử lý hiển thị thông tin người dùng nếu đã đăng nhập
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const rightMenu = headerContainer.querySelector('.right-menu');
        
        if (currentUser && rightMenu) {
            rightMenu.innerHTML = `
                <span style="font-weight: 600; margin-right: 15px; color: #16a34a;">
                    <i class="fas fa-user-circle"></i> Xin chào, ${currentUser.name}
                </span>
                <a href="#" class="btn post-btn" style="margin-right: 15px;">Đăng tin miễn phí</a>
                <a href="#" id="logout-btn" class="login-btn" style="border-color: #ef4444; color: #ef4444;">Đăng xuất</a>
            `;

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('currentUser'); 
                    window.location.reload(); 
                });
            }
        }

        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mainNav = document.getElementById('main-nav');
        if (mobileBtn && mainNav) {
            mobileBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });
        }
    } catch (error) {
        console.error("Lỗi tải header:", error);
    }
}

function renderFooter(basePath) {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer style="background-color: #2c3e50; color: #fff; padding: 40px 0; margin-top: 50px;">
            <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                <div>
                    <h3 style="margin-bottom: 20px;">Tìm Phòng Trọ</h3>
                    <p style="color: #bdc3c7; line-height: 1.8;">Nền tảng tìm kiếm và cho thuê phòng trọ uy tín, nhanh chóng và hiệu quả nhất Việt Nam.</p>
                </div>
                <div>
                    <h3 style="margin-bottom: 20px;">Liên hệ</h3>
                    <p style="color: #bdc3c7; margin-bottom: 10px;"><i class="fas fa-phone"></i> 1900 1234</p>
                    <p style="color: #bdc3c7; margin-bottom: 10px;"><i class="fas fa-envelope"></i> hotro@timphongtro.vn</p>
                </div>
                <div>
                    <h3 style="margin-bottom: 20px;">Theo dõi chúng tôi</h3>
                    <div style="font-size: 24px; gap: 15px; display: flex;">
                        <a href="#" style="color: #fff;"><i class="fab fa-facebook"></i></a>
                        <a href="#" style="color: #fff;"><i class="fab fa-youtube"></i></a>
                        <a href="#" style="color: #fff;"><i class="fab fa-tiktok"></i></a>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #34495e; color: #7f8c8d;">
                <p>&copy; 2026 Tìm Phòng Trọ. Đã đăng ký bản quyền.</p>
            </div>
        </footer>
    `;
}