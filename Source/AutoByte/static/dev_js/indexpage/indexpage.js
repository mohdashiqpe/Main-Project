

document.addEventListener("DOMContentLoaded", () => {
});

// function formatMoney(tagid) {
//     console.log('Hello');
//     const pricetag = document.getElementById('productPrice'+tagid);
//     basePrice = pricetag.textContent; 
//     var formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(basePrice);
//     console.log(formattedPrice);
//     pricetag.textContent = 'Price: ' + formattedPrice;
// }


function inputToMoney(counter){
    const moneyview = document.getElementById('displaymoney'+counter);
    const inputField = document.getElementById('inputprice'+counter);
    const inputgrp = document.getElementById('inputgrp'+counter);
    const inputvalue = inputField.value.trim();
    const errordiv = document.getElementById('priceerror'+counter);
    if(isNaN(inputvalue) || parseFloat(inputvalue) < 0){
        errordiv.classList.add('invalid-feedback');
        inputgrp.classList.add('is-invalid');
        errordiv.textContent = "Please enter a valid number.";
        event.preventDefault();
        return false;
    }else{
        errordiv.classList.remove('invalid-feedback');
        inputgrp.classList.remove('is-invalid');
        errordiv.textContent = "";  
        moneyview.textContent = formatMoney(inputvalue);
        event.preventDefault();
        return true;
    }
}

function formatMoney(amount) {
    var formattedIncome = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR' // You can change the currency code as needed
    }).format(Number(amount));
    return formattedIncome;
}