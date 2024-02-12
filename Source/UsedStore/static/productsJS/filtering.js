window.onload = loadFilteredMainCategory;

const mainCategory = document.getElementById('mainCategory');
const category = document.getElementById('category');
const subCategory = document.getElementById('subCategory')

const catList = document.getElementById('catList');
const subCatList = document.getElementById('subCatList');

const rangeInput = document.getElementById('customRange1');
const maxPriceDisplay = document.getElementById('maxPriceDisplay');

function loadFilteredMainCategory(){
    fetch('/loadCategory/')
    .then(response => response.json())
    .then((data) => { 
        const main_Category = data.cat;
        for (let c of main_Category){
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            mainCategory.appendChild(option);
        }
    });
}


function loadFilterCategory(){
    const selectedMainCategory = mainCategory.value;
    category.innerHTML = `<option value="">All</option>`;
    console.log(selectedMainCategory);
    fetch(`/loadSubCategory/?id=${selectedMainCategory}`)
    .then(response => response.json())
    .then((data) => {
        catList.classList.remove('d-none');
        for (let mc of data.scat){
            const optiom = document.createElement('option');
            optiom.value = mc.id;
            optiom.textContent = mc.name;
            category.appendChild(optiom);
        }

    });
}


document.addEventListener('DOMContentLoaded', function(){
    rangeInput.addEventListener('input', function () {
        maxPriceDisplay.textContent = rangeInput.value;
    });
});