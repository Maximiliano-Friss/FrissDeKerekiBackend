const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    preferredCountries: ["ar", "uy", "cl", "py", "pe"],
    utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

function phoneNumber(event) {
    let phone = phoneInput.getNumber();
    document.getElementById('telefono').value = phone;
}

phoneInputField.addEventListener("blur", phoneNumber);
