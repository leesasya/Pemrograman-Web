"use strict";
const filterButtons = document.querySelectorAll("[data-filter]");
const courseItems = document.querySelectorAll(".course-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let count = 0;

    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    courseItems.forEach((item) => {
      const visible = category === "all" || item.dataset.category === category;
      item.hidden = !visible;
      if (visible) count++;
    });

    document.querySelector("#filter-status").textContent =
      `Menampilkan ${count} kelas`;
  });
});

const courseModal = document.querySelector("#course-modal");

courseModal?.addEventListener("show.bs.modal", (event) => {
  const course = courses[Number(event.relatedTarget?.dataset.course)];
  if (!course) return;

  document.querySelector("#course-title").textContent = course.title;
  document.querySelector("#course-description").textContent =
    course.description;
  document.querySelector("#course-meta").textContent = course.meta;
  const list = document.querySelector("#course-syllabus");
  list.replaceChildren();

  course.syllabus.forEach((topic) => {
    const item = document.createElement("li");
    item.textContent = topic;
    list.append(item);
  });
});

const authForm = document.querySelector("#auth-form");

if (authForm) {
  const fields = [...authForm.querySelectorAll("[required]")];
  const status = document.querySelector("#form-status");
  const password = document.querySelector("#password");
  const confirmation = document.querySelector("#confirmation");

  function validate(field) {
    let message = "";

    if (field.type === "checkbox") {
      if (!field.checked) message = "Centang persetujuan untuk melanjutkan.";
    } else if (!field.value.trim()) {
      message = "Kolom ini wajib diisi.";
    } else if (field.id === "email") {
      const emailPattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
      if (
        field.validity.typeMismatch ||
        !emailPattern.test(field.value.trim())
      ) {
        message = "Gunakan format email seperti nama@gmail.com.";
      }
    } else if (field.id === "password" && field.value.length < 8) {
      message = "Password minimal 8 karakter.";
    } else if (field.id === "confirmation" && field.value !== password.value) {
      message = "Konfirmasi password harus sama.";
    }

    field.setCustomValidity(message);
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
    document.getElementById(`${field.id}-error`).textContent = message;
    return !message;
  }

  fields.forEach((field) => {
    field.addEventListener("blur", () => validate(field));
    field.addEventListener("input", () => {
      status.hidden = true;
      if (field.classList.contains("is-invalid")) validate(field);
      if (field === password && confirmation?.value) validate(confirmation);
    });
    field.addEventListener("change", () => {
      status.hidden = true;
      validate(field);
    });
  });

  document
    .querySelector("#show-password")
    .addEventListener("change", (event) => {
      const type = event.target.checked ? "text" : "password";
      password.type = type;
      if (confirmation) confirmation.type = type;
    });

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = fields.map(validate).every(Boolean);
    status.hidden = true;

    if (!valid) {
      fields.find((field) => field.classList.contains("is-invalid")).focus();
      return;
    }

    status.className = "alert alert-success mt-3 mb-0";
    status.textContent =
      authForm.dataset.mode === "register"
        ? "Data pendaftaran valid. Ini demo frontend; akun belum dibuat."
        : "Format data valid. Ini demo frontend; login belum dilakukan.";
    status.hidden = false;

    // Data sensitif tidak disimpan dan tidak dikirim ke server.
    password.value = "";
    password.type = "password";
    if (confirmation) {
      confirmation.value = "";
      confirmation.type = "password";
    }
    document.querySelector("#show-password").checked = false;
  });
}
