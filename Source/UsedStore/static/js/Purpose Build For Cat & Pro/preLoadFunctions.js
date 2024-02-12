// // Loads Category
// function loadCategory() {
//     console.log('Hell');
//     categorySelect.innerHTML = "<option value='' selected disabled>Select Your Category</option>"
//     fetch(`/loadCategory/`)
//         .then(response => response.json())
//         .then((data) => {
//             var cats = data.cat;
//             for (var i of cats) {
//                 if (i.parentCategory == null) {
//                     const option = document.createElement('option');
//                     option.value = i.id;
//                     option.textContent = i.categoryName;
//                     categorySelect.appendChild(option);
//                 }
//             }
//         });
// }

// Loads Sub Category
function loadSubs(){
    console.log(categorySelect.value);
    subCatSel.innerHTML = "<option value='' selected disabled>Select Your Sub Category</option>";
    const catID = categorySelect.value;
    fetch(`/loadCategory/`)
        .then(response => response.json())
        .then((data) => {
            var cats = data.cat;
            for (var i of cats){
                if (i.catCount > 0 && i.id === catID){
                    sibDiv.classList.remove('d-none');
                    break;
                }else{
                    sibDiv.classList.add('d-none');
                }
            }
            for (var i of cats) {
                if (i.parentCategory == catID) {
                    sibDiv.classList.remove('d-none')
                    const option = document.createElement('option');
                    option.value = i.id;
                    option.textContent = i.categoryName;
                    subCatSel.appendChild(option);
                    console.log('hi');
                }
            }
        });
}