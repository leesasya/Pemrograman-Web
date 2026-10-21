"use strict";

const storageKey = "libraryreg.members.v1";
const fields = ["nama", "nomor", "prodi", "jenis", "telepon", "email", "alamat"];
const form = document.querySelector("#member-form");
const list = document.querySelector("#member-list");
const search = document.querySelector("#search");
let members = [];
let staffLoggedIn = false;
let notificationTimer;

try {
  staffLoggedIn = sessionStorage.getItem("libraryreg.staff") === "true";
} catch {
  staffLoggedIn = false;
}

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (
    !Array.isArray(saved) ||
    !saved.every(
      (member) =>
        member &&
        typeof member.id === "string" &&
        fields.every((key) => typeof member[key] === "string")
    )
  )
    throw new Error("Data tidak sesuai");
  members = saved;
} catch {
  notify("Data anggota tidak dapat dibaca.", true);
}

function notify(message, error = false) {
  const box = document.querySelector("#notification");
  box.textContent = message;
  box.classList.toggle("error-message", error);
  box.hidden = false;
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    box.hidden = true;
  }, 3500);
}

function saveMembers(data) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    members = data;
    renderMembers();
    return true;
  } catch {
    notify("Penyimpanan gagal. Periksa ruang penyimpanan browser.", true);
    return false;
  }
}

function renderMembers() {
  if (!list) return;
  list.replaceChildren();
  if (!staffLoggedIn) return;
  const keyword = search.value.trim().toLowerCase();
  const results = members.filter(
    (member) =>
      member.nama.toLowerCase().includes(keyword) ||
      member.nomor.toLowerCase().includes(keyword)
  );

  results.forEach((member) => {
    const row = document.createElement("tr");
    ["nama", "nomor", "prodi", "jenis"].forEach((key) => {
      const cell = document.createElement("td");
      if (key === "nama") {
        const name = document.createElement("strong");
        const email = document.createElement("span");
        name.textContent = member.nama;
        email.textContent = member.email;
        email.className = "member-email";
        cell.append(name, email);
      } else if (key === "jenis") {
        const badge = document.createElement("span");
        badge.className = "member-type";
        badge.textContent = member.jenis;
        cell.append(badge);
      } else {
        cell.textContent = member[key];
      }
      row.append(cell);
    });
    const actions = document.createElement("td");
    ["Detail", "Edit", "Hapus"].forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "row-action";
      button.textContent = action;
      button.setAttribute("aria-label", action + " anggota " + member.nama);
      button.addEventListener("click", () => manageMember(action, member));
      actions.append(button);
    });
    row.append(actions);
    list.append(row);
  });

  document.querySelector("#member-count").textContent = keyword
    ? results.length + " dari " + members.length + " anggota"
    : members.length + " anggota";
  const empty = document.querySelector("#empty-state");
  empty.hidden = results.length > 0;
  empty.textContent = keyword
    ? "Anggota tidak ditemukan."
    : "Belum ada anggota. Isi formulir untuk menambah data.";
}

function resetForm() {
  form.reset();
  document.querySelector("#member-id").value = "";
  document.querySelector("#form-title").textContent = "Pendaftaran anggota";
  document.querySelector("#submit-button").textContent = "Simpan pendaftaran";
  document.querySelector("#form-error").textContent = "";
  toggleManualProdi();
}

function toggleManualProdi() {
  const manual = document.querySelector("#prodi").value === "Lainnya";
  document.querySelector("#prodi-manual-field").hidden = !manual;
  document.querySelector("#prodi-manual").disabled = !manual;
  document.querySelector("#prodi-manual").required = manual;
}
if (form) {
  document.querySelector("#prodi").addEventListener("change", toggleManualProdi);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {};
    fields.forEach((key) => {
      data[key] = document.getElementById(key).value.trim();
    });
    const id = document.querySelector("#member-id").value;
    const error = document.querySelector("#form-error");
    error.textContent = "";
    if (id && !staffLoggedIn) {
      error.textContent = "Login petugas untuk mengedit data.";
      return;
    }
    if (data.prodi === "Lainnya")
      data.prodi = document.querySelector("#prodi-manual").value.trim();

    if (fields.some((key) => !data[key])) {
      error.textContent = "Semua kolom wajib diisi.";
      return;
    }
    if (!/^[0-9]+$/.test(data.nomor)) {
      error.textContent = "NIM / NIP hanya boleh berisi angka.";
      return;
    }
    if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(data.email)) {
      error.textContent = "Masukkan email yang valid, contoh: nama@kampus.ac.id.";
      return;
    }
    if (members.some((member) => member.nomor === data.nomor && member.id !== id)) {
      error.textContent = "NIM / NIP sudah terdaftar.";
      return;
    }

    data.id = id || String(Date.now());
    const updated = id
      ? members.map((member) => (member.id === id ? data : member))
      : [...members, data];
    if (saveMembers(updated)) {
      resetForm();
      if (staffLoggedIn) {
        location.href = "admin.html";
        return;
      }
      notify(id ? "Data anggota diperbarui." : "Pendaftaran berhasil disimpan.");
    }
  });

  document.querySelector("#reset-button").addEventListener("click", () => {
    resetForm();
    history.replaceState(null, "", "form.html");
  });
  toggleManualProdi();
  const editId = new URLSearchParams(location.search).get("edit");
  if (editId) {
    const member = staffLoggedIn && members.find((item) => item.id === editId);
    if (!member) {
      location.replace("index.html#anggota");
    } else {
      fields.forEach((key) => {
        const input = document.getElementById(key);
        if (
          key === "prodi" &&
          !Array.from(input.options).some(
            (option) => option.value === member[key] && option.value !== "Lainnya"
          )
        ) {
          input.value = "Lainnya";
          document.querySelector("#prodi-manual").value = member[key];
        } else {
          input.value = member[key];
        }
      });
      document.querySelector("#member-id").value = member.id;
      document.querySelector("#form-title").textContent = "Edit anggota";
      document.querySelector("#submit-button").textContent = "Simpan perubahan";
      toggleManualProdi();
    }
  }
  if (staffLoggedIn) {
    document.querySelector("#back-link").href = "admin.html";
    document.querySelector("#back-link").textContent = "← Kembali ke daftar anggota";
  }
}

function manageMember(action, member) {
  if (!staffLoggedIn) return;
  if (action === "Detail") {
    const detail = document.querySelector("#member-detail");
    const labels = [
      "Nama lengkap",
      "NIM / NIP",
      "Program studi / unit",
      "Keanggotaan",
      "Telepon",
      "Email",
      "Alamat"
    ];
    detail.replaceChildren();
    fields.forEach((key, index) => {
      const label = document.createElement("dt");
      const value = document.createElement("dd");
      label.textContent = labels[index];
      value.textContent = member[key];
      detail.append(label, value);
    });
    document.querySelector("#detail-dialog").showModal();
  } else if (action === "Edit") {
    location.href = "form.html?edit=" + encodeURIComponent(member.id);
  } else if (confirm("Hapus data " + member.nama + "?")) {
    if (saveMembers(members.filter((item) => item.id !== member.id))) {
      notify("Data anggota dihapus.");
    }
  }
}

if (!form && !list) {
  // Tabel hanya ditampilkan setelah login petugas.
  function showPage() {
    const section = location.hash.slice(1) || "beranda";
    if (section === "anggota" && !staffLoggedIn) {
      history.replaceState(null, "", "#beranda");
      openLogin();
      return;
    }
    if (section === "pendaftaran") {
      location.replace("form.html");
      return;
    }
    if (section === "anggota") {
      location.replace("admin.html");
      return;
    }
    document.querySelector("#admin-menu").hidden = !staffLoggedIn;
    document.querySelectorAll(".nav-link").forEach((link) => {
      const active = link.getAttribute("href") === "#" + section;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.getElementById(section)?.scrollIntoView();
  }

  window.addEventListener("hashchange", showPage);
  document.querySelectorAll("#menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.bootstrap)
        bootstrap.Collapse.getInstance(document.querySelector("#menu"))?.hide();
    });
  });

  const loginButton = document.querySelector("#login-button");
  function openLogin() {
    document.querySelector("#login-error").textContent = "";
    const dialog = document.querySelector("#login-dialog");
    if (!dialog.open) dialog.showModal();
  }
  loginButton.addEventListener("click", () => {
    if (window.bootstrap)
      bootstrap.Collapse.getInstance(document.querySelector("#menu"))?.hide();
    if (staffLoggedIn) {
      staffLoggedIn = false;
      loginButton.textContent = "Login Petugas";
      sessionStorage.removeItem("libraryreg.staff");
      history.replaceState(null, "", "#beranda");
      showPage();
      notify("Berhasil keluar.");
    } else {
      openLogin();
    }
  });

  document.querySelector("#login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;
    if (username !== "petugas" || password !== "library123") {
      document.querySelector("#login-error").textContent =
        "Username atau kata sandi salah.";
      return;
    }
    staffLoggedIn = true;
    sessionStorage.setItem("libraryreg.staff", "true");
    loginButton.textContent = "Keluar Petugas";
    event.target.reset();
    document.querySelector("#login-dialog").close();
    location.href = "admin.html";
  });

  // Katalog contoh untuk pencarian di beranda.
  const books = [
    { title: "Pemrograman Web", author: "Abdul Kadir", category: "Teknologi" },
    { title: "Basis Data", author: "Fathansyah", category: "Teknologi" },
    {
      title: "Algoritma dan Pemrograman",
      author: "Rinaldi Munir",
      category: "Teknologi"
    },
    { title: "Laskar Pelangi", author: "Andrea Hirata", category: "Sastra" },
    { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", category: "Sastra" },
    { title: "Filosofi Teras", author: "Henry Manampiring", category: "Umum" }
  ];
  document.querySelector("#book-search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = document.querySelector("#book-search").value.trim().toLowerCase();
    if (!keyword) return;
    const results = books.filter((book) =>
      (book.title + " " + book.author).toLowerCase().includes(keyword)
    );
    const bookList = document.querySelector("#book-list");
    bookList.replaceChildren();
    results.forEach((book) => {
      const article = document.createElement("article");
      const title = document.createElement("h3");
      const description = document.createElement("p");
      title.textContent = book.title;
      description.textContent = book.author + " · " + book.category;
      article.append(title, description);
      bookList.append(article);
    });
    if (!results.length)
      bookList.textContent = "Buku tidak ditemukan di katalog contoh.";
    document.querySelector("#book-results").hidden = false;
    document.querySelector("#book-results").scrollIntoView({ block: "nearest" });
  });

  // Setiap kategori grafik memakai satuan yang sama.
  const charts = {
    koleksi: {
      title: "Koleksi buku",
      unit: "buku",
      labels: ["Teknologi", "Sastra", "Umum"],
      values: [5000, 4000, 3000]
    },
    anggota: {
      title: "Jenis anggota",
      unit: "anggota",
      labels: ["Mahasiswa", "Dosen", "Tendik"],
      values: [2800, 450, 250]
    },
    fasilitas: {
      title: "Kursi baca",
      unit: "kursi",
      labels: ["Ruang baca", "Diskusi", "Komputer"],
      values: [100, 30, 20]
    }
  };
  function showChart(key) {
    const chart = charts[key];
    const area = document.querySelector("#stat-chart");
    area.replaceChildren();
    document.querySelector("#chart-title").textContent = chart.title;
    document.querySelector("#chart-detail").textContent =
      "Pilih batang untuk melihat jumlah.";
    document.querySelectorAll("[data-chart]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.chart === key));
    });
    chart.labels.forEach((label, index) => {
      const button = document.createElement("button");
      const bar = document.createElement("span");
      const caption = document.createElement("span");
      const count = chart.values[index].toLocaleString("id-ID");
      button.type = "button";
      button.className = "chart-column";
      button.setAttribute("aria-label", label + ": " + count + " " + chart.unit);
      button.setAttribute("aria-pressed", "false");
      bar.className = "chart-bar";
      bar.style.height = (chart.values[index] / Math.max(...chart.values)) * 100 + "%";
      bar.textContent = count;
      caption.textContent = label;
      button.append(bar, caption);
      button.addEventListener("click", () => {
        area
          .querySelectorAll("button")
          .forEach((item) =>
            item.setAttribute("aria-pressed", String(item === button))
          );
        document.querySelector("#chart-detail").textContent =
          label + ": " + count + " " + chart.unit;
      });
      area.append(button);
    });
  }
  document.querySelectorAll("[data-chart]").forEach((button) => {
    button.addEventListener("click", () => showChart(button.dataset.chart));
  });

  const carouselElement = document.querySelector("#library-carousel");
  carouselElement.addEventListener("slid.bs.carousel", (event) => {
    document.querySelectorAll("[data-bs-slide-to]").forEach((button) => {
      const active = Number(button.dataset.bsSlideTo) === event.to;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  });
  document.querySelector("#carousel-pause").addEventListener("click", (event) => {
    if (!window.bootstrap) return;
    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselElement);
    const paused = event.currentTarget.getAttribute("aria-pressed") !== "true";
    if (paused) carousel.pause();
    else carousel.cycle();
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.setAttribute(
      "aria-label",
      paused ? "Putar pergantian foto" : "Jeda pergantian foto"
    );
    event.currentTarget.textContent = paused ? "Putar" : "Jeda";
  });

  showChart("koleksi");
  if (staffLoggedIn) loginButton.textContent = "Keluar Petugas";
  showPage();
}

if (list) {
  if (!staffLoggedIn) {
    location.replace("index.html#anggota");
  } else {
    document.querySelector("#database-board").hidden = false;
    search.addEventListener("input", renderMembers);
    document.querySelector("#logout-button").addEventListener("click", () => {
      sessionStorage.removeItem("libraryreg.staff");
      staffLoggedIn = false;
      list.replaceChildren();
      document.querySelector("#database-board").hidden = true;
      document.querySelector("#member-detail").replaceChildren();
      document.querySelector("#detail-dialog").close();
      location.replace("index.html");
    });
    renderMembers();
  }
}