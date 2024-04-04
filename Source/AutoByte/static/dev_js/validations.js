function validatefname() {
  const errorMsgDiv = document.getElementById("fnameErr");
  const fname = firstnameinput.value;

  var nameRegex = /^(?!([A-Za-z])\1+$)[A-Za-z][A-Za-z\s]*$/; 

  if (fname.trim().length <= 3) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "This Field cannot be Empty.";
    firstnameinput.classList.add("is-invalid");
    return false;
  } else if (!nameRegex.test(fname)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent =
      "Should only contain Aplphabets Not Numbers or Special Charecter";
    firstnameinput.classList.add("is-invalid");
    return false;
  } else if (/\s{1,}/.test(fname)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "Name Cannot Contain Multiple White Space, Sir";
    firstnameinput.classList.add("is-invalid");
    return false;
  } else if (!/^[^\s].*$/.test(fname)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "Cannot begin with WhiteSpace.";
    firstnameinput.classList.add("is-invalid");
    return false;
  } else {
    errorMsgDiv.classList.remove('invalid-feedback');
    errorMsgDiv.classList.add("valid-feedback");
    errorMsgDiv.textContent = "Looks Good!";
    firstnameinput.classList.remove("is-invalid");
    firstnameinput.classList.add("is-valid");
    return true;
  }
}

function validatelname() {
  const errorMsgDiv = document.getElementById("lnameErr");
  const fname = lastnameinput.value;

  var nameRegex = /^(?!([A-Za-z])\1+$)[A-Za-z][A-Za-z\s]*$/;

  if (fname.trim().length <= 3) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "This Field cannot be Empty.";
    lastnameinput.classList.add("is-invalid");
    return false;
  } else if (!nameRegex.test(fname)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent =
      "Should only contain Aplphabets Not Numbers or Special Charecter";
    lastnameinput.classList.add("is-invalid");
    return false;
  } else if (/\s{1,}/.test(fname)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "Name Cannot Contain Multiple White Space, Sir";
    lastnameinput.classList.add("is-invalid");
    return false;
  } else if (!/^[^\s].*$/.test(fname)) {
    errorMsgDiv.classList.add("invalid-feedback");
    errorMsgDiv.textContent = "Cannot begin with WhiteSpace.";
    lastnameinput.classList.add("is-invalid");
    return false;
  } else {
    errorMsgDiv.className = "valid-feedback";
    errorMsgDiv.textContent = "Looks Good!";
    lastnameinput.classList.remove("is-invalid");
    lastnameinput.classList.add("is-valid");
    return true;
  }
}

function validateEmail() {
  const emailErrorDiv = document.getElementById("emailError");
  const email = inputEmail.value.trim();

  const regex = /^[a-zA-Z][a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(email)) {
    emailErrorDiv.classList.add("invalid-feedback");
    emailErrorDiv.textContent = "Invalid email address.";
    inputEmail.classList.add("is-invalid");
    return false;
  } else if (email.length == 0) {
    emailErrorDiv.classList.add("invalid-feedback");
    emailErrorDiv.textContent = "This Field Cannot be Empty.";
    inputEmail.classList.add("is-invalid");
    return false;
  } else {
    return fetch(`/check_user_exists/?email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        const bool = data.exists;
        if (document.getElementById("oldmail")) {
          if (document.getElementById("oldmail").value == email) {
            emailErrorDiv.className = "valid-feedback";
            emailErrorDiv.textContent = "Looks Good!";
            inputEmail.classList.remove("is-invalid");
            inputEmail.classList.add("is-valid");
            return true;
          }
        }

        if (!bool) {
          emailErrorDiv.className = "valid-feedback";
          emailErrorDiv.textContent = "Looks Good!";
          inputEmail.classList.remove("is-invalid");
          inputEmail.classList.add("is-valid");
          return true;
        } else {
          emailErrorDiv.classList.add("invalid-feedback");
          emailErrorDiv.textContent = "User Already Exists.";
          inputEmail.classList.add("is-invalid");
          return false;
        }
      })
      .catch((error) => {
        console.error(error); // Handle fetch errors if needed.
        return false;
      });
  }
}

function validatePassword() {
  const newPasswordErrorDiv = document.getElementById("newPasswordError");
  const newPassword = inputPassword1.value;
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const match = newPassword.match(regex);

  if (changeAttempt > 1) validateConfirmPassword();

  if (!match) {
    if (newPassword.length == 0) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent = "*This Field Cannot be empty.";
      inputPassword1.classList.add("is-invalid");
    } else if (newPassword.length < 8) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent =
        "*Password must be at least 8 characters long.";
      inputPassword1.classList.add("is-invalid");
    } else if (!/(?=.*[a-zA-Z])/.test(newPassword)) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent =
        "*Password must contain at least one letter.";
      inputPassword1.classList.add("is-invalid");
    } else if (!/(?=.*\d)/.test(newPassword)) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent =
        "*Password must contain at least one digit.";
      inputPassword1.classList.add("is-invalid");
    } else if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
      newPasswordErrorDiv.classList.add("invalid-feedback");
      newPasswordErrorDiv.textContent =
        "*Password must contain at least one special character (@, $, !, %, *, ?, or &).";
      inputPassword1.classList.add("is-invalid");
    }
    return false;
  } else {
    newPasswordErrorDiv.className = "valid-feedback";
    newPasswordErrorDiv.textContent = "Looks Good!";
    inputPassword1.classList.remove("is-invalid");
    inputPassword1.classList.add("is-valid");
    return true;
  }
}

function validateConfirmPassword() {
  const confirmPasswordErrorDiv = document.getElementById(
    "ConfirmPasswordError"
  );
  const newPassword = inputPassword1.value;
  const confirmPassword = inputPassword2.value;
  changeAttempt += 1;

  if (confirmPassword === newPassword && confirmPassword.length > 0) {
    confirmPasswordErrorDiv.className = "valid-feedback";
    confirmPasswordErrorDiv.textContent = "Looks Good!";
    inputPassword2.classList.remove("is-invalid");
    inputPassword2.classList.add("is-valid");
    return true;
  } else if (confirmPassword.length == 0) {
    confirmPasswordErrorDiv.classList.add("invalid-feedback");
    confirmPasswordErrorDiv.textContent = "*This Field cannot be Empty.";
    inputPassword2.classList.add("is-invalid");
    return false;
  } else {
    confirmPasswordErrorDiv.classList.add("invalid-feedback");
    confirmPasswordErrorDiv.textContent = "*Password Doesn't match";
    inputPassword2.classList.add("is-invalid");
    return false;
  }
}

function validateRegistrationForm(){
    var condition1 = validatefname();
    var condition2 = validatelname();
    var condition3 = validateEmail();
    var condition4 = validatePassword();
    var condition5 = validateConfirmPassword();
    var finalCondition = condition1 && condition2 && condition3 && condition4 && condition5;
    return finalCondition;
}

function validateGender(){
  const genderErrorDiv = document.getElementById("genderError");
  const gender = genderSelect.value;

  if (gender.trim().length === 0) {
    genderErrorDiv.classList.add("invalid-feedback");
    genderErrorDiv.textContent = "*Please Make a Selection";
    genderSelect.classList.add("is-invalid");
    return false;
  } else {
    genderErrorDiv.classList.remove('invalid-feedback');
    genderErrorDiv.classList.add("valid-feedback");
    genderErrorDiv.textContent = "Looks Good!";
    genderSelect.classList.remove("is-invalid");
    genderSelect.classList.add("is-valid");
    return true;
  }
}

function validateSettingsEmail(){
  const emailErrorDiv = document.getElementById("emailError");
  const email = inputEmail.value.trim();

  const regex = /^[a-zA-Z][a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(email)) {
    emailErrorDiv.classList.add("invalid-feedback");
    emailErrorDiv.textContent = "Invalid email address.";
    inputEmail.classList.add("is-invalid");
    return false;
  } else if (email.length == 0) {
    emailErrorDiv.classList.add("invalid-feedback");
    emailErrorDiv.textContent = "This Field Cannot be Empty.";
    inputEmail.classList.add("is-invalid");
    return false;
  } else {
    return fetch(`/validateSettingsEmail/?email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        const bool = data.exists;
        if (document.getElementById("oldmail")) {
          if (document.getElementById("oldmail").value == email) {
            emailErrorDiv.className = "valid-feedback";
            emailErrorDiv.textContent = "Looks Good!";
            inputEmail.classList.remove("is-invalid");
            inputEmail.classList.add("is-valid");
            return true;
          }
        }

        if (!bool) {
          emailErrorDiv.className = "valid-feedback";
          emailErrorDiv.textContent = "Looks Good!";
          inputEmail.classList.remove("is-invalid");
          inputEmail.classList.add("is-valid");
          return true;
        } else {
          emailErrorDiv.classList.add("invalid-feedback");
          emailErrorDiv.textContent = "User Already Exists.";
          inputEmail.classList.add("is-invalid");
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

function validateSettingsForm1(){
  var bool1 = validatefname();
  var bool2 = validatelname();
  var bool3 = validateSettingsEmail();
  var bool4 = validateGender();
  var bool5 = validateUsername();
  if (bool1 && bool2 && bool3 && bool4 && bool5){
    return true;
  }else{
    return false;
  }
}

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
    console.log(document.getElementById("selectedCountryText").value);
    return true;
  }
}

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

function validateStreet(){
  const streetErr = document.getElementById('streetError');
  const street = streetName.value;
  if (street.length == 0){
    streetErr.classList.remove('valid-feedback');
    streetErr.classList.add('invalid-feedback');
    streetErr.textContent = "Cannot Be Empty"
    streetName.classList.remove('is-valid');
    streetName.classList.add('is-invalid');
    return false;
  }else{
    streetErr.classList.add('valid-feedback');
    streetErr.classList.remove('invalid-feedback');
    streetErr.textContent = 'Good Looking';
    streetName.classList.add('is-valid');
    streetName.classList.remove('is-invalid');
    return true;
  }
}

function validateAddress(){
  const addressError = document.getElementById('addressError');
  const address = addressInput.value;
  if (address.length == 0){
    addressError.classList.remove('valid-feedback');
    addressError.classList.add('invalid-feedback');
    addressError.textContent = "Cannot Be Empty"
    addressInput.classList.remove('is-valid');
    addressInput.classList.add('is-invalid');
    return false;
  }else{
    addressError.classList.add('valid-feedback');
    addressError.classList.remove('invalid-feedback');
    addressError.textContent = 'Good Looking';
    addressInput.classList.add('is-valid');
    addressInput.classList.remove('is-invalid');
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

function validateSettingsForm2(){
  var bool1 = validateCountry();
  var bool2 = validateState();
  var bool3 = validateCity();
  var bool4 = validateStreet();
  var bool5 = validateAddress();
  var bool6 = validatePhoneNumber();
  return (bool1 && bool2 && bool3 && bool4 && bool5 && bool6)
}

var config = {
  cURL: "https://api.countrystatecity.in/v1/countries",
  cKEY: "YTFObTBtTUlicWk4QXk4UWFmRmN4ZkFPTEJiTWJTZ2JOejAyNTJQdA==",
};

function loadCountries() {
  let apiEndPoint = config.cURL;
  countrySelect.innerHTML = `<option value='' selected disabled>Please Select your Country</option>`;

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.cKEY } })
    .then((Response) => Response.json())
    .then((data) => {
      data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.iso2;
        option.textContent = country.name;
        countrySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error Loading Countries:", error));
}

function loadStates() {
  const selectedCountry = countrySelect.value;
  let apiEndPoint = `${config.cURL}/${selectedCountry}/states`;
  stateSelect.innerHTML = "<option value='' selected disabled>Please Select your State</option>";
  citySelect.innerHTML = "<option value='' selected disabled>Please Select your City</option>";

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.cKEY } })
    .then((Response) => Response.json())
    .then((data) => {
      if (!data) {
        stateSelect.innerHTML =
          "<option value='/' selected disabled>No States in the Selected Country</option>";
        citySelect.innerHTML =
          "<option value='/' selected disabled>No City Names in the Selected Country Option</option>";
        return true;
      }
      data.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.iso2;
        option.textContent = state.name;
        stateSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error Loading State:", error));
}

function loadCities() {
  const selectedCountry = countrySelect.value;
  const selectedState = stateSelect.value;
  let apiEndPoint = `${config.cURL}/${selectedCountry}/states/${selectedState}/cities`;
  citySelect.innerHTML = "<option value=''>Select Your City</option>";

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.cKEY } })
    .then((Response) => Response.json())
    .then((data) => {
      if (!data) {
        citySelect.innerHTML =
          "<option value='/' selected disabled>No City</option>";
        return false;
      }
      data.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.iso2;
        option.textContent = city.name;
        citySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error Loading City:", error));
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

function validateMainCategory(){
  const categoryVal = categorySelect.value;
  if (categoryVal.length == 0){
    categorySelectError.classList.add('invalid-feedback');
    categorySelect.classList.add('is-invalid');
    categorySelectError.textContent = "Please Make a selection";
    return false;
  }else{
    categorySelectError.classList.remove('invalid-feedback');
    categorySelect.classList.remove('is-invalid');
    categorySelectError.classList.add('valid-feedback');
    categorySelect.classList.add('is-valid');
    categorySelectError.textContent = "Good to Go";
    return true;
  }
}

function validateSubCategory(){
  const subcategoryval = scategorySelect.value;
  if (subcategoryval.length == 0){
    scategorySelectError.classList.add('invalid-feedback');
    scategorySelect.classList.add('is-invalid');
    scategorySelectError.textContent = "Please Make a selection";
    return false;
  }else{
    scategorySelectError.classList.remove('invalid-feedback');
    scategorySelect.classList.remove('is-invalid');
    scategorySelectError.classList.add('valid-feedback');
    scategorySelect.classList.add('is-valid');
    scategorySelectError.textContent = "Good to Go";
    return true;
  }
}

function validateIncome(){
  const incomevalue = incomeInput.value;
  const incomeError = document.getElementById('incomeerror');
  const incomegroup = document.getElementById('incomegroup');
  if (incomevalue.length == 0){
    incomegroup.classList.add('is-invalid');
    incomeError.classList.add('invalid-feedback');
    incomeError.textContent = "Please Enter the Income";
    return false;
  }else{
    return true;
  }
}

function loadBrand(){
  subCatSel.innerHTML = "<option value='' selected disabled>Select Your Category</option>";
  const subcategory = scategorySelect.value;
  const subcategory_int = parseInt(subcategory);
  console.log(subcategory_int);
  fetch(`/loadBrand/?id=${subcategory_int}`)
  .then(response => response.json())
  .then((data) => {
    for(var i of data.brands){
      const option = document.createElement('option');
      option.value = i.id;
      option.textContent = i.name;
      subCatSel.appendChild(option);
    }
  });
}


function loadLocation(){
  fetch('/loadLocation/')
  .then(response => response.json())
  .then((data) => {
      if (data.userloca === false){
          productLocaSelect.innerHTML = "<option>Please add Your Location</option>"
      }else{
          for (var i of data.userloca){
              const option = document.createElement('option');
              option.value = i.id;
              option.textContent = `${i.country}, ${i.state}, ${i.city}\n ${i.street}, ${i.address}`;
              productLocaSelect.appendChild(option);
          }
      }
  });
}