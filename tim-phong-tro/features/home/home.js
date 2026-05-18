//Ham su ly logic rieng cho trang chu

document.addEventListener("DOMContentLoaded", () => {
    renderFeaturedRooms();
});

// Ham lay dư lieu 6 phong va dang len trang chu
function renderFeaturedRooms() {
    const container = document.getElementById("featured-rooms-container");
    if (!container) return;

    // dịnh dạng giá tiền VNĐ
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ/tháng';
    };

    // lay 6 phong dau tien lam noi bat
    const featuredRooms = roomData.slice(0, 6);

    let htmlContent = "";

    featuredRooms.forEach(room => {
        // xây dựng chuỗi badge (Mới đăng, Kiểm duyệt, ...)
        let badgesHtml = "";
        if (room.badges && room.badges.length > 0) {
            badgesHtml = room.badges.map(badge => `<span class="badge">${badge}</span>`).join('');
        }

        // thông tin phòng ngủ (Nếu là studio thì in ra chữ studio, ngược lại in số phòng)
        const bedText = room.type === 'Studio' || room.bedrooms === 'Studio' ? 'Studio' : `${room.bedrooms} Ngủ`;

        htmlContent += `
            <div class="room-card">
                <div class="room-img">
                    <img src="${room.image || 'default-image.jpg'}" alt="${room.title}">
                    <div class="badges-container">${badgesHtml}</div>
                </div>
                <div class="room-content">
                    <h3 class="room-title">
                        <a href="features/room-detail/detail.html?id=${room.id}">${room.title}</a>
                    </h3>
                    <p class="room-price">${formatPrice(room.price)}</p>
                    <div class="room-info">
                        <span><i class="fas fa-ruler-combined"></i> ${room.area}m²</span>
                        <span><i class="fas fa-bed"></i> ${bedText}</span>
                        <span><i class="fas fa-bath"></i> ${room.bathrooms} Tắm</span>
                    </div>
                    <p class="room-address">
                        <i class="fas fa-map-marker-alt"></i> ${room.address}, ${room.district}
                    </p>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
}