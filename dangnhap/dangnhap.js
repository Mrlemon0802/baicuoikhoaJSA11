const userInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const buttonInput = document.querySelector("#btn");
// chuyen doi json sang object
const userInfo = JSON.parse(localStorage.getItem("user"));
console.log(userInfo.name);
console.log(userInfo.password);
// luu ra bien
const username = userInfo.name;
const password = userInfo.password;
// lay value
buttonInput.addEventListener("click", (e) => {
    e.preventDefault();
    // lay value tu form
    const userValue = userInput.value;
    const passwordValue = passwordInput.value;
    // so sanh value tu form va localStorage
    if (userValue === username && passwordValue === password) {
        alert("heyy dang nhap thanh cong");
        window.location = "./home.html";
    } else {
        alert("dang nhap sai nha");
    }
});