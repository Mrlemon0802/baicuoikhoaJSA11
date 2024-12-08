const apiEndpoint = "https://671e105c1dfc429919812c3e.mockapi.io/api/DATA/product"; // Thay bằng link MockAPI của bạn

// Lấy danh sách sản phẩm
function fetchProducts() {
    const loader = document.getElementById("product-list");
    loader.innerHTML = '<div class="text-center">Đang tải sản phẩm...</div>';

    fetch(apiEndpoint)
        .then((response) => {
            if (!response.ok) throw new Error("Không thể tải sản phẩm.");
            return response.json();
        })
        .then((products) => {
            if (products.length === 0) throw new Error("Không có sản phẩm nào.");
            displayProducts(products);
        })
        .catch((error) => {
            console.error(error.message);
            loader.innerHTML = `<div class="text-danger">${error.message}</div>`;
        });
}

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = products
        .map(
            (product) => `
        <div class="col">
            <div class="card h-100">
                <img src="${product.image || "default-image.jpg"}" alt="${product.name}" class="ao">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text"><strong>Giá:</strong> ${product.price.toLocaleString()} VND</p>
                    <button class="btn btn-primary" onclick="showModal(${product.id})">Xem chi tiết</button>
                    <button 
                        class="btn btn-success" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        onclick="addToCart(event)">Thêm vào giỏ</button>
                </div>
            </div>
        </div>`
        )
        .join("");
}




// Hiển thị modal
function showModal(productId) {
    fetch(`${apiEndpoint}/${productId}`)
        .then((response) => {
            if (!response.ok) throw new Error("Không thể tải chi tiết sản phẩm.");
            return response.json();
        })
        .then((product) => {
            document.getElementById("product-name").innerText = product.name || "Không rõ tên";
            document.getElementById("product-description").innerText = product.description || "Không có mô tả.";
            document.getElementById("product-image").src = product.image || "default-image.jpg";
            document.getElementById("product-price").innerText = product.price || "N/A";
            const modal = new bootstrap.Modal(document.getElementById("product-modal"));
            modal.show();
        })
        .catch((error) => {
            console.error(error.message);
            createAlertBox("Không thể hiển thị chi tiết sản phẩm.", "danger");
        });
}

function closeModal() {
    const modalElement = document.getElementById("product-modal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
        modal.hide();
    }
}


// Tạo thông báo
function createAlertBox(message, backgroundColor, borderColor, duration) {
    const alertBox = document.createElement('div');
    alertBox.innerText = message;
    alertBox.style.position = 'fixed';
    alertBox.style.right = '20px';
    alertBox.style.padding = '10px';
    alertBox.style.backgroundColor = backgroundColor;
    alertBox.style.border = `1px solid ${borderColor}`;
    alertBox.style.borderRadius = '10px';
    alertBox.style.zIndex = 1000;
    alertBox.className = 'alert-box';

    const alertBoxes = document.querySelectorAll('.alert-box');
    const alertCount = alertBoxes.length;
    const alertHeight = 50;
    const topPosition = 20 + (alertCount * alertHeight);

    alertBox.style.top = topPosition + 'px';

    document.body.appendChild(alertBox);

    setTimeout(() => {
        document.body.removeChild(alertBox);
    }, duration);
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(event) {
    event.preventDefault();

    try {
        // Lấy thông tin từ nút được nhấn
        const button = event.currentTarget;
        const id = button.getAttribute("data-id");
        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        // Kiểm tra nếu localStorage hoạt động
        if (!window.localStorage) {
            createAlertBox('Trình duyệt của bạn không hỗ trợ lưu trữ giỏ hàng.', 'red', 'white', 5000);
            return;
        }

        // Lấy giỏ hàng từ localStorage hoặc tạo mới
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = cart.findIndex(item => item.id === id);

        if (itemIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            cart[itemIndex].quantity += 1;
            createAlertBox(`Đã tăng số lượng ${name} trong giỏ hàng.`, 'lightgreen', 'green', 3000);
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm mới
            cart.push({ id, name, price, quantity: 1 });
            createAlertBox(`${name} đã được thêm vào giỏ hàng!`, 'lightblue', 'blue', 3000);
        }

        // Lưu giỏ hàng trở lại localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        createAlertBox('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.', 'red', 'white', 5000);
    }
}



// Cập nhật lại giỏ hàng khi thay đổi số lượng sản phẩm
function updateQuantity(productId, quantity) {
    if (quantity <= 0 || isNaN(quantity)) {
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity = parseInt(quantity);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Cập nhật lại giỏ hàng và tổng số tiền
        viewCart();
    }
}

// Xóa sản phẩm khỏi giỏ hàng và cập nhật lại modal
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Lọc ra các sản phẩm còn lại sau khi xóa sản phẩm có id tương ứng
    cart = cart.filter(item => item.id !== productId);

    // Lưu lại giỏ hàng đã cập nhật vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Cập nhật lại giỏ hàng và tổng số tiền
    viewCart();
}

// Hiển thị giỏ hàng trong modal và cập nhật lại tổng số tiền
function viewCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContent = document.getElementById("cart-content");

    if (cart.length === 0) {
        cartContent.innerHTML = "<p>Giỏ hàng của bạn đang trống!</p>";
    } else {
        const productList = cart
            .map((item) => `
                <div class="cart-item">
                    <h5>${item.name}</h5>
                    <p>Giá: ${(item.price * item.quantity).toLocaleString()} VND</p>
                    <label for="quantity-${item.id}">Số lượng: </label>
                    <input 
                        type="number" 
                        id="quantity-${item.id}" 
                        value="${item.quantity}" 
                        min="1" 
                        class="form-control"
                        onchange="updateQuantity(${item.id}, this.value)"
                    >
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Xóa</button>
                </div>
            `).join('');

        cartContent.innerHTML = productList;

        // Tính tổng số tiền
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartContent.innerHTML += `<hr><p><strong>Tổng số tiền: ${totalAmount.toLocaleString()} VND</strong></p>`;
    }

    // Mở modal giỏ hàng
    const cartModal = new bootstrap.Modal(document.getElementById("cart-modal"));
    cartModal.show();
}


// Thêm sản phẩm vào giỏ hàng (không thay đổi)
function addToCart(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const id = button.getAttribute("data-id");
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    if (!window.localStorage) {
        createAlertBox('Trình duyệt của bạn không hỗ trợ lưu trữ giỏ hàng.', 'red', 'white', 5000);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
        createAlertBox(`Đã tăng số lượng ${name} trong giỏ hàng.`, 'lightgreen', 'green', 3000);
    } else {
        cart.push({ id, name, price, quantity: 1 });
        createAlertBox(`${name} đã được thêm vào giỏ hàng!`, 'lightblue', 'blue', 3000);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Đóng modal giỏ hàng
function closeCartModal() {
    const cartModal = bootstrap.Modal.getInstance(document.getElementById("cart-modal"));
    cartModal.hide(); // Đóng modal
}

// Đặt lại giỏ hàng
function resetCart() {
    localStorage.removeItem('cart');
    createAlertBox("Đã đặt lại giỏ hàng!", 'lightcoral', 'red', 3000);

    // Cập nhật lại giỏ hàng trên giao diện
    viewCart();
}

// Mua giỏ hàng
function buyCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        createAlertBox("Giỏ hàng của bạn đang trống!", 'lightcoral', 'red', 3000);
    } else {
        localStorage.removeItem('cart');
        createAlertBox("Đã mua giỏ hàng!", 'lightgreen', 'green', 3000);

        // Cập nhật lại giỏ hàng trên giao diện
        viewCart();
    }
}

// Bắt đầu
window.onload = () => {
    fetchProducts();
};