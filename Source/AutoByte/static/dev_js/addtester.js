document.addEventListener("DOMContentLoaded", function () {
    loadCountries();
    countrySelect.addEventListener("input", loadStates);
    stateSelect.addEventListener("input", loadCities);
    firstnameinput.addEventListener("input", validatefname);
    lastnameinput.addEventListener("input", validatelname);
    inputEmail.addEventListener("input", validateEmail);
    countrySelect.addEventListener("input", validateCountry);
    stateSelect.addEventListener("input", validateState);
    citySelect.addEventListener("input", validateCity);
    categorySelect.addEventListener("input", validateMainCategory);
    incomeInput.addEventListener("input", incomeValidation);
})

testerForm.addEventListener("submit", function(event){
    event.preventDefault();
    var bool1 = validateMainCategory();
    var bool2 = validateSubCategory();
    var bool3 = validatefname();
    var bool4 = validatelname();
    var bool5 = validateEmail();
    var bool6 = validateCountry(); 
    var bool7 = validateState();
    var bool8 = validateCity();
    var bool9 = validateIncome();
    if (bool1 && bool2 && bool3 && bool4 && bool5 && bool6 && bool7 && bool8 && bool9){
        testerForm.submit();
    }
});