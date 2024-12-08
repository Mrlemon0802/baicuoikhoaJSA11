//querySelector
//input3
const nameInput = document.querySelector("#name");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
//button
const submitButton = document.querySelector("#submit");
const nameError = document.querySelector(".error-name")
const passwordError = document.querySelector(".error-password")
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/;
// thuc hien su kien click dang ky
submitButton.addEventListener("click", function(e) {
    e.preventDefault();
    // lay gia tri cua input
    const nameValue = nameInput.value;
    //password
    const passwordValue = passwordInput.value.trim();
    console.log(passwordValue);
    if (!passwordValue.match(passwordRegex)) {
        passwordError.textContent = "password k hop le";
        passwordError.classList.add("error");
    } else {
        //check do dai cua name thoa man 8 ki tu
        if (nameValue.length < 8) {
            nameError.textContent = "name k hop le";
            nameError.classList.add("error");
        } else {
            //ca name va password da hop le
            const thongtin = JSON.stringify({
                name: nameValue,
                password: passwordValue,
            });
            localStorage.setItem("user", thongtin)
            alert("dang ky thanh cong")
            window.location.href = "./home.html"
        }
    }

});