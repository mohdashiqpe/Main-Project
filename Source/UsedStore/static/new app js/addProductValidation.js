addProForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var b1 = validateMainCategory();
    var b2 = validateCategory();
    var b3 = validateSubCategory();
    var b4 = validateProductName();
    var b5 = validateAmount();
    var b6 = validateDescription();
    var b7 = validateDate();
    var b8 = validateProductLoca();
    var b9 = validateImage();
    var allBool = b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9;
    if (stockDiv.style.display !== "none"){
        var b10 = validateStock();
        if (b10 && allBool){
            stockCount.disabled = false;
            addProForm.submit();
        }
    }else{
        if (allBool){
            stockCount.value += 1
            stockCount.disabled = false;
            addProForm.submit();
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    amountInput.addEventListener('input', validateAmount);

    //  For Stock JS
    minStock.addEventListener('click', function () {
        if (parseInt(stockCount.value) > 0) {
            stockCount.value = (parseInt(stockCount.value) - 1).toString();
        }
    });
    maxStock.addEventListener('click', function () {
        stockCount.value = (parseInt(stockCount.value) + 1).toString();
    });
    // End for Stock JS

    categorySelect.addEventListener('change', validateMainCategory);
    CatSel.addEventListener('change', validateCategory);
    subCatSel.addEventListener('change', validateSubCategory);
    pnameInput.addEventListener('input', validateProductName);
    productImageInput.addEventListener('input', previewImage);
    descriptionInput.addEventListener('input', validateDescription);
});

function validateAmount() {
    var amount = amountInput.value.trim();
    amountError.classList.remove('invalid-feedback');
    amountInputSet.classList.remove('is-invalid');
    amountError.textContent = '';
    if (amount.length == 0) {
        amountError.classList.add('invalid-feedback');
        amountInputSet.classList.add('is-invalid');
        amountError.textContent = '*Enter the Expected Amount';
        amountDisp.innerHTML = '&#8377;0.00';
        return false;
    }
    var incomeArray = amount.split("");

    incomeArray = incomeArray.filter(function (char) {
        return !isNaN(char);
    });

    var incomeText = incomeArray.join("");
    amountInput.value = incomeText;

    // Convert incomeText to a number and format it as currency
    var formattedIncome = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR' // You can change the currency code as needed
    }).format(Number(incomeText));

    amountDisp.textContent = formattedIncome;
    console.log(formattedIncome);
    return true;
}

function setMaxDate() {
    var today = new Date();
    var dd = String(today.getDate() - 5).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    dateInput.max = today;
}

function validateMainCategory() {
    const selectedIndex = categorySelect.selectedIndex;
    const selectedTextContext = categorySelect.options[selectedIndex].textContent;

    if (selectedTextContext === "Automobiles") {
        stockDiv.style.display = "none";
    } else {
        stockDiv.style.display = "";
    }

    if (selectedIndex <= 0) {
        categoryError.classList.add('invalid-feedback');
        categoryError.textContent = '*Please Make a Selection';
        categorySelect.classList.add('is-invalid');
        return false;
    } else {
        categoryError.classList.remove('invalid-feedback');
        categoryError.textContent = '';
        categorySelect.classList.remove('is-invalid');
        return true;
    }
}

function validateCategory() {
    if (catDiv.classList.contains('d-none')) {
        CatSelErr.classList.remove('invalid-feedback');
        CatSelErr.textContent = "";
        CatSel.classList.remove('is-invalid');
        return true;
    }
    const CatSelIndex = CatSel.selectedIndex;
    if (CatSelIndex <= 0) {
        CatSelErr.classList.add('invalid-feedback');
        CatSelErr.textContent = "*Please Make a Selection";
        CatSel.classList.add('is-invalid');
        return false;
    } else {
        CatSelErr.classList.remove('invalid-feedback');
        CatSelErr.textContent = "";
        CatSel.classList.remove('is-invalid');
        return true;
    }
}

function validateSubCategory() {
    if (subDiv.classList.contains('d-none')) {
        subCatSelErr.classList.remove('invalid-feedback');
        subCatSelErr.textContent = "";
        subCatSel.classList.remove('is-invalid');
        return true;
    }
    const subCatSelIndex = subCatSel.selectedIndex;
    if (subCatSelIndex <= 0) {
        subCatSelErr.classList.add('invalid-feedback');
        subCatSelErr.textContent = "*Please Make a Selection";
        subCatSel.classList.add('is-invalid');
        return false;
    } else {
        subCatSelErr.classList.remove('invalid-feedback');
        subCatSelErr.textContent = "";
        subCatSel.classList.remove('is-invalid');
        return true;
    }
}

function validateProductName() {
    const pname = pnameInput.value;
    if (pname.length === 0) {
        pnameError.classList.add('invalid-feedback');
        pnameError.textContent = "*Product Name Cannot be Empty";
        pnameInput.classList.add('is-invalid');
        return false;
    } else {
        pnameError.classList.remove('invalid-feedback');
        pnameError.textContent = "";
        pnameInput.classList.remove('is-invalid');
        return true;
    }
}

function validateStock() {
    if (parseInt(stockCount.value) > 0) {
        stockCountError.classList.remove('invalid-feedback');
        stockInputSet.classList.remove('is-invalid');
        stockCountError.textContent = '';
        return true;
    } else {
        stockCountError.classList.add('invalid-feedback');
        stockInputSet.classList.add('is-invalid');
        stockCountError.textContent = '* Stock Cannot be Empty';
        return false;
    }
}

function validateImage() {
    const imageFiles = productImageInput.files;
    if (imageFiles.length == 0) {
        productImageError.classList.add("invalid-feedback");
        productImageError.textContent = "This Field Cannot be Empty.";
        productImageInput.classList.add("is-invalid");
        return false;
    }
    for (let i =0; i<imageFiles.length; i++){
        const file = imageFiles[i];
        if (file.type.startsWith('image/')){
            if (imageFiles.length > 0 && imageFiles.length < 4) {
                productImageError.classList.add("invalid-feedback");
                productImageError.textContent = "Minimum Requirements didn't Met";
                productImageInput.classList.add("is-invalid");
                return false;
            }
            productImageError.classList.remove("invalid-feedback");
            productImageError.textContent = "";
            productImageInput.classList.remove("is-invalid");
        }else{
            console.log('here');
            productImageError.classList.add("invalid-feedback");
            productImageError.textContent = "'File's contain a different file. Please choose an image file.'";
            productImageInput.classList.add("is-invalid");
            return false;
        }
    }
    return true;
}

function previewImage(){
    const imagePreview = document.getElementById('imagePreview');
    var count =0;
    imagePreview.innerHTML = "";
    const imageFiles = productImageInput.files;
    for (var i of imageFiles){
        const imageUrl = URL.createObjectURL(i);
        console.log(i);
        count += 1
        const imageField = document.createElement('img');
        imageField.src = imageUrl;
        imageField.width = 100;
        imageField.height = 100;
        imageField.className = "p-1";
        imageField.setAttribute('name', "image"+count);
        imagePreview.appendChild(imageField);
    }
}

function validateDescription(){
    if (descriptionInput.value.length === 0){
        descError.classList.add('invalid-feedback');
        descError.textContent = "Please Describe about your Product";
        descriptionInput.classList.add('is-invalid');
        return false;
    }else {
        descError.classList.remove('invalid-feedback');
        descError.textContent = "";
        descriptionInput.classList.remove('is-invalid');
        return true;
    }
}

function validateDate(){
    if (dateInput.value === ""){
        dateError.classList.add('invalid-feedback');
        dateError.textContent = "Please Select a date";
        dateInput.classList.add('is-invalid');
        return false;
    }else{
        dateError.classList.remove('invalid-feedback');
        dateError.textContent = "";
        dateInput.classList.remove('is-invalid');
        return true;
    }
}

function validateProductLoca(){
    if (productLocaSelect.value.trim().length === 0){
        productLocaError.classList.add('invalid-feedback');
        productLocaError.textContent = "*Please Select your Product Location";
        productLocaSelect.classList.add('is-invalid');
        return false;
    }else {
        console.log(productLocaSelect.value);
        productLocaError.classList.remove('invalid-feedback');
        productLocaError.textContent = "";
        productLocaSelect.classList.remove('is-invalid');
        return true;
    }
}