document.addEventListener("DOMContentLoaded", function (){
    console.log('Inside DOM');
    countrySelect.addEventListener("change", validateCountry);
    stateSelect.addEventListener("change", validateState);
    citySelect.addEventListener("change", validateCity);
});

regForm2.addEventListener("submit", function (event){
    event.preventDefault();
    var b1 = validateCountry();
    var b2 = validateState();
    var b3 = validateCity();
    if (b1 && b2 && b3){
        regForm2.submit();
    }
});
