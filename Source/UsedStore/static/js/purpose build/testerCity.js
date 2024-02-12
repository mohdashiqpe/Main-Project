window.onload = loadCountriesTester; 
var config = {
  cURL: "https://api.countrystatecity.in/v1/countries",
  cKEY: "YTFObTBtTUlicWk4QXk4UWFmRmN4ZkFPTEJiTWJTZ2JOejAyNTJQdA==",
};

var adminCountryISO, adminStateISO;

function loadCountriesTester() {
  let apiEndPoint = config.cURL;

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.cKEY } })
    .then((Response) => Response.json())
    .then((data) => {
      data.forEach((country) => {
        if(country.name == adminCountry.value){
            adminCountryISO=country.iso2;
            loadStatesTester();
        }
      });
    })
    .catch((error) => console.error("Error Loading Countries:", error));
}

function loadStatesTester() {
  let apiEndPoint = `${config.cURL}/${adminCountryISO}/states`;
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
        if(state.name == adminState.value){
            adminStateISO=state.iso2;
            loadCitiesTester();
        }
      });
    })
    .catch((error) => console.error("Error Loading State:", error));
}

function loadCitiesTester() {
  let apiEndPoint = `${config.cURL}/${adminCountryISO}/states/${adminStateISO}/cities`;
  citySelect.innerHTML = "<option value=''>Select Your City</option>";
  console.log(apiEndPoint);
  
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