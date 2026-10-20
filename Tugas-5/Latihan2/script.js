"use strict";

const API_URL = "https://www.emsifa.com/api-wilayah-indonesia/v2";
const form = document.querySelector("#search-form");
const province = document.querySelector("#province");
const regency = document.querySelector("#regency");
const district = document.querySelector("#district");
const searchButton = document.querySelector("#search-button");
const retryButton = document.querySelector("#retry-button");
const status = document.querySelector("#status");
const results = document.querySelector("#results");
const region = document.querySelector("#region");
const resultList = document.querySelector("#result-list");

let activeRequest = null;

function resetSelect(select, placeholder) {
  select.replaceChildren(new Option(placeholder, ""));
  select.disabled = true;
}

function clearResults() {
  activeRequest?.abort();
  activeRequest = null;
  results.hidden = true;
  resultList.replaceChildren();
  status.textContent = "";
  status.className = "";
  retryButton.hidden = true;
  searchButton.disabled = !district.value;
}

async function requestData(path, onSuccess, retry) {
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  const timeout = setTimeout(() => controller.abort(), 15000);

  status.textContent = "Memuat data...";
  status.className = "";
  retryButton.hidden = true;

  try {
    const response = await fetch(`${API_URL}/${path}.json`, {
      signal: controller.signal,
    });

    if (!response.ok) throw new Error("Permintaan API gagal.");

    const payload = await response.json();
    if (!Array.isArray(payload.data)) throw new Error("Format data tidak sesuai.");
    if (activeRequest !== controller) return;

    status.textContent = "";
    onSuccess(payload.data);
  } catch (error) {
    // Abaikan respons lama jika pilihan wilayah sudah berubah.
    if (activeRequest !== controller) return;

    status.textContent = "Data gagal dimuat. Periksa koneksi internet lalu coba lagi.";
    status.className = "error";
    retryButton.hidden = false;
    retryButton.onclick = retry;
  } finally {
    clearTimeout(timeout);
    if (activeRequest === controller) activeRequest = null;
  }
}

function loadOptions(select, path, placeholder) {
  resetSelect(select, "Memuat data...");

  return requestData(path, (items) => {
    resetSelect(select, placeholder);

    items.forEach((item) => {
      select.add(new Option(item.name, item.id));
    });

    select.disabled = items.length === 0;
    if (!items.length) status.textContent = "Data wilayah tidak tersedia.";
  }, () => loadOptions(select, path, placeholder));
}

province.addEventListener("change", () => {
  clearResults();
  resetSelect(regency, "Pilih kabupaten/kota");
  resetSelect(district, "Pilih kecamatan");
  searchButton.disabled = true;

  if (province.value) {
    loadOptions(regency, `regencies/${province.value}`, "Pilih kabupaten/kota");
  }
});

regency.addEventListener("change", () => {
  clearResults();
  resetSelect(district, "Pilih kecamatan");
  searchButton.disabled = true;

  if (regency.value) {
    loadOptions(district, `districts/${regency.value}`, "Pilih kecamatan");
  }
});

district.addEventListener("change", clearResults);

function searchPostalCodes() {
  clearResults();
  if (!form.reportValidity() || !district.value) return;

  searchButton.disabled = true;

  return requestData(`villages/${district.value}`, (villages) => {
    searchButton.disabled = false;

    if (!villages.length) {
      status.textContent = "Data kode pos tidak ditemukan.";
      return;
    }

    region.textContent = [
      province.selectedOptions[0].textContent,
      regency.selectedOptions[0].textContent,
      `Kecamatan ${district.selectedOptions[0].textContent}`,
    ].join(" / ");

    villages.forEach((village) => {
      const row = document.createElement("tr");
      const name = document.createElement("td");
      const postalCode = document.createElement("td");

      name.textContent = village.name;
      postalCode.textContent = village.postal_code || "Belum tersedia";
      row.append(name, postalCode);
      resultList.append(row);
    });

    results.hidden = false;
    status.textContent = `${villages.length} desa/kelurahan ditemukan.`;
  }, searchPostalCodes);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchPostalCodes();
});

loadOptions(province, "provinces", "Pilih provinsi");
