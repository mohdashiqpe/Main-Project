const category_input = document.getElementById('filtercat');
const brand_input = document.getElementById('filterbrand');

window.onload=loadCategory;

function loadCategory() {
    brand_input.innerHTML = "<option value=''>All Brands</option>";
    fetch(`/loadSubCategory/?id=1`)
    .then(response => response.json())
    .then((data) => {
        for (const iterator of data.scat) {
            const option = document.createElement("option");
            option.value = iterator.id;
            option.textContent = iterator.name;
            category_input.appendChild(option);
        }
    });
}

function loadBrands() {
    brand_input.innerHTML = "<option value=''>All Brands</option>";
    const categoryVal=category_input.value;
    fetch(`/loadSubSUbCategory/?id=${categoryVal}`)
    .then(response => response.json())
    .then((data)=>{
        for (const iterator of data.sscat) {
            const option = document.createElement("option");
            option.value = iterator.id;
            option.textContent = iterator.name;
            brand_input.appendChild(option);
        }
    });
}