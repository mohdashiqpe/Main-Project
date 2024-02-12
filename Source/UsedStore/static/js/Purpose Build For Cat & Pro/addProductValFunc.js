function validateCategory() {
    const catVal = categorySelect.value;
    if (catVal.trim().length == 0) {
        categoryError.classList.add('invalid-feedback');
        categorySelect.classList.add('is-invalid');
        categoryError.textContent = 'Please Make a Selection';
        return false;
    } else {
        categoryError.classList.remove('invalid-feedback');
        categorySelect.classList.remove('is-invalid');
        categoryError.textContent = '';
        return true;
    }
}

function validateSubCat() {
    const subCatSelVal = subCatSel.value.trim();
    console.log('reached validateSub Cat');
    if (subCatSelVal.length == 0) {
        subCatSel.classList.add('is-invalid');
        subCatSelErr.classList.add('invalid-feedback');
        subCatSelErr.textContent = '*Please Make a Selection !';
        return false;
    } else {
        subCatSel.classList.remove('is-invalid');
        subCatSelErr.classList.remove('invalid-feedback');
        subCatSelErr.textContent = '';
        return true;
    }
}

function validateProductName() {
    const pnameVal = pnameInput.value;
    const productPattern = /^[a-zA-Z0-9\s-']{3,}$/;
    if (!productPattern.test(pnameVal)) {
        pnameError.classList.add('invalid-feedback');
        pnameInput.classList.add('is-invalid');
        pnameError.textContent = '*Invalid Product Name';
        return false;
    } else {
        pnameError.classList.remove('invalid-feedback');
        pnameInput.classList.remove('is-invalid');
        pnameError.textContent = '';
        return true;
    }
}

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

function validateStockAdd() {
    stockCount.value = (parseInt(stockCount.value) + 1).toString();
}

function validateStockLess() {
    if (parseInt(stockCount.value) > 1) {
        stockCount.value = (parseInt(stockCount.value) - 1).toString();
    }
}

function validateStockCount() {
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
    //  else {
    //     productImageError.textContent = "";
    //     productImageError.classList.remove("is-invalid");
    //     const fileType = imageFile.type;
    //     if (fileType.startsWith('image/')) {
    //         console.log('Proceed');
    //         return true;
    //     } else {
    //         console.log('File is not an image. Please choose an image file.');
            
    //     }
    // }
}