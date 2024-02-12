window.onload = loadCountries;

var config = {
  cURL: "https://api.countrystatecity.in/v1/countries",
  cKEY: "YTFObTBtTUlicWk4QXk4UWFmRmN4ZkFPTEJiTWJTZ2JOejAyNTJQdA==",
};

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
      });
    })
    .catch((error) => console.error("Error Loading Countries:", error));
}

function loadStates() {
  const selectedCountry = countrySelect.value;
  let apiEndPoint = `${config.cURL}/${selectedCountry}/states`;
  stateSelect.innerHTML = "<option value='' selected disabled>Please Select your State</option>";
  citySelect.innerHTML = "<option value='' selected disabled>Please Select your City</option>";

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.cKEY } })
    .then((Response) => Response.json())
    .then((data) => {
      if (!data) {
        stateSelect.innerHTML =
          "<option value='/' selected disabled>No States in the Selected Country</option>";
        citySelect.innerHTML =
          "<option value='/' selected disabled>No City Names in the Selected Country Option</option>";
        return true;
      }
      data.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.iso2;
        option.textContent = state.name;
        stateSelect.appendChild(option);
      });
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
      if (!data) {
        citySelect.innerHTML =
          "<option value='/' selected disabled>No City</option>";
        return false;
      }
      data.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.iso2;
        option.textContent = city.name;
        citySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error Loading City:", error));
}