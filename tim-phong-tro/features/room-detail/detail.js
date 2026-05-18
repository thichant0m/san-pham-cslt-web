/**
 *logic hiển thị chi tiết 1 phòng trọ
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Phân tích URL để lấy ID phòng (Ví dụ: detail.html?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = parseInt(urlParams.get("id"));

    if (!roomId) {
        document.querySelector(".detail-container").innerHTML = "<p style=\"padding: 50px; text-align: center; color: red;\">Không tìm thấy thông tin phòng! Lỗi mã ID (VD test thử: thêm ?id=1 vào url).</p>";
        return;
    }

    if (typeof roomData === "undefined") {
        console.error("Lỗi: Mảng roomData chưa được định nghĩa.");
        return;
    }

    // 2. tìm phòng trong mảng roomData dựa trên ID
    const room = roomData.find(r => r.id === roomId);

    if (!room) {
        document.querySelector(".detail-container").innerHTML = "<p style=\"padding: 50px; text-align: center; color: red;\">Phòng trọ này không tồn tại hoặc đã bị xóa!</p>";
        return;
    }

    // 3. đõ dữ liệu của phòng ra HTML
    renderRoomDetail(room);
});

function renderRoomDetail(room) {
    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + " đ/tháng";

    document.title = room.title + " - Tìm Phòng Trọ";

    const mainImage = document.getElementById("detail-image");
    if (mainImage) mainImage.src = room.image;

    const thumbnailsContainer = document.getElementById("detail-thumbnails");
    if (thumbnailsContainer) {
        let thumbnailsHtml = "";
        for (let i = 0; i < 4; i++) {
            thumbnailsHtml += `
                <div class="thumb-item">
                    <img src="${room.image}" alt="Ảnh phụ ${i + 1}" onclick="document.getElementById('detail-image').src = this.src" style="width: 100%; border-radius: 8px; cursor: pointer;">
                </div>
            `;
        }
        thumbnailsContainer.style.display = "grid";
        thumbnailsContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
        thumbnailsContainer.style.gap = "10px";
        thumbnailsContainer.style.marginTop = "15px";
        thumbnailsContainer.innerHTML = thumbnailsHtml;
    }

    document.getElementById("detail-price").textContent = formatPrice(room.price);
    document.getElementById("detail-title").textContent = room.title;
    
    // Đổ dữ liệu Address, specs
    const detailAddress = document.getElementById("detail-address");
    if(detailAddress && (room.address || room.city)) {
        detailAddress.textContent = `${room.address || ""}, ${room.district || ""}, ${room.city || ""}`;
    }

    const bedText = (room.type === "Studio" || room.bedrooms === "Studio") ? "Studio" : `${room.bedrooms} PN`;
    
    document.getElementById("detail-area").textContent = `${room.area} m²`;
    document.getElementById("detail-bed").textContent = bedText;
    document.getElementById("detail-bath").textContent = `${room.bathrooms} WC`;

    // Cập nhật Badges (nếu có)
    const badgesContainer = document.getElementById("detail-badges");
    if (badgesContainer && room.badges && room.badges.length > 0) {
        badgesContainer.innerHTML = room.badges.map(b => `<span class="badge" style="background: #16a34a; color: white; padding: 4px 10px; border-radius: 4px; font-size: 13px; margin-right: 8px; display: inline-block;">${b}</span>`).join("");
    }

    const amenitiesContainer = document.getElementById("detail-amenities");
    const amenityMap = {
        "wifi": "<i class=\"fas fa-wifi\"></i> Wifi miễn phí",
        "may_giat": "<i class=\"fas fa-tshirt\"></i> Máy giặt",
        "dieu_hoa": "<i class=\"fas fa-snowflake\"></i> Điều hòa",
        "cho_de_xe": "<i class=\"fas fa-motorcycle\"></i> Chỗ để xe",
        "camera": "<i class=\"fas fa-video\"></i> Camera an ninh",
        "tulanh": "<i class=\"fas fa-temperature-low\"></i> Tủ lạnh"
    };

    if (amenitiesContainer && room.amenities) {
        let amHtml = "";
        room.amenities.forEach(am => {
            if (amenityMap[am]) {
                amHtml += `<li style="flex-basis: 45%; margin-bottom: 15px;"><span style="color: #16a34a; margin-right: 10px;">${amenityMap[am]}</span></li>`;
            }
        });
        amenitiesContainer.style.display = "flex";
        amenitiesContainer.style.flexWrap = "wrap";
        amenitiesContainer.style.listStyle = "none";
        amenitiesContainer.style.padding = "0";
        amenitiesContainer.innerHTML = amHtml;
    }
}

