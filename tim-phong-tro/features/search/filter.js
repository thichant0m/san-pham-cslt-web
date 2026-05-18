/**
 *  logic hiển thị và lọc kết quả cho trang Tìm kiếm
 */

// mảng chứa các phòng sẽ hiển thị (Mặc định là tất cả 15 phòng từ data.js)
let currentRooms = roomData;

document.addEventListener("DOMContentLoaded", () => {
    // Render toàn bộ 15 phòng trọ ra lần đầu tiên
    renderSearchResults(currentRooms);

    // gắn sự kiện lắng nghe sự thay đổi của các bộ lọc
    setupFilters();
});

/**
 * hàm thiết lập các sự kiện cho bộ lọc bên tay trái
 */
function setupFilters() {
    // lấy ô nhập liệu text (nếu có)
    const textInput = document.getElementById('filter-text');
    if (textInput) {
        textInput.addEventListener('input', runFilterLogic);
    }

    const typeCheckboxes = document.querySelectorAll('.filter-type');
    const priceRadios = document.querySelectorAll('.filter-price');
    const amenityCheckboxes = document.querySelectorAll('.filter-amenity');

    const allFilters = [...typeCheckboxes, ...priceRadios, ...amenityCheckboxes];

    allFilters.forEach(input => {
        input.addEventListener('change', runFilterLogic);
    });
}

/**
 * hàm chạy logic lọc mỗi khi người dùng click vào filter
 */
function runFilterLogic() {
    // 0. Lấy chuỗi tìm kiếm văn bản
    const textInput = document.getElementById('filter-text');
    const searchText = textInput ? textInput.value.trim().toLowerCase() : '';

    // 1. Lấy ra các Loại phòng đang được chọn
    const checkedTypes = Array.from(document.querySelectorAll('.filter-type:checked')).map(cb => cb.value);
    
    // 2. Lấy ra Mức giá đang được chọn (Lưu ý: radio input nên luôn có 1 tuỳ chọn mặc định được check như 'all')
    const selectedPriceElement = document.querySelector('.filter-price:checked');
    const selectedPrice = selectedPriceElement ? selectedPriceElement.value : 'all';

    // 3. Lấy ra các Tiện ích đang được chọn
    const checkedAmenities = Array.from(document.querySelectorAll('.filter-amenity:checked')).map(cb => cb.value);

    // Bắt đầu lọc từ mảng gốc roomData
    let filteredRooms = roomData.filter(room => {
        // --- Lọc Theo Tên ---
        if (searchText && !room.title.toLowerCase().includes(searchText)) {
            return false;
        }

        // --- Lọc Loại phòng ---
        if (checkedTypes.length > 0 && !checkedTypes.includes(room.type)) {
            return false;
        }

        // --- Lọc Giá ---
        if (selectedPrice === 'under2' && room.price >= 2000000) {
            return false;
        } else if (selectedPrice === '2to5' && (room.price < 2000000 || room.price > 5000000)) {
            return false;
        } else if (selectedPrice === 'over5' && room.price <= 5000000) {
            return false;
        }

        // --- Lọc Tiện ích ---
        if (checkedAmenities.length > 0) {
            const hasAllAmenities = checkedAmenities.every(amenity => room.amenities.includes(amenity));
            if (!hasAllAmenities) {
                return false;
            }
        }

        return true; 
    });

    renderSearchResults(filteredRooms);
}

/**
 * hàm lấy dữ liệu từ một mảng phòng trọ và render ra màn hình Search
 */
function renderSearchResults(roomsToRender) {
    const container = document.getElementById("search-results-container");
    if (!container) return;

    // định dạng giá tiền VNĐ
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ/tháng';
    };

    let htmlContent = "";

    roomsToRender.forEach(room => {
        let badgesHtml = "";
        if (room.badges && room.badges.length > 0) {
            badgesHtml = room.badges.map(badge => `<span class="badge">${badge}</span>`).join('');
        }

        // Thông tin phòng ngủ (Nếu là Studio thì in ra chữ Studio, ngược lại in số phòng)
        const bedText = room.type === 'Studio' || room.bedrooms === 'Studio' ? 'Studio' : `${room.bedrooms} Ngủ`;

        htmlContent += `
            <div class="room-card">
                <div class="room-img">
                    <img src="${room.image || 'default-image.jpg'}" alt="${room.title}">
                    <div class="badges-container">${badgesHtml}</div>
                </div>
                <div class="room-content">
                    <h3 class="room-title">
                        <!-- Đường dẫn phải lùi 1 cấp do đang ở thư mục search -->
                        <a href="../room-detail/detail.html?id=${room.id}">${room.title}</a>
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

    // Nếu không có phòng nào thoả mãn
    if (roomsToRender.length === 0) {
        htmlContent = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Không tìm thấy phòng trọ nào phù hợp với yêu cầu của bạn!</p>`;
    }

    container.innerHTML = htmlContent;
}