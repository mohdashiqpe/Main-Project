document.addEventListener('DOMContentLoaded', function () {
    firstnameinput.addEventListener('input', validatefname); 
    lastnameinput.addEventListener('input', validatelname);
    inputEmail.addEventListener('input', validateEmail);
    inputPassword1.addEventListener('input', validatePassword);
    inputPassword2.addEventListener('input', validateConfirmPassword);
});

