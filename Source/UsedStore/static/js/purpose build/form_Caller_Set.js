settingForm.addEventListener('submit', function(event){
    event.preventDefault();
    console.log('Reached');
    var b1 = validateFullName();
    var b2 = validateUsername();
    var b3 = customValidateEmail();
    var b4 = validateGender();
    var b5 = validateCountry();
    var b6 = validateState();
    var b7 = validateCity();
    var b8 = validatePhoneNumber();
    var b9 = validateStreetName();
    var b10 = validateAddress();
    if (b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9 && b10){ 
        settingForm.submit();
    }
});

// For Profile Validation
profileForm.addEventListener('submit', function(event){
    event.preventDefault();
    if(validateProfilePic()){
        profileForm.submit();
    }else{
        console.log('no');
    }
});

document.addEventListener("DOMContentLoaded", function (){
    fullNameInput.addEventListener('input', validateFullName);
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', customValidateEmail);
    genderSelect.addEventListener('click', validateGender);
    countrySelect.addEventListener('click', validateCountry);
    stateSelect.addEventListener('click', validateState);
    citySelect.addEventListener('click', validateCity);
    phoneNumberInput.addEventListener('input', validatePhoneNumber);
    streetName.addEventListener('input', validateStreetName);
    address.addEventListener('input', validateAddress);
});

document.getElementById('cancelBtn').addEventListener('click', function(){
    const newPasswordDiv = document.getElementById('newPasswordDiv');
    const newConfirmPasswordDiv = document.getElementById('newConfirmPasswordDiv');
    const oldPasswordDiv = document.getElementById('oldPasswordDiv');
    const newPasswordInputs = document.getElementById('password1');

    newConfirmPasswordDiv.style.display='none';
    newPasswordDiv.style.display='none';
    oldPasswordDiv.style.display='';
    newPasswordInputs.value='';
    newPasswordInput.classList.remove('is-invalid');
    confirmPasswordInput.classList.remove('is-invalid');
    newPasswordInput.classList.remove('is-valid');
    confirmPasswordInput.classList.remove('is-valid');
    document.getElementById("newPasswordError").classList.remove('invalid-feedback');
    document.getElementById("newPasswordError").classList.remove('valid-feedback');
    document.getElementById("ConfirmPasswordError").classList.remove('invalid-feedback');
    document.getElementById("ConfirmPasswordError").classList.remove('valid-feedback');
    document.getElementById("ConfirmPasswordError").textContent='';
    document.getElementById("newPasswordError").textContent='';
    newPasswordInput.value='';
    confirmPasswordInput.value='';
});

document.getElementById('nextBtn').addEventListener('click', function () {
    const currentPasswordError = document.getElementById('currentPasswordError');
    const newPasswordInputs = document.getElementById('password1');
    const currentPassword = newPasswordInputs.value.trim();

    const newPasswordDiv = document.getElementById('newPasswordDiv');
    const newConfirmPasswordDiv = document.getElementById('newConfirmPasswordDiv');
    const oldPasswordDiv = document.getElementById('oldPasswordDiv');

    if (newPasswordDiv.style.display != "none"){
        var v1 = validatePassword();
        var v2 = validateConfirmPassword();
        if (v1 && v2){
            const newPassword = newPasswordInput.value;
            const conPassword = confirmPasswordInput.value;
            const dataToSend = {
                key1: newPassword
            };

            fetch(`/updatePassword/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            }).then(response => response.json())
            .then((data) => {
                if (data.done){
                    document.getElementById('cancelBtn').click();
                    console.log(data);
                    return true;
                }
            }).catch(error => {
                console.error('Error:', error);
              });
        }
    }

    if(currentPassword.length === 0){
        currentPasswordError.classList.add("invalid-feedback");
        currentPasswordError.textContent = "Field Cannot be Empty";
        newPasswordInputs.classList.add("is-invalid");
        return false;
    }

    fetch(`/validatePassword/?password=${currentPassword}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (data.exists) {
                currentPasswordError.classList.remove("invalid-feedback");
                currentPasswordError.textContent = '';
                newPasswordInputs.classList.remove("is-invalid");
                console.log('Password is valid');
                newConfirmPasswordDiv.style.display='';
                newPasswordDiv.style.display='';
                oldPasswordDiv.style.display='none';
                newPasswordInput.addEventListener('input', validatePassword);
                confirmPasswordInput.addEventListener('input', validateConfirmPassword);
            } else {
                currentPasswordError.classList.add("invalid-feedback");
                currentPasswordError.textContent = "*Wrong Password";
                newPasswordInputs.classList.add("is-invalid");
                console.log('Password is invalid');
            }
        })
        .catch(error => {
            console.error("Error Loading:", error);
        });
});

function validateStreetName(){
    const regularExp = /^[a-zA-Z0-9\s.'#-]*$/;
    if (!regularExp.test(streetName.value) || streetName.value.length === 0) {
        streetName.classList.add('is-invalid');
        document.getElementById('streetError').innerHTML = 'Please enter a valid street name.';
        return false;
    } else {
        streetName.classList.remove('is-invalid');
        streetName.classList.add('is-valid');
        document.getElementById('streetError').innerHTML = '';
        return true;
    }
}

function validateAddress(){
    const regularExp = /^[a-zA-Z0-9\s,'.#-]*$/;
    if (!regularExp.test(address.value) || address.value.length === 0) {
        address.classList.add('is-invalid');
        document.getElementById('addressError').innerHTML = 'Please enter a valid address.';
        return false;
    } else {
        address.classList.remove('is-invalid');
        address.classList.add('is-valid');
        document.getElementById('addressError').innerHTML = '';
        return true;
    }
}