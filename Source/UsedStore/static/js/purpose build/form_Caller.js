document.addEventListener("DOMContentLoaded", function () {
    fullNameInput.addEventListener("input", validateFullName);
    emailInput.addEventListener("input", validateEmail);
    newPasswordInput.addEventListener("input", validatePassword);
    confirmPasswordInput.addEventListener("input", validateConfirmPassword)
});

regForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var b1 = validateFullName();
    var b2 = validateEmail();
    var b3 = validatePassword();
    var b4 = validateConfirmPassword();
    if(b1 && b2 && b3 && b4){
        console.log("done");
        regForm.submit();
    }else{
        console.log("Un Done");
    }
})
