document.addEventListener("DOMContentLoaded", function () {
  addAddressBtn.addEventListener("click", function () {
    countrySelect.value = "";
    stateSelect.value = "";
    citySelect.value = "";
    streetName.value = "";
    addressInput.value = "";
    phoneNumberInput.value = "";
    document.getElementById("settingForm2").action = "/settingsForm2/";
    if (addAddressBtn.textContent === "+ Add Address") {
      addAddressBtn.textContent = "Close";
      addressEditDiv.classList.remove("d-none");
    } else if (addressEditDiv.classList.contains("d-none")) {
      addAddressBtn.textContent = "Close";
      addressEditDiv.classList.remove("d-none");
    } else {
      addAddressBtn.innerHTML = `<strong style="font-weight: 900;">+</strong> Add Address`;
      addressEditDiv.classList.add("d-none");
    }
  });

  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateProfilePic()) {
      profileForm.submit();
    } else {
      console.log("no");
    }
  });
});

document.getElementById("cancelBtn").addEventListener("click", function () {
  const newPasswordDiv = document.getElementById("newPasswordDiv");
  const newConfirmPasswordDiv = document.getElementById(
    "newConfirmPasswordDiv"
  );
  const oldPasswordDiv = document.getElementById("oldPasswordDiv");
  const newPasswordInputs = document.getElementById("password1");

  newConfirmPasswordDiv.style.display = "none";
  newPasswordDiv.style.display = "none";
  oldPasswordDiv.style.display = "";
  newPasswordInputs.value = "";
  newPasswordInput.classList.remove("is-invalid");
  confirmPasswordInput.classList.remove("is-invalid");
  newPasswordInput.classList.remove("is-valid");
  confirmPasswordInput.classList.remove("is-valid");
  document
    .getElementById("newPasswordError")
    .classList.remove("invalid-feedback");
  document
    .getElementById("newPasswordError")
    .classList.remove("valid-feedback");
  document
    .getElementById("ConfirmPasswordError")
    .classList.remove("invalid-feedback");
  document
    .getElementById("ConfirmPasswordError")
    .classList.remove("valid-feedback");
  document.getElementById("ConfirmPasswordError").textContent = "";
  document.getElementById("newPasswordError").textContent = "";
  newPasswordInput.value = "";
  confirmPasswordInput.value = "";
});

document.getElementById("nextBtn").addEventListener("click", function () {
  const currentPasswordError = document.getElementById("currentPasswordError");
  const newPasswordInputs = document.getElementById("password1");
  const currentPassword = newPasswordInputs.value.trim();

  const newPasswordDiv = document.getElementById("newPasswordDiv");
  const newConfirmPasswordDiv = document.getElementById(
    "newConfirmPasswordDiv"
  );
  const oldPasswordDiv = document.getElementById("oldPasswordDiv");

  if (newPasswordDiv.style.display != "none") {
    var v1 = validatePassword();
    var v2 = validateConfirmPassword();
    if (v1 && v2) {
      const newPassword = newPasswordInput.value;
      const conPassword = confirmPasswordInput.value;
      const dataToSend = {
        key1: newPassword,
      };

      fetch(`/updatePassword/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.done) {
            document.getElementById("cancelBtn").click();
            console.log(data);
            return true;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  if (currentPassword.length === 0) {
    currentPasswordError.classList.add("invalid-feedback");
    currentPasswordError.textContent = "Field Cannot be Empty";
    newPasswordInputs.classList.add("is-invalid");
    return false;
  }

  fetch(`/validatePassword/?password=${currentPassword}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.exists) {
        currentPasswordError.classList.remove("invalid-feedback");
        currentPasswordError.textContent = "";
        newPasswordInputs.classList.remove("is-invalid");
        console.log("Password is valid");
        newConfirmPasswordDiv.style.display = "";
        newPasswordDiv.style.display = "";
        oldPasswordDiv.style.display = "none";
        newPasswordInput.addEventListener("input", validatePassword);
        confirmPasswordInput.addEventListener("input", validateConfirmPassword);
      } else {
        currentPasswordError.classList.add("invalid-feedback");
        currentPasswordError.textContent = "*Wrong Password";
        newPasswordInputs.classList.add("is-invalid");
        console.log("Password is invalid");
      }
    })
    .catch((error) => {
      console.error("Error Loading:", error);
    });
});
