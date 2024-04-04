document.addEventListener("DOMContentLoaded", function () {
  categoryInput.addEventListener("input", validateCat);
  if (radioOne && radioThree){
    console.log('Helo');
    radioOne.addEventListener('click', function(){
        catForm.action = "/addMainCategoryForm/";
    });
    radioTwo.addEventListener('click', function(){
        catForm.action = "/addSubCategoryForm/";
    });
    radioThree.addEventListener('click', function(){
        catForm.action = "/addBrandForm/";
    });
  }else if (radioOne){ 
    radioOne.addEventListener('click', function(){
        catForm.action = "/addMainCategoryForm/";
    });
    radioTwo.addEventListener('click', function(){
        catForm.action = "/addSubCategoryForm/";
    });
  }
});

// for Fetch Data

catForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (radioOne) {
    let v1 = validateCat();
    let v2 = validateSelectCat();
    console.log(v1);
    if (radioOne.checked && v1) {
      categorySelect.name = "";
      try {
        let isValid = await checkDB(categoryInput.value);
        if (isValid) {
          catForm.submit();
        }
      } catch (error) {
        console.error("Error checking category:", error);
      }
    } else if (radioTwo.checked && v1 && v2) {
        // catForm.action = "/addSubCategoryForm/";
        console.log("hello");
      try {
        let isValid = await checkDB(categoryInput.value);
        if (isValid) {
          catForm.submit();
        }
      } catch (error) {
        console.error("Error checking category:", error);
      }
    }
    if (radioThree) {
      let v3 = validateSelectSubCat();
      if (radioThree.checked && v3) {
        catForm.submit();
      }
    }
  }else {
    catForm.action = "/addMainCategoryForm/";
    let v1 = validateCat();
    if (v1) {
      try {
        let isValid = await checkDB(categoryInput.value);
        if (isValid) {
          catForm.submit();
        }
      } catch (error) {
        console.error("Error checking category:", error);
      }
    }
  }
});

function validateCat() {
  var category = categoryInput.value;
  if (category.trim().length == 0) {
    categoryInput.classList.add("is-invalid");
    categoryError.classList.add("invalid-feedback");
    categoryError.textContent = "*Cannot be Empty";
    // event.preventDefault();
    return false;
  }
  const regularExp = /^[A-Za-z\s]+$/;

  if (regularExp.test(category)) {
    categoryInput.classList.remove("is-invalid");
    categoryError.classList.remove("invalid-feedback");
    categoryError.textContent = "";
    return true;
  } else {
    var catArr = category.split("");
    console.log(catArr.length);
    catArr.pop();
    var category = catArr.join("");
    categoryInput.value = category;
    categoryInput.classList.add("is-invalid");
    categoryError.classList.add("invalid-feedback");
    categoryError.textContent = "*No Number Allowed";
    setTimeout(clearError, 1000);
    // event.preventDefault();
    return false;
  }
}

function clearError() {
  categoryInput.classList.remove("is-invalid");
  categoryError.classList.remove("invalid-feedback");
  categoryError.textContent = "";
}

function validateSelectCat() {
  const categorySelected = categorySelect.value;
  if (categorySelected.length == 0) {
    categorySelect.classList.add("is-invalid");
    categorySelectError.classList.add("invalid-feedback");
    categorySelectError.textContent = "Please Make a Selection";
    return false;
  } else {
    categorySelect.classList.remove("is-invalid");
    categorySelectError.classList.remove("invalid-feedback");
    categorySelectError.textContent = "";
    return true;
  }
}

function validateSelectSubCat() {
  const scategorySelected = scategorySelect.value;
  if (scategorySelected.length == 0) {
    scategorySelect.classList.add("is-invalid");
    scategorySelectError.classList.add("invalid-feedback");
    scategorySelectError.textContent = "Please Make a Selection";
    return false;
  } else {
    scategorySelect.classList.remove("is-invalid");
    scategorySelectError.classList.remove("invalid-feedback");
    scategorySelectError.textContent = "";
    return true;
  }
}

function checkDB(cater) {
    console.log('Reached');
    return fetch(`/checkCatExists/?cat=${cater}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                categoryInput.classList.add('is-invalid');
                categoryError.classList.add('invalid-feedback');
                categoryError.textContent = '*Category Already Exists';
                return false;
            } else {
                clearError();
                return true;
            }
        })
        .catch(error => {
            console.error("Error Loading Categories:", error);
            return false;
        });
}

function toggleAccordion(sectionId) {
    var content = document.getElementById(sectionId);

    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'table-row';
        document.getElementById('btn1').textContent = "Collapse";
    } else {
        content.style.display = 'none';
        document.getElementById('btn1').textContent = "View Sub";
    }

    // Check for sub-subcategories and hide them
    var subSubCategories = content.getElementsByClassName('accordion-content');
    for (var i = 0; i < subSubCategories.length; i++) {
        subSubCategories[i].style.display = 'none';
    }
}