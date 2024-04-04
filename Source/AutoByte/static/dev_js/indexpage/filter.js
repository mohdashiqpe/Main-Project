const count = document.getElementById("countp").value;
const product_div = []
const rating_input = []
const filtersid = document.getElementById("filtersid");
const filterdiv = document.getElementById('filterdiv');
var selectedfilterrate = []

var html_filter_div = `
<div>
    <p class="text-dark d-inline">5 Star Rating</p><a href="" class="d-inline pl-2">X</a>
</div>
`;

for (let i = 1; i <= count; i++) {
    product_div[i] = document.getElementById(`productdiv${i}`);
    rating_input[i] = document.getElementById(`ratinghid${i}`);
}

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (event) => {
        const target = event.target;

        if (target.matches('input[type="checkbox"][id^="rating"]')) {
            const ratingValue = target.value;

            if (target.checked) {
                selectedfilterrate.push(ratingValue);
                for (let i = 1; i <= count; i++) {
                    if((rating_input[i].value != ratingValue) && (!selectedfilterrate.includes(rating_input[i].value))){
                        product_div[i].classList.add('d-none');
                    }
                }
            } else {
                selectedfilterrate.pop(ratingValue);
                for (let i = 1; i <= count; i++) {
                    if((rating_input[i].value != ratingValue) && (!selectedfilterrate.includes(rating_input[i].value))){
                            product_div[i].classList.remove('d-none');
                    }
                }
            }
        } else if (target.matches('input[type="checkbox"][id^="Check"]')){
            const ratingValue = target.value;
            console.log(`Price Value ${ratingValue}`);
            const productDiv = document.getElementById(`productdiv${target.dataset.index}`);

            if (target.checked) {
                console.log(`Selected ${ratingValue}`);
                console.log("Found");
            } else {
                console.log(`Not Selected ${ratingValue}`);
                console.log("Not Found");
            }
        }
    });
});