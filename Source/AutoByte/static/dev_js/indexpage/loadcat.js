const category_input = document.getElementById('filtercat');
const brand_input = document.getElementById('filterbrand');

window.onload=loadCategory;

var selectedcat = document.getElementById('selectedcat')
var selectedbrand = document.getElementById('selectedbrand')

function loadCategory() {
    brand_input.innerHTML = "<option value='all'>All Brands</option>";
    fetch(`/loadSubCategory/?id=1`)
    .then(response => response.json())
    .then((data) => {
        for (const iterator of data.scat) {
            const option = document.createElement("option");
            option.value = iterator.id;
            option.textContent = iterator.name;
            category_input.appendChild(option);

            if (selectedcat.value.trim().length != 0){
                if (iterator.id == selectedcat.value) {
                    option.selected = true;
                    loadBrands();
                }
            }
        }
    });
}

function loadBrands() {
    brand_input.innerHTML = "<option value='all'>All Brands</option>";
    const categoryVal=category_input.value;
    fetch(`/loadSubSUbCategory/?id=${categoryVal}`)
    .then(response => response.json())
    .then((data)=>{
        for (const iterator of data.sscat) {
            const option = document.createElement("option");
            option.value = iterator.id;
            option.textContent = iterator.name;
            brand_input.appendChild(option);

            if (selectedbrand.value.trim().length != 0){
                console.log(`Selected Category: ${selectedbrand.value.trim()}, Iterator Val: ${iterator.id}`);
                if (iterator.id == selectedbrand.value) {
                    console.log(`Item Selected: ${iterator.name}`);
                    option.selected = true;
                }
            }
        }
    });
}