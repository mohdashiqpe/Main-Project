const otpInput = document.getElementById('otp');

document.getElementById('regForm4').addEventListener('submit', function(event){
    event.preventDefault();
    if (emailInput){
        if (customValidateEmail()){
            document.getElementById('regForm4').submit();
        }
    }else if (otpInput){
        if (otpInput.value.trim().length == 0){
            document.getElementById('otpError').textContent = "Invalid OTP";
        }else{
            document.getElementById('regForm4').submit();   
        }
    }
});
