// Loading Category on Browser Load itself
window.onload = function(){
    loadMainCategory();
    if (productLocaSelect){
        loadLocation();
    }
}


function loadMainCategory() {
    categorySelect.innerHTML = "<option value='' selected disabled>Select Your Main Category</option>";
    fetch(`/loadCategory/`) 
        .then(response => response.json())
        .then((data) => {
            for (var i of data.cat) {
                const option = document.createElement('option');
                option.value = i.id;
                option.textContent = i.name;
                categorySelect.appendChild(option);
                console.log('Done');
            }
        });
}

function loadCategory() {
    const selectedMainCategory = categorySelect.value;
    CatSel.innerHTML = "<option value='' disabled selected>Select Your Category</option>";
    fetch(`/loadSubCategory/?id=${selectedMainCategory}`)
        .then(response => response.json())
        .then((data) => {
            if (data.scat == false) {
                CatSel.innerHTML = "<option value='' selected disabled>No Categories</option>";
                subCatSel.innerHTML = "<option value='' selected disabled>No Sub Categories</option>";
            } else {
                catDiv.classList.remove('d-none');
                for (var i of data.scat) {
                    const option = document.createElement('option');
                    option.value = i.id;
                    option.textContent = i.name;
                    CatSel.appendChild(option);
                }
            }
        });
}


function loadSubCategory() {
    const selectedCategory = CatSel.value;
    subCatSel.innerHTML = "<option value='' disabled selected>Select Your Category</option>";
    fetch(`/loadSubSUbCategory/?id=${selectedCategory}`)
    .then(response => response.json())
    .then((data) => {
        if (data.sscat == false){
            subCatSel.innerHTML = "<option value='/' selected disabled>No Sub Categories</option>";
        } else {
            subDiv.classList.remove('d-none');
            for (var i of data.sscat) {
                const option = document.createElement('option');
                option.value = i.id;
                option.textContent = i.name;
                subCatSel.appendChild(option);
            }
        }
    });
}

function loadLocation(){
    fetch('/loadLocation/')
    .then(response => response.json())
    .then((data) => {
        if (data.userloca === false){
            productLocaSelect.innerHTML = "<option>Please add Your Location</option>"
        }else{
            for (var i of data.userloca){
                const option = document.createElement('option');
                option.value = i.id;
                option.textContent = `${i.country}, ${i.state}, ${i.city}\n ${i.street}, ${i.address}`;
                productLocaSelect.appendChild(option);
            }
        }
    });
}