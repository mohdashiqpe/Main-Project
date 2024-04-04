const timeInput = document.getElementById('testtime');

document.addEventListener("DOMContentLoaded", function () {
  gettommarow();
  validateForm();
});

const selectedTester = document.getElementById("selectedTester1");
const datePicker = document.getElementById("datePicker");

function gettommarow() {
  var today = new Date();
  var tomorrow = new Date(today);
  console.log(tomorrow);
  tomorrow.setDate(today.getDate() + 1);
  var formattedDate = tomorrow.toISOString().split("T")[0];
  document.getElementById("datePicker").min = formattedDate;
}

function validateForm() {
  var btnclk = document.getElementById("btnclk");
  var datePicker = document.getElementById("datePicker");
  btnclk.addEventListener("click", function (event) {
    event.preventDefault();
    timevalidation();
    var today = new Date();
    var selectedDate = new Date(datePicker.value);
    if (selectedTester.selectedIndex && selectedDate > today) {
        if (timevalidation()){
            document.getElementById("frm001").submit();
        }
      // console.log(selectedDate);
    } else if (datePicker.value === "" && selectedTester.selectedIndex === 0) {
      document.getElementById("dateErr").classList = "text-danger";
      document.getElementById("errmsg").classList = "text-danger";
    } else if (datePicker.value === "") {
      document.getElementById("dateErr").classList = "text-danger";
      document.getElementById("errmsg").classList.add("d-none");
    } else {
      document.getElementById("errmsg").classList = "text-danger";
      document.getElementById("dateErr").classList.add("d-none");
    }
  });
}

selectedTester.addEventListener("change", function(){
    fetch(`/identify_available_dates/?email=${selectedTester.value}`)
    .then(response => response.json())
    .then((data) => {
        console.log("Done");
    })
});
    
function timevalidation() {
    if (!timeInput.value) {
        timeInput.classList.add('is-invalid');
        return false;
    } else {
        timeInput.classList.remove('is-invalid');
        return true;
    }
}
