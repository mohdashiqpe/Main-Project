addProForm.addEventListener('submit', function(event){
    event.preventDefault();
    var v1 = validateCategory();
    var v2 = validateSubCat();
    var v3 = validateProductName();
    var v4 = validateAmount();
    var v5 = validateStockCount();
    var v6 = validateImage();
    if (v1){
        if (!(sibDiv.classList.contains('d-none'))){
            if (v2 && v3 && v4 && v5 && v6){
                stockHidden.value = stockCount.value;
                addProForm.submit();
            }
        }else{
            if (v3 && v4 && v5 && v6){
                stockHidden.value = stockCount.value;
                addProForm.submit();
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function(){
    loadCategory();
    pnameInput.addEventListener('input', validateProductName);
    amountInput.addEventListener('input', validateAmount);
    minStockBtn.addEventListener('click', validateStockLess);
    maxStockBtn.addEventListener('click', validateStockAdd);
});

