// Hàm để load giỏ hàng từ localStorage và hiển thị
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || []; // Lấy dữ liệu giỏ hàng
    const cartTableBody = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');

    let totalAmount = 0; // Tổng tiền giỏ hàng

    // Làm trống bảng trước khi thêm dữ liệu
    cartTableBody.innerHTML = '';

    // Lặp qua từng sản phẩm trong giỏ hàng
    cartItems.forEach((item, index) => {
        const { name, price, quantity } = item;
        const totalPrice = Number(price) * Number(quantity); // Đảm bảo là số

        // Tạo dòng dữ liệu cho từng sản phẩm
        const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${name}</td>
          <td>${Number(price).toLocaleString()} Nghìn VND</td>
          <td>${quantity}</td>
          <td>${totalPrice.toLocaleString()} Nghìn VND</td>
        </tr>
      `;
        cartTableBody.innerHTML += row;

        // Cộng dồn vào tổng tiền
        totalAmount += totalPrice;
    });

    // Hiển thị tổng tiền
    totalAmountElement.textContent = `Tổng Tiền: ${totalAmount.toLocaleString()} Nghìn VND`;
}

// Hàm xử lý thanh toán
function checkout() {
    alert('Thanh toán thành công!');
    localStorage.removeItem('cart'); // Xóa giỏ hàng khỏi localStorage
    window.location.reload(); // Tải lại trang để làm mới giỏ hàng
}

// Gọi hàm loadCart khi trang được load
window.onload = loadCart;