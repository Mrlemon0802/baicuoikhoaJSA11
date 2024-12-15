// Truy xuất các phần tử từ DOM
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const phoneInput = document.getElementById('phone');

// Thêm sự kiện submit vào form
registerForm.addEventListener("submit", function(e) {
    e.preventDefault(); // Ngăn form submit mặc định

    // Lấy giá trị từ các ô input
    const usernameValue = usernameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const confirmPasswordValue = confirmPasswordInput.value.trim();
    const phoneValue = phoneInput.value.trim();

    // Kiểm tra các điều kiện nhập liệu
    if (passwordValue !== confirmPasswordValue) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp!");
        return;
    }

    if (usernameValue.length < 3 || passwordValue.length < 6) {
        alert("Tên đăng ký và mật khẩu phải có ít nhất 3 ký tự và 6 ký tự.");
        return;
    }

    if (phoneValue.length < 10) {
        alert("Số điện thoại phải có ít nhất 10 chữ số.");
        return;
    }

    // Tạo đối tượng lưu trữ thông tin người dùng
    const user = {
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        phone: phoneValue,
    };

    // Lưu thông tin người dùng vào localStorage dưới key 'user'
    localStorage.setItem("user", JSON.stringify(user));

    // Thông báo đăng ký thành công và chuyển đến trang đăng nhập
    alert("Đăng ký thành công!");
    window.location.href = "../dangnhap/dang_nhap.html"; // Chuyển đến trang đăng nhập
});