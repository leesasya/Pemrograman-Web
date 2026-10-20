"use strict";

// Data contoh untuk menunjukkan hubungan antarpilihan dropdown.
const dataFakultas = {
  "Teknik": {
    "Teknik Komputer": ["Pemrograman Web", "Jaringan Komputer", "Sistem Digital"],
    "Teknik Elektro": ["Rangkaian Listrik", "Elektronika Dasar", "Sistem Kendali"],
    "Teknik Mesin": ["Termodinamika", "Mekanika Fluida", "Elemen Mesin"],
  },
  "Ekonomi dan Bisnis": {
    "Manajemen": ["Manajemen Pemasaran", "Manajemen Keuangan", "Manajemen Operasi"],
    "Akuntansi": ["Akuntansi Dasar", "Akuntansi Biaya", "Audit"],
  },
  "Ilmu Sosial": {
    "Ilmu Komunikasi": ["Pengantar Komunikasi", "Komunikasi Massa", "Jurnalistik"],
    "Sosiologi": ["Pengantar Sosiologi", "Sosiologi Perkotaan", "Metode Penelitian Sosial"],
  },
};

const fakultas = document.querySelector("#fakultas");
const programStudi = document.querySelector("#program-studi");
const mataKuliah = document.querySelector("#mata-kuliah");
const hasil = document.querySelector("#hasil");

function isiDropdown(dropdown, placeholder, pilihan = []) {
  dropdown.replaceChildren(new Option(placeholder, ""));

  pilihan.forEach((nama) => {
    dropdown.add(new Option(nama, nama));
  });

  dropdown.disabled = pilihan.length === 0;
}

isiDropdown(fakultas, "Pilih fakultas", Object.keys(dataFakultas));

fakultas.addEventListener("change", () => {
  const daftarProgram = dataFakultas[fakultas.value];

  isiDropdown(programStudi, "Pilih program studi", Object.keys(daftarProgram || {}));
  isiDropdown(mataKuliah, "Pilih mata kuliah");
  hasil.textContent = "";
});

programStudi.addEventListener("change", () => {
  const daftarMataKuliah = dataFakultas[fakultas.value]?.[programStudi.value] || [];

  isiDropdown(mataKuliah, "Pilih mata kuliah", daftarMataKuliah);
  hasil.textContent = "";
});

mataKuliah.addEventListener("change", () => {
  hasil.textContent = mataKuliah.value
    ? `${fakultas.value} / ${programStudi.value} / ${mataKuliah.value}`
    : "";
});
