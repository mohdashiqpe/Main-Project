document.addEventListener('DOMContentLoaded', function(){
    categoryInput.addEventListener('input', validateCat);

}); 

 // for Fetch Data

catForm.addEventListener('submit', function(event){
    event.preventDefault();
    if(radioOne){
        let v1 = validateCat();
        let v2 = validateSelectCat();
        console.log(v1);
        if (radioOne.checked && v1){
            categorySelect.name='';
            checkDB(categoryInput.value)
            .then(isValid => {
                if (isValid) {
                    catForm.submit();
                }
            });
        }else if (radioTwo.checked && v1 && v2){
            checkDB(categoryInput.value)
            .then(isValid => {
                if (isValid) {
                    catForm.submit();
                }
            })
        }
        if (radioThree){
            let v3 = validateSelectSubCat();
            if (radioThree.checked && v3){
                catForm.submit();
            }
        }
    }else{
        let v1 = validateCat();
        if (v1){
            checkDB(categoryInput.value)
            .then(isValid => {
                if (isValid) {
                    catForm.submit();
                }
            })
        }
    }
});

function validateCat() {
    var category = categoryInput.value;
    if (category.trim().length == 0){
        categoryInput.classList.add('is-invalid');
        categoryError.classList.add('invalid-feedback');
        categoryError.textContent='*Cannot be Empty';
        // event.preventDefault();
        return false;
    }
    const regularExp = /^[A-Za-z\s]+$/;

    if (regularExp.test(category)) {
        categoryInput.classList.remove('is-invalid');
        categoryError.classList.remove('invalid-feedback');
        categoryError.textContent='';
        return true;
    } else {
        var catArr = category.split("");
        console.log(catArr.length);
        catArr.pop();
        var category = catArr.join('');
        categoryInput.value=category;
        categoryInput.classList.add('is-invalid');
        categoryError.classList.add('invalid-feedback');
        categoryError.textContent='*No Number Allowed';
        setTimeout(clearError, 1000);
        // event.preventDefault();
        return false;
    }
}

function clearError(){
    categoryInput.classList.remove('is-invalid');
    categoryError.classList.remove('invalid-feedback');
    categoryError.textContent='';
}

function validateSelectCat(){
    const categorySelected = categorySelect.value;
    if (categorySelected.length == 0){
        categorySelect.classList.add('is-invalid');
        categorySelectError.classList.add('invalid-feedback');
        categorySelectError.textContent = 'Please Make a Selection';
        return false;
    }else{
        categorySelect.classList.remove('is-invalid');
        categorySelectError.classList.remove('invalid-feedback');
        categorySelectError.textContent = '';
        return true;
    }
}

function validateSelectSubCat(){
    const scategorySelected = scategorySelect.value;
    if (scategorySelected.length == 0){
        scategorySelect.classList.add('is-invalid');
        scategorySelectError.classList.add('invalid-feedback');
        scategorySelectError.textContent = 'Please Make a Selection';
        return false;
    }else{
        scategorySelect.classList.remove('is-invalid');
        scategorySelectError.classList.remove('invalid-feedback');
        scategorySelectError.textContent = '';
        return true;
    }
}

function checkDB(cater){
    console.log('Reached');
    return fetch(`/checkCatExists/?cat=${cater}`)
    .then(response => response.json())
    .then(data => {
        if (data.exists){
            categoryInput.classList.add('is-invalid');
            categoryError.classList.add('invalid-feedback');
            categoryError.textContent='*Category Already Exists';
            return false;
        }else{
            clearError();
            return true;
        }
    }).catch(error => {
        console.error("Error Loading Categories:", error);
        return false;
    });
}