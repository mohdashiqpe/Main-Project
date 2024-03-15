const searchInput = document.getElementById("navbar-search-input");
const productdiv = document.getElementById("productdiv");
document.addEventListener("DOMContentLoaded", () => {
    searchInput.addEventListener("input", findProduct);
});

function findProduct() {
    console.log(searchInput.value);
}