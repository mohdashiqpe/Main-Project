// Validation Definition's
function validateFullName() {
  const errorMsgDiv = document.getElementById("fullNameError");
  const fullName = fullNameInput.value;

  var nameRegex = /^(?!([A-Za-z])\1+$)[A-Za-z][A-Za-z\s]*$/;

  if (fullName.trim().length <= 3) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "This Field cannot be Empty.";
    fullNameInput.classList.add("is-invalid");
    return false;
  } else if (!nameRegex.test(fullName)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent =
      "Should only contain Aplphabets Not Numbers or Special Charecter";
    fullNameInput.classList.add("is-invalid");
    return false;
  } else if (/\s{2,}/.test(fullName)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "Name Cannot Contain Multiple White Space, Sir";
    fullNameInput.classList.add("is-invalid");
    return false;
  } else if (!/^[^\s].*$/.test(fullName)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "Cannot begin with WhiteSpace.";
    fullNameInput.classList.add("is-invalid"); 
    return false;
  } else {
    errorMsgDiv.className = "valid-feedback";
    errorMsgDiv.textContent = "Looks Good!";
    fullNameInput.classList.remove("is-invalid");
    fullNameInput.classList.add("is-valid");
    return true;
  }
}

// E-Mail Validation
function validateEmail() {
  const emailErrorDiv = document.getElementById("emailError");
  const email = emailInput.value.trim();

  const regex = /^[a-zA-Z][a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(email)) {
    emailErrorDiv.classList.add("invalid-feedback");
    emailErrorDiv.textContent = "Invalid email address.";
    emailInput.classList.add("is-invalid");
    return false;
  } else if (email.length == 0) {
    emailErrorDiv.classList.add("invalid-feedback");
    emailErrorDiv.textContent = "This Field Cannot be Empty.";
    emailInput.classList.add("is-invalid");
    return false;
  } else {
    return fetch(`/check_user_exists/?email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Here");
        const bool = data.exists;
        if (document.getElementById("oldmail")) {
          if (document.getElementById("oldmail").value == email) {
            emailErrorDiv.className = "valid-feedback";
            emailErrorDiv.textContent = "Looks Good!";
            emailInput.classList.remove("is-invalid");
            emailInput.classList.add("is-valid");
            return true;
          }
        }

        if (!bool) {
          emailErrorDiv.className = "valid-feedback";
          emailErrorDiv.textContent = "Looks Good!";
          emailInput.classList.remove("is-invalid");
          emailInput.classList.add("is-valid");
          return true;
        } else {
          emailErrorDiv.classList.add("invalid-feedback");
          emailErrorDiv.textContent = "User Already Exists.";
          emailInput.classList.add("is-invalid");
          return false;
        }
      })
      .catch((error) => {
        console.error(error); // Handle fetch errors if needed.
        return false;
      });
  }
}

function validateUsername() {
  const usernameError = document.getElementById("usernameError");
  const username = usernameInput.value;

  const regex = /^(?!^[0-9])(?!([a-zA-Z_])\1+$)[a-zA-Z0-9_-]{3,20}$/; // Setting Up Regular Expression
  const match = username.match(regex);
  // const noMatch = username.match(/\s/)
  if (!/^(?!([A-Za-z0-9])\1+$).+$/.test(username)) {
    usernameError.classList.add("invalid-feedback");
    usernameError.textContent = "*Invalid Username";
    usernameInput.classList.add("is-invalid");
    return false;
  }

  if (!regex.test(username)) {
    if (username.trim() === "") {
      usernameError.classList.add("invalid-feedback");
      usernameError.textContent = "*This Field Cannot be empty";
      usernameInput.classList.add("is-invalid");
      return false;
    } else if (!username.match(/^[a-zA-Z]/)) {
      usernameError.classList.add("invalid-feedback");
      usernameError.textContent = "*Username must start with a letter.";
      usernameInput.classList.add("is-invalid");
      return false;
    } else if (!username.match(/[a-zA-Z0-9_-]{2,19}$/)) {
      usernameError.classList.add("invalid-feedback");
      usernameError.textContent =
        "*Username must be between 3 and 20 characters and can only contain letters, numbers, underscores, or hyphens.";
      usernameInput.classList.add("is-invalid");
      return false;
    } else if (username.match(/\s/)) {
      usernameError.classList.add("invalid-feedback");
      usernameError.textContent = "*White Space Not Allowed";
      usernameInput.classList.add("is-invalid");
      return false;
    } else {
      usernameError.classList.add("invalid-feedback");
      usernameError.textContent =
        "*Username must be between 3 and 20 characters and can only contain letters, numbers, underscores, or hyphens.";
      usernameInput.classList.add("is-invalid");
      return false;
    }
  } else {
    usernameError.className = "valid-feedback";
    usernameError.textContent = "Looks Good!";
    usernameInput.classList.remove("is-invalid");
    usernameInput.classList.add("is-valid");
    return true;
  }
}

function validatePhoneNumber() {
  const phoneNumberError = document.getElementById("phoneNumberError");
  const phoneNumber = phoneNumberInput.value;
  const pattern = /^(?!.*(\d)(?:-?\1){5,})[2-9]\d{9}$/;
  if (!pattern.test(phoneNumber)) {
    if (phoneNumber.match(/[^0-9]/g)) {
      phoneNumberInput.value = phoneNumber.slice(0, -1);
      console.log("Reached");
      return false;
    }
    phoneNumberError.classList.add("invalid-feedback");
    phoneNumberError.textContent = "*Invalid Phone Number";
    phoneNumberInput.classList.add("is-invalid");
    return false;
  } else {
    phoneNumberError.className = "valid-feedback";
    phoneNumberError.textContent = "Looks Good!";
    phoneNumberInput.classList.remove("is-invalid");
    phoneNumberInput.classList.add("is-valid");
    return true;
  }
}

// Gender Validation
function validateGender() {
  const genderErrorDiv = document.getElementById("genderError");
  const gender = genderSelect.value;

  if (gender.trim().length === 0) {
    genderErrorDiv.classList.add("invalid-feedback");
    genderErrorDiv.textContent = "*Please Make a Selection";
    genderSelect.classList.add("is-invalid");
    return false;
  } else {
    genderErrorDiv.className = "valid-feedback";
    genderErrorDiv.textContent = "Looks Good!";
    genderSelect.classList.remove("is-invalid");
    genderSelect.classList.add("is-valid");
    return true;
  }
}

function validateRole() {
  const roleError = document.getElementById("roleError");
  const role = roleSelect.value;

  if (role === "") {
    roleError.classList.add("invalid-feedback");
    roleError.textContent = "*Please Make a Selection";
    roleSelect.classList.add("is-invalid");
    return false;
  } else {
    roleError.className = "valid-feedback";
    roleError.textContent = "Looks Good!";
    roleSelect.classList.remove("is-invalid");
    roleSelect.classList.add("is-valid");
    return true;
  }
}

// Country Validation
function validateCountry() {
  const countryErrorDiv = document.getElementById("countryError");
  const country = countrySelect.value;

  if (country === "") {
    countryErrorDiv.classList.add("invalid-feedback");
    countryErrorDiv.textContent = "*Please Make a Selection";
    countrySelect.classList.add("is-invalid");
    return false;
  } else {
    countryErrorDiv.className = "valid-feedback";
    countryErrorDiv.textContent = "Looks Good!";
    countrySelect.classList.remove("is-invalid");
    countrySelect.classList.add("is-valid");
    var selectedOption = countrySelect.options[countrySelect.selectedIndex];
    var selectedOptionText = selectedOption.textContent;
    document.getElementById("selectedCountryText").value = selectedOptionText;
    return true;
  }
}

// State Validation
function validateState() {
  const stateErrorDiv = document.getElementById("stateError");
  const state = stateSelect.value;

  if (state === "") {
    stateErrorDiv.classList.add("invalid-feedback");
    stateErrorDiv.textContent = "*Please Make a Selection";
    stateSelect.classList.add("is-invalid");
    return false;
  } else {
    stateErrorDiv.className = "valid-feedback";
    stateErrorDiv.textContent = "Looks Good!";
    stateSelect.classList.remove("is-invalid");
    stateSelect.classList.add("is-valid");
    var selectedOption = stateSelect.options[stateSelect.selectedIndex];
    var selectedOptionText = selectedOption.textContent;
    document.getElementById("selectedStateText").value = selectedOptionText;
    return true;
  }
}

function checkUserExists() {
  const username = document.getElementById("emailId").value;
  fetch(`/check_user_exists/?email=${username}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      if (data.exists) {
        console.log(data);
      } else {
        alert("User does not exist. You can use this username.");
      }
    });
}

// City Validation
function validateCity() {
  const cityErrorDiv = document.getElementById("cityError");
  const city = citySelect.value;

  if (city === "") {
    cityErrorDiv.classList.add("invalid-feedback");
    cityErrorDiv.textContent = "*Please Make a Selection";
    citySelect.classList.add("is-invalid");
    return false;
  } else {
    cityErrorDiv.className = "valid-feedback";
    cityErrorDiv.textContent = "Looks Good!";
    citySelect.classList.remove("is-invalid");
    citySelect.classList.add("is-valid");
    var selectedOption = citySelect.options[citySelect.selectedIndex];
    var selectedOptionText = selectedOption.textContent;
    document.getElementById("selectedCityText").value = selectedOptionText;
    console.log(document.getElementById("selectedCityText").value);
    return true;
  }
}

var changeAttempt = 0;

// Password Validation
function validatePassword() {
  const newPasswordErrorDiv = document.getElementById("newPasswordError");
  const newPassword = newPasswordInput.value;
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const match = newPassword.match(regex);

  if (changeAttempt > 1) validateConfirmPassword();

  if (!match) {
    if (newPassword.length == 0) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent = "*This Field Cannot be empty.";
      newPasswordInput.classList.add("is-invalid");
    } else if (newPassword.length < 8) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent =
        "*Password must be at least 8 characters long.";
      newPasswordInput.classList.add("is-invalid");
    } else if (!/(?=.*[a-zA-Z])/.test(newPassword)) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent =
        "*Password must contain at least one letter.";
      newPasswordInput.classList.add("is-invalid");
    } else if (!/(?=.*\d)/.test(newPassword)) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent =
        "*Password must contain at least one digit.";
      newPasswordInput.classList.add("is-invalid");
    } else if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent =
        "*Password must contain at least one special character (@, $, !, %, *, ?, or &).";
      newPasswordInput.classList.add("is-invalid");
    }
    return false;
  } else {
    newPasswordErrorDiv.className = "valid-feedback";
    newPasswordErrorDiv.textContent = "Looks Good!";
    newPasswordInput.classList.remove("is-invalid");
    newPasswordInput.classList.add("is-valid");
    return true;
  }
}

// Confirm Password Validation
function validateConfirmPassword() {
  const confirmPasswordErrorDiv = document.getElementById("ConfirmPasswordError");
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  changeAttempt += 1;

  if (confirmPassword === newPassword && confirmPassword.length > 0) {
    confirmPasswordErrorDiv.className = "valid-feedback";
    confirmPasswordErrorDiv.textContent = "Looks Good!";
    confirmPasswordInput.classList.remove("is-invalid");
    confirmPasswordInput.classList.add("is-valid");
    return true;
  } else if (confirmPassword.length == 0) {
    confirmPasswordErrorDiv.classList.add("invalid-feedback");
    confirmPasswordErrorDiv.textContent = "*This Field cannot be Empty.";
    confirmPasswordInput.classList.add("is-invalid");
    return false;
  } else {
    confirmPasswordErrorDiv.classList.add("invalid-feedback");
    confirmPasswordErrorDiv.textContent = "*Password Doesn't match";
    confirmPasswordInput.classList.add("is-invalid");
    return false;
  }
}

// Handle OTP
function handleOtp() {
  var otpInput = otpNum.value.trim();
  var otpArray = otpInput.split("");
  var otpError = document.getElementById("otpError");

  otpArray = otpArray.filter(function (character) {
    return !isNaN(character);
  });

  var otpText = otpArray.join("");

  if (otpText.length == 6) {
    regForm3.submit();
  } else {
    otpNum.value = otpText;
    console.log(otpText);
  }
}

// E-Mail Validation
function customValidateEmail() {
  const emailErrorDiv = document.getElementById("emailError");
  const email = emailInput.value.trim();

  const regex = /^[a-zA-Z][a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(email)) {
    emailErrorDiv.classList.add("invalid-feedback");
    emailErrorDiv.textContent = "Invalid email address.";
    emailInput.classList.add("is-invalid");
    return false;
  } else if (email.length == 0) {
    emailErrorDiv.classList.add("invalid-feedback");
    emailErrorDiv.textContent = "This Field Cannot be Empty.";
    emailInput.classList.add("is-invalid");
    return false;
  } else {
    emailErrorDiv.className = "valid-feedback";
    emailErrorDiv.textContent = "Looks Good!";
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");
    return true;
  }
}

function validateProfilePic() {
  const imageError = document.getElementById("imageError");
  const imageFile = userProfile.files[0];
  if (!imageFile) {
    imageError.classList.add("invalid-feedback");
    imageError.textContent = "This Field Cannot be Empty.";
    userProfile.classList.add("is-invalid");
    return false;
  } else {
    imageError.textContent = "";
    imageError.classList.remove("is-invalid");
    const fileType = imageFile.type;
    if (fileType.startsWith('image/')) {
      console.log('Proceed');
      return true;
    } else {
      console.log('File is not an image. Please choose an image file.');
      imageError.classList.add("invalid-feedback");
      imageError.textContent = "'File is not an image. Please choose an image file.'";
      userProfile.classList.add("is-invalid");
      return false;
    }
  }
}

function incomeValidation() {
  var income = incomeInput.value.trim();
  if (income.length == 0){
    incomeOutput.textContent = '0';
    incomeperdayOutput.textContent = '0';
    return false;
  }
  var incomeArray = income.split("");

  incomeArray = incomeArray.filter(function (char) {
    return !isNaN(char);
  });

  var incomeText = incomeArray.join("");
  incomeInput.value = incomeText;

  var incomeDigit = parseFloat(incomeText);
  var incomePerMonth = incomeDigit/12;
  var incomePerMonthString = incomePerMonth.toString();

  // Convert incomeText to a number and format it as currency
  var formattedIncome = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR' // You can change the currency code as needed
  }).format(Number(incomeText));

  var formattedIncome2 = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR' // You can change the currency code as needed
}).format(Number(incomePerMonthString));

  incomeOutput.textContent = formattedIncome;
  incomeperdayOutput.textContent = formattedIncome2;
  console.log(formattedIncome);
  return true;
}
