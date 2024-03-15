document.addEventListener("DOMContentLoaded", function () {
  var editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var index = button.id.replace("editBtn", "");
      var userlocaId = document.getElementById("userloca" + index).value;
      var country = document.querySelector("#country" + index).value;
      var state = document.querySelector("#state" + index).value;
      var city = document.querySelector("#city" + index).value;
      var street = document.querySelector("#street" + index).value;
      var address = document.querySelector("#address" + index).value;
      var contactNumber = document.querySelector(
        "#contact_number" + index
      ).value;
      console.log("Address ID:", userlocaId);
      console.log("Country:", country);
      console.log("State:", state);
      console.log("City:", city);
      console.log("Street:", street);
      console.log("Address:", address);
      console.log("Contact Number:", contactNumber);

      addressEditDiv.classList.remove("d-none");

      userCountry = country;
      userState = state;
      userCity = city;
      loadCountries();

      streetName.value = street;
      addressInput.value = address;
      phoneNumberInput.value = contactNumber;

      document.getElementById("userlocaId").value = userlocaId;

      document.getElementById("settingForm2").action = "/settingsForm3/";
      addAddressBtn.innerHTML = `<strong style="font-weight: 900;">+</strong> Add Address`;
    });
  });
});
