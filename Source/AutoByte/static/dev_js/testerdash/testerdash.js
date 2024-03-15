function validatePrice(counter) {
  const basePriceSelector = document.getElementById("baseprice" + counter);
  const basePriceInput = document.getElementById("basepriceinput" + counter);
  const errordiv = document.getElementById("basepriceerror" + counter);
  const selectedValue = basePriceSelector.value;
  console.log(selectedValue);

  if (selectedValue == 0) {
    errordiv.classList.remove("invalid-feedback");
    basePriceInput.classList.remove("is-invalid");
    errordiv.classList.add("valid-feedback");
    errordiv.textContent = "Good";
    basePriceInput.classList.add("is-valid");
    return true;
  } else if (selectedValue == 1) {
    const inputValue = basePriceInput.value.trim();
    const numericValue = parseFloat(inputValue);

    if (isNaN(numericValue)) {
      errordiv.classList.remove("valid-feedback");
      basePriceInput.classList.remove("is-valid");
      errordiv.classList.add("invalid-feedback");
      errordiv.textContent = "Please enter a valid number.";
      basePriceInput.classList.add("is-invalid");
      return false;
    } else if (numericValue < 0 || numericValue > 10000000) {
      errordiv.classList.remove("valid-feedback");
      basePriceInput.classList.remove("is-valid");
      errordiv.classList.add("invalid-feedback");
      errordiv.textContent = "Price must be between 0 and 10,000,000.";
      basePriceInput.classList.add("is-invalid");
      return false;
    } else {
      errordiv.classList.remove("invalid-feedback");
      basePriceInput.classList.remove("is-invalid");
      errordiv.classList.add("valid-feedback");
      errordiv.textContent = "Good";
      basePriceInput.classList.add("is-valid");
      return true;
    }
  } else if (selectedValue == -1) {
    errordiv.classList.remove("valid-feedback");
    basePriceInput.classList.remove("is-valid");
    errordiv.classList.add("invalid-feedback");
    errordiv.textContent = "Please make a selection.";
    basePriceInput.classList.add("is-invalid");
    return false;
  }
}

function validatedescription(counter) {
  const descriptionselect = document.getElementById("description" + counter);
  const descriptionInput = document.getElementById(
    "descriptioninput" + counter
  );
  const errordiv = document.getElementById("descerr" + counter);
  const selectedValue = descriptionselect.value;
  const descval = descriptionInput.value;

  if (selectedValue == 0) {
    errordiv.classList.remove("invalid-feedback");
    descriptionInput.classList.remove("is-invalid");
    errordiv.classList.add("valid-feedback");
    errordiv.textContent = "Good";
    descriptionInput.classList.add("is-valid");
    return true;
  } else if (selectedValue == 1) {
    if (descval.length == 0) {
      errordiv.classList.add("invalid-feedback");
      descriptionInput.classList.add("is-invalid");
      errordiv.classList.remove("valid-feedback");
      errordiv.textContent = "Please write a custom description.";
      descriptionInput.classList.remove("is-valid");
      return false;
    } else {
      errordiv.classList.remove("invalid-feedback");
      descriptionInput.classList.remove("is-invalid");
      errordiv.classList.add("valid-feedback");
      errordiv.textContent = "Good";
      descriptionInput.classList.add("is-valid");
      return true;
    }
  } else if (selectedValue == -1) {
    errordiv.classList.add("invalid-feedback");
    descriptionInput.classList.add("is-invalid");
    errordiv.classList.remove("valid-feedback");
    errordiv.textContent = "Please make a selection.";
    descriptionInput.classList.remove("is-valid");
    return false;
  }
}

function validateAccident(counter) {
  const accidentSelector = document.getElementById("accident" + counter);
  const accidentInput = document.getElementById("accidentinput" + counter);
  const errorDiv = document.getElementById("accerr" + counter);

  const selectedValue = accidentSelector.value;
  const inputValue = accidentInput.value.trim();

  if (selectedValue === "1") {
    if (inputValue.length === 0) {
      errorDiv.classList.remove("valid-feedback");
      accidentInput.classList.remove("is-valid");
      errorDiv.classList.add("invalid-feedback");
      accidentInput.classList.add("is-invalid");
      errorDiv.textContent = "Please provide accident details.";
      return false;
    } else {
      errorDiv.classList.add("valid-feedback");
      accidentInput.classList.add("is-valid");
      errorDiv.classList.remove("invalid-feedback");
      accidentInput.classList.remove("is-invalid");
      errorDiv.textContent = "Good";
      return true;
    }
  } else if (selectedValue === "-1") {
    errorDiv.classList.remove("valid-feedback");
    accidentInput.classList.remove("is-valid");
    errorDiv.classList.add("invalid-feedback");
    accidentInput.classList.add("is-invalid");
    errorDiv.textContent = "Please make a selection.";
    return false;
  } else {
    errorDiv.classList.add("valid-feedback");
    accidentInput.classList.add("is-valid");
    errorDiv.classList.remove("invalid-feedback");
    accidentInput.classList.remove("is-invalid");
    errorDiv.textContent = "Good";
    return true;
  }
}

function validateYOM(counter) {
  const yomSelector = document.getElementById("yom" + counter);
  const datePicker = document.getElementById("datePicker" + counter);
  const errorDiv = document.getElementById("dateerr" + counter);

  const selectedValue = yomSelector.value;

  if (selectedValue === "1" || selectedValue === "") {
    const selectedDate = datePicker.value;

    if (!selectedDate) {
      datePicker.classList.add("is-invalid");
      errorDiv.classList.add("invalid-feedback");
      datePicker.classList.remove("is-valid");
      errorDiv.classList.remove("valid-feedback");
      errorDiv.textContent = "Please select a date.";
      return false;
    } else {
      datePicker.classList.remove("is-invalid");
      errorDiv.classList.remove("invalid-feedback");
      datePicker.classList.add("is-valid");
      errorDiv.classList.add("valid-feedback");
      errorDiv.textContent = "Good";
      return true;
    }
  } else {
    datePicker.classList.remove("is-invalid");
    errorDiv.classList.remove("invalid-feedback");
    datePicker.classList.add("is-valid");
    errorDiv.classList.add("valid-feedback");
    errorDiv.textContent = "Good";
    return true;
  }
}

function validateImage(counter) {
  const fileInput = document.getElementById("testerimage" + counter);
  const errorDiv = document.getElementById("imgerr");

  if (fileInput.files.length === 0) {
    fileInput.classList.remove("is-valid");
    errorDiv.classList.remove("valid-feedback");
    fileInput.classList.add("is-invalid");
    errorDiv.classList.add("invalid-feedback");
    errorDiv.textContent = "Please select at least one image.";
    return false;
  }

  for (let i = 0; i < fileInput.files.length; i++) {
    const file = fileInput.files[i];
    const fileType = file.type.split("/")[0];

    if (fileType !== "image") {
      fileInput.classList.remove("is-valid");
      errorDiv.classList.remove("valid-feedback");
      fileInput.classList.add("is-invalid");
      errorDiv.classList.add("invalid-feedback");
      errorDiv.textContent = "Please select only image files.";
      return false;
    }
  }

  fileInput.classList.add("is-valid");
  errorDiv.classList.add("valid-feedback");
  fileInput.classList.remove("is-invalid");
  errorDiv.classList.remove("invalid-feedback");
  errorDiv.textContent = "";
  return true;
}

function validaterating(counter) {
  const ratingsel = document.getElementById(`endrating${counter}`);
  let ratingval = parseInt(ratingsel.value);
  const ratingerr = document.getElementById(`ratingerr${counter}`);

  // Checks that the value is a number and between 1 and 5 inclusive.
  if (ratingval < 1 || ratingval > 5) {
    ratingerr.classList.remove("valid-feedback");
    ratingsel.classList.remove("is-valid");
    ratingerr.classList.add("invalid-feedback");
    ratingsel.classList.add("is-invalid");
    ratingerr.textContent = "Please make a selection";
    return false;
  }
  ratingerr.classList.add("valid-feedback");
  ratingsel.classList.add("is-valid");
  ratingerr.classList.remove("invalid-feedback");
  ratingerr.textContent = "Good";
  ratingsel.classList.remove("is-invalid");
  return true;
}

var formBool = false;

function validateform(counter) {
  console.log("Reached Validate");
  formBool = validatePrice(counter);
  formBool = validatedescription(counter);
  formBool = validateAccident(counter);
  formBool = validateYOM(counter);
  formBool = validateImage(counter);
  formBool = validaterating(counter);
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Reached DOM Content Loaded Event Listener.");
  const countval = document.getElementById("contentcount").value;
  var form = [];
  for (let index = 1; index <= countval; index++) {
    form[index] = document.getElementById(`form${index}`);
    form[index].addEventListener("submit", (event) => {
        event.preventDefault();
        if (formBool) {
            form[index].submit();
        } else {
            console.log("Not Submitted, due to validation not satisfied");
        }
    });
  }
});
