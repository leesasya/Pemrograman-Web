"use strict";

// Atribut list pada input nama menghubungkannya ke datalist di HTML.
// Browser menampilkan rekomendasi berdasarkan huruf yang diketik pengguna.
const form = document.querySelector("#registration-form");
const fields = [...form.querySelectorAll("input, select")];

function validateField(field) {
  const value = field.value.trim();
  const label = form.querySelector(`label[for="${field.id}"]`).textContent;
  let message = "";

  if (!value) {
    message = `${label} wajib diisi.`;
  } else if (field.id === "nim" && !/^[0-9]+$/.test(value)) {
    message = "NIM hanya boleh berisi angka tanpa spasi.";
  }

  field.setAttribute("aria-invalid", String(Boolean(message)));
  document.getElementById(`${field.id}-error`).textContent = message;
  return !message;
}

fields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
  field.addEventListener("change", () => {
    validateField(field);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    fields.find((field) => field.getAttribute("aria-invalid") === "true").focus();
    return;
  }

  alert("Registrasi berhasil.");
});

