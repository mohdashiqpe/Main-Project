window.onload = loadCategory;
document.addEventListener('DOMContentLoaded', function () {
    if (radioOne) {
        radioOne.addEventListener('click', function () {
            categorySelectDiv.style.display = "none";
            mainCategorySelectDiv.style.display = "none";
            document.getElementById('ctlabel').textContent = "Main Category";
            document.getElementById('category').placeholder = "Main Category";
            categoryInput.name = "mainCat";
        });
        radioTwo.addEventListener('click', function () {
            mainCategorySelectDiv.style.display = '';
            categorySelectDiv.style.display = "none";
            document.getElementById('ctlabel').textContent = "Category";
            document.getElementById('category').placeholder = "Category";
            categoryInput.name = "cat";
        });
        if (radioThree) {
            radioThree.addEventListener('click', function () {
                mainCategorySelectDiv.style.display = '';
                categorySelectDiv.style.display = '';
                document.getElementById('ctlabel').textContent = "Sub Category";
                document.getElementById('category').placeholder = "Sub Category";
                categoryInput.name = "subCat";
            });
        }
    }
});

function loadCategory() {
    categorySelect.innerHTML = "<option value='' selected disabled>Select Your Main Category</option>"
    fetch(`/loadCategory/`)
        .then(response => response.json())
        .then((data) => {
            if (data.cat != false) {
                const cats = data.cat;
                if (radioThree && radioThree.checked) {
                    for (var i of cats) {
                        if (i.count > 0) {
                            const option = document.createElement('option');
                            option.value = i.id;
                            option.textContent = i.name;
                            categorySelect.appendChild(option);
                        }
                    }
                }else{
                    for (var i of cats) {
                        const option = document.createElement('option');
                        option.value = i.id;
                        option.textContent = i.name;
                        categorySelect.appendChild(option);
                    }
                }
            }
        })
}


function loadSubCategory() {
    const selectData = categorySelect.value.trim();
    fetch(`/loadSubCategory/?id=${selectData}`)
        .then(response => response.json())
        .then((data) => {
            if (data.scat != false) {
                for (var i of data.scat) {
                    const option = document.createElement('option');
                    option.value = i.id;
                    option.textContent = i.name;
                    scategorySelect.appendChild(option);
                }
            }
        })
    scategorySelect.innerHTML = "<option value='' selected disabled>Select Your Category</option>"
}