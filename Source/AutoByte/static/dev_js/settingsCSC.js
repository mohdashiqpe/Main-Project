var config = {
  cURL: "https://api.countrystatecity.in/v1/countries",
  cKEY: "YTFObTBtTUlicWk4QXk4UWFmRmN4ZkFPTEJiTWJTZ2JOejAyNTJQdA==",
};

var userCountry = document.getElementById("selectedCountryText").value;
var userState = document.getElementById("selectedStateText").value;
var userCity = document.getElementById("selectedCityText").value;

if (document.getElementById('selectedGender')){
var userGender = document.getElementById('selectedGender').value;
if (userGender.length != null) {
  var selectedGenderOpt = genderSelect.querySelector(`option[value="${userGender}"]`);
  if(selectedGenderOpt){
      selectedGenderOpt.selected = true;
  }
}
}

window.onload = loadCountries;

function loadCountries() {
  let apiEndPoint = config.cURL;
  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.cKEY } })
    .then((Response) => Response.json())
    .then((data) => {
      data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.iso2;
        option.textContent = country.name;
        countrySelect.appendChild(option);

        // Select the user's country if it matches {{ userLoca.country }}
        if (country.name === userCountry) {
          option.selected = true;
        }
      });
      loadStates();
      // Trigger the state loading based on the selected country
    })
    .catch((error) => console.error("Error Loading Countries:", error));
}

function loadStates() {
  const selectedCountry = countrySelect.value;
  let apiEndPoint = `${config.cURL}/${selectedCountry}/states`;
  stateSelect.innerHTML = "<option value=''>Select Your State</option>";
  citySelect.innerHTML = "<option value=''>Select Your City</option>";

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.cKEY } })
    .then((Response) => Response.json())
    .then((data) => {
      data.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.iso2;
        option.textContent = state.name;
        stateSelect.appendChild(option);

        // Select the user's state if it matches {{ userLoca.state }}
        if (state.name === userState) {
          option.selected = true;
        }
      });

      // Trigger the city loading based on the selected country and state
      loadCities();
    })
    .catch((error) => console.error("Error Loading State:", error));
}

function loadCities() {
  const selectedCountry = countrySelect.value;
  const selectedState = stateSelect.value;
  let apiEndPoint = `${config.cURL}/${selectedCountry}/states/${selectedState}/cities`;
  citySelect.innerHTML = "<option value=''>Select Your City</option>";

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.cKEY } })
    .then((Response) => Response.json())
    .then((data) => {
      if (data.length > 0) {
        data.forEach((city) => {
          const option = document.createElement("option");
          option.value = city.iso2;
          option.textContent = city.name;
          citySelect.appendChild(option);

          // Select the user's city if it matches {{ userLoca.city }}
          if (city.name === userCity) {
            option.selected = true;
          }
        });
      } else {
        citySelect.innerHTML = "<option value='No City'>No City</option>";
      }
    })
    .catch((error) => console.error("Error Loading City:", error));
}
