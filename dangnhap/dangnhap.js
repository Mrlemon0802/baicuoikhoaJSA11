// Truy xuất các phần tử từ DOM
const usernameInput = document.querySelector("input[type='text']"); // Input tên đăng nhập
const passwordInput = document.querySelector("input[type='password']"); // Input mật khẩu
const loginButton = document.querySelector("button[type='submit']"); // Nút đăng nhập

// Thêm sự kiện click vào nút đăng nhập
loginButton.addEventListener("click", function(e) {
    e.preventDefault(); // Ngăn hành vi mặc định của form (chuyển trang)

    // Lấy giá trị từ các ô input
    const usernameValue = usernameInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // Lấy thông tin tài khoản từ localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
        alert("Không tìm thấy tài khoản nào! Hãy đăng ký trước.");
        return;
    }

    // Chuyển đổi thông tin tài khoản từ localStorage thành đối tượng
    const userData = JSON.parse(storedUser);

    // Kiểm tra thông tin đăng nhập
    if (usernameValue === userData.username && passwordValue === userData.password) {
        alert("Đăng nhập thành công!");
        // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
        window.location.href = "../giaodien/a_giao_dien.html"; // Trang chủ sau khi đăng nhập
    } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
});