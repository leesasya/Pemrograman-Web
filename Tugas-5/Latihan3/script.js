"use strict";

const form = document.querySelector("#registration-form");
const fields = [...form.querySelectorAll("input, select, textarea")];
const status = document.querySelector("#status");

// Memerlukan nama pengguna, @, domain, dan akhiran seperti .com atau .ac.id.
const emailPattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

function validateField(field) {
  let message = "";

  if (field.type === "checkbox") {
    if (!field.checked) message = "Please agree to the above information.";
  } else if (!field.value.trim()) {
    message = "This field is required.";
  } else if (field.type === "email") {
    if (field.validity.typeMismatch || !emailPattern.test(field.value.trim())) {
      message = "Please enter a valid email, such as example@domain.com.";
    }
  }

  field.setAttribute("aria-invalid", String(Boolean(message)));
  document.getElementById(`${field.id}-error`).textContent = message;
  return !message;
}

fields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    status.textContent = "";
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
  field.addEventListener("change", () => {
    status.textContent = "";
    validateField(field);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "";

  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) {
    fields.find((field) => field.getAttribute("aria-invalid") === "true").focus();
    return;
  }

  status.textContent = "Registration validated successfully.";
});

form.addEventListener("reset", () => {
  fields.forEach((field) => {
    field.removeAttribute("aria-invalid");
    document.getElementById(`${field.id}-error`).textContent = "";
  });
  status.textContent = "";
});
