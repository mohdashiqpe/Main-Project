document.addEventListener('DOMContentLoaded', function () {
   fullNameInput.addEventListener('input', validateFullName);
   emailInput.addEventListener('input', validateEmail);
   incomeInput.addEventListener('input', incomeValidation)
});

testerForm.addEventListener('submit', function(event){
    event.preventDefault();
    var b1 = validateFullName();
    var b2 = validateEmail();
    var b4 = incomeValidation();
    if (b1 && b2 && b4){
        console.log('reached');
        testerForm.submit();
    }
});