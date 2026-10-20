# Tugas 5 — Javascript Exercise

**Nama: Khalisya Zahra Putria Rahman**

**NRP: 5025251045**

**Kelas: Pemrograman Web B**

## Gambaran umum

Tugas ini terdiri dari empat latihan: form registrasi dengan rekomendasi nama, pencarian kode pos Indonesia, form dengan validasi email, dan dropdown dinamis. Seluruh halaman dibuat menggunakan HTML, CSS, dan JavaScript murni tanpa framework maupun proses build.

HTML menyusun elemen halaman, CSS mengatur tampilannya, sedangkan JavaScript menangani validasi, perubahan pilihan, pengambilan data, dan pembaruan hasil pada halaman. Homepage menggunakan HTML dan CSS untuk menampilkan identitas serta navigasi ke empat latihan.

## Struktur folder

```text
Tugas-5/
├── index.html
├── style.css
├── README.md
├── Latihan1/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Latihan2/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Latihan3/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── Latihan4/
    ├── index.html
    ├── style.css
    └── script.js
```

## Link Deployment

https://webjs-pweb.vercel.app/

## Latihan 1 — Form registrasi dan rekomendasi nama

### Soal dan tujuan

Membuat form registrasi yang terdiri dari nama mahasiswa, NIM, mata kuliah, dan dosen. Ketika pengguna mengetik huruf tertentu pada nama, muncul rekomendasi nama yang sesuai.

Halaman: [`Latihan 1`](./Latihan1).

### Implementasi HTML dan CSS

Form berisi input nama, input NIM, dropdown mata kuliah, input dosen, dan tombol **Submit**. Setiap kolom memiliki label dan elemen pesan kesalahan. CSS mengatur jarak antarkolom, ukuran input, fokus keyboard, serta warna batas input yang tidak valid.

Rekomendasi nama menggunakan fitur HTML berikut:

```html
<input id="nama" name="nama" type="text" list="daftar-nama">
<datalist id="daftar-nama">
  <option value="Aditya Pratama"></option>
  <option value="Ahmad Fauzan"></option>
</datalist>
```

Atribut `list` menghubungkan input dengan `id` milik `datalist`. Browser menampilkan saran berdasarkan teks yang diketik. Daftar nama lengkap tersimpan di HTML sebagai data contoh. Pengguna tetap dapat mengetik nama lain yang tidak ada dalam daftar. Bentuk dan perilaku tampilan rekomendasi mengikuti browser yang digunakan.

**Rekomendasi nama ditangani oleh HTML dan browser, sedangkan JavaScript menangani validasi form.**

### Penjelasan JavaScript

#### 1. Mengambil elemen form

```javascript
const form = document.querySelector("#registration-form");
const fields = [...form.querySelectorAll("input, select")];
```

`querySelector()` mengambil form berdasarkan ID. `querySelectorAll()` mengambil semua input dan dropdown di dalamnya. Spread operator `...` mengubah kumpulan elemen tersebut menjadi array agar dapat diproses menggunakan `map()`, `forEach()`, dan `find()`.

#### 2. Memvalidasi setiap kolom

Fungsi `validateField(field)` membaca nilai kolom dengan `field.value.trim()`. `trim()` menghapus spasi di awal dan akhir sehingga isian yang hanya berisi spasi dianggap kosong. Fungsi juga mengambil teks label sesuai ID kolom untuk menyusun pesan kesalahan.

Aturan validasinya:

- Semua kolom wajib memiliki nilai.
- NIM hanya boleh berisi angka.
- Pilihan awal mata kuliah memiliki nilai kosong sehingga tidak dianggap sebagai pilihan yang valid.

NIM diperiksa menggunakan regular expression:

```javascript
/^[0-9]+$/.test(value)
```

| Bagian | Arti |
| --- | --- |
| `^` | Awal teks |
| `[0-9]` | Karakter angka dari 0 sampai 9 |
| `+` | Satu atau lebih karakter |
| `$` | Akhir teks |

Seluruh nilai harus berupa angka. Karena input NIM bertipe teks, angka nol di awal tetap dapat dipertahankan. Pemeriksaan ini tidak menentukan panjang NIM tertentu.

Fungsi mengisi pesan pada elemen seperti `nim-error` menggunakan `textContent`, lalu mengatur `aria-invalid` menjadi `"true"` atau `"false"`. CSS menggunakan atribut tersebut untuk menandai kolom bermasalah. Nilai kembalian `!message` adalah `true` jika tidak ada pesan kesalahan.

#### 3. Menangani interaksi pengguna

| Event | Perilaku |
| --- | --- |
| `blur` | Memvalidasi ketika pengguna meninggalkan kolom |
| `input` | Memeriksa ulang saat mengetik jika kolom sebelumnya sudah ditandai salah |
| `change` | Memvalidasi ketika nilai atau pilihan berubah |
| `submit` | Memeriksa seluruh kolom sebelum menampilkan notifikasi |

#### 4. Memproses Submit

```javascript
event.preventDefault();
const valid = fields.map(validateField).every(Boolean);
```

`preventDefault()` mencegah pengiriman form dan perpindahan halaman. `map(validateField)` menjalankan validasi pada **semua kolom**, kemudian `every(Boolean)` memeriksa apakah seluruh hasilnya `true`. Dengan urutan ini, semua pesan kesalahan dapat muncul sekaligus.

Jika ada kesalahan, `find()` mencari kolom pertama dengan `aria-invalid="true"`, lalu `focus()` mengarahkan kursor ke kolom tersebut. Jika semuanya benar, muncul `alert("Registrasi berhasil.")`.

Form memakai `novalidate` agar validasi otomatis saat submit digantikan oleh pesan yang diatur JavaScript. Notifikasi berhasil hanya menunjukkan bahwa data lolos pemeriksaan di browser.

### Contoh penggunaan

1. Ketik `Ad` pada nama, lalu pilih rekomendasi yang muncul.
2. Isi NIM dengan angka, pilih mata kuliah, dan isi dosen.
3. Klik **Submit** untuk menjalankan validasi.
4. Coba NIM `5025ABC` atau kosongkan kolom untuk melihat pesan kesalahan.

## Latihan 2 — Pencarian kode pos Indonesia

### Soal dan tujuan

Membuat pencarian kode pos dengan input provinsi, kabupaten/kota, dan kecamatan. Output berupa kode pos beserta informasi daerah.

Halaman: [`Latihan 2`](./Latihan2).

### Implementasi HTML dan CSS

Halaman memiliki tiga dropdown bertingkat, tombol **Cari**, tombol **Coba lagi** yang muncul saat permintaan gagal, area status, dan tabel hasil. Dropdown turunan dinonaktifkan selama datanya belum tersedia. Tabel menampilkan desa/kelurahan dan kode pos, sedangkan informasi provinsi, kabupaten/kota, dan kecamatan ditampilkan di atasnya.

CSS membedakan kontrol aktif dan nonaktif, memberi tampilan fokus, serta menyediakan pembungkus tabel dengan `overflow-x: auto` agar tabel dapat digeser secara horizontal jika diperlukan pada layar sempit.

### Referensi API GitHub

Latihan ini menggunakan **[API Data Wilayah Indonesia oleh emsifa](https://github.com/emsifa/api-wilayah-indonesia)**. Format endpoint dan pembacaan respons mengikuti API versi 2 yang digunakan dalam kode.

```javascript
const API_URL = "https://www.emsifa.com/api-wilayah-indonesia/v2";
```

| Endpoint relatif terhadap base URL | Data yang dipakai |
| --- | --- |
| `/provinces.json` | Daftar provinsi |
| `/regencies/{province_code}.json` | Kabupaten/kota pada provinsi terpilih |
| `/districts/{regency_code}.json` | Kecamatan pada kabupaten/kota terpilih |
| `/villages/{district_code}.json` | Desa/kelurahan dan kode pos pada kecamatan terpilih |

Kode membaca array pada properti `data` dari respons JSON. Properti `id` digunakan sebagai nilai dropdown, `name` sebagai teks pilihan, dan `postal_code` sebagai kode pos pada tabel. Data wilayah dan kode pos berasal dari API, bukan dari daftar buatan di JavaScript.

### Penjelasan JavaScript

#### 1. Menyiapkan elemen dan status permintaan

JavaScript mengambil form, ketiga dropdown, tombol, area status, dan tabel menggunakan `document.querySelector()`. Variabel `activeRequest` menyimpan `AbortController` untuk permintaan yang sedang berjalan.

#### 2. Mengosongkan dropdown dan hasil

`resetSelect(select, placeholder)` menjalankan:

```javascript
select.replaceChildren(new Option(placeholder, ""));
select.disabled = true;
```

`replaceChildren()` membuang pilihan lama dan menggantinya dengan placeholder bernilai kosong. Dropdown kemudian dinonaktifkan agar pengguna tidak memilih data yang sudah tidak sesuai dengan wilayah induknya.

`clearResults()` membatalkan permintaan aktif, menghapus baris tabel, menyembunyikan hasil dan tombol coba lagi, serta membersihkan status. Tombol Cari diaktifkan hanya jika kecamatan memiliki nilai.

#### 3. Mengambil data dengan `requestData()`

```javascript
async function requestData(path, onSuccess, retry)
```

Fungsi ini menerima tiga parameter:

| Parameter | Peran |
| --- | --- |
| `path` | Jalur endpoint tanpa base URL dan tanpa `.json` |
| `onSuccess` | Fungsi yang dijalankan setelah data berhasil dibaca |
| `retry` | Fungsi yang dipasang pada tombol Coba lagi jika terjadi kegagalan |

Fungsi menggunakan `async` dan `await` untuk menunggu respons tanpa memblokir seluruh interaksi browser. Bagian utamanya adalah:

```javascript
const response = await fetch(`${API_URL}/${path}.json`, {
  signal: controller.signal,
});

if (!response.ok) throw new Error("Permintaan API gagal.");

const payload = await response.json();
```

`fetch()` melakukan permintaan HTTP. `response.ok` memeriksa keberhasilan status HTTP karena respons seperti 404 tidak otomatis membuat `fetch()` masuk ke `catch`. Selanjutnya `response.json()` mengubah isi respons menjadi objek JavaScript. `Array.isArray(payload.data)` memastikan data yang akan diproses berupa array.

Penanganannya dibagi menjadi:

- `try`: mengambil data, memeriksa format, dan menjalankan `onSuccess()`.
- `catch`: menampilkan pesan gagal dan menghubungkan tombol Coba lagi ke fungsi `retry`.
- `finally`: membersihkan timer dan status permintaan aktif yang sesuai.

#### 4. Mengatur pembatalan dan batas waktu

Setiap permintaan memakai `AbortController`. Controller sebelumnya dibatalkan ketika permintaan baru dimulai atau pilihan wilayah berubah. `signal` menghubungkan pembatalan tersebut ke `fetch()`.

```javascript
const timeout = setTimeout(() => controller.abort(), 15000);
```

Timer membatalkan permintaan setelah 15.000 milidetik atau 15 detik. Ini adalah **batas tunggu maksimum yang ditetapkan kode**, bukan jeda yang wajib ditunggu setiap permintaan. Timer dibersihkan dengan `clearTimeout()` setelah proses selesai.

Pemeriksaan berikut memastikan respons permintaan lama tidak digunakan:

```javascript
if (activeRequest !== controller) return;
```

Contohnya, jika pengguna mengganti provinsi ketika daftar kabupaten masih dimuat, respons dari provinsi sebelumnya diabaikan sehingga tidak menimpa pilihan terbaru.

#### 5. Mengisi dropdown dengan `loadOptions()`

Fungsi `loadOptions(select, path, placeholder)` menampilkan placeholder pemuatan, meminta data melalui `requestData()`, lalu menambahkan pilihan:

```javascript
items.forEach((item) => {
  select.add(new Option(item.name, item.id));
});
```

`item.name` menjadi teks yang terlihat, sedangkan `item.id` menjadi nilai yang digunakan untuk permintaan berikutnya. Dropdown diaktifkan jika array berisi data. Jika kosong, ditampilkan status bahwa data wilayah tidak tersedia.

#### 6. Menghubungkan dropdown bertingkat

1. Saat halaman dibuka, `loadOptions()` mengambil daftar provinsi.
2. Saat provinsi berubah, kabupaten/kota dan kecamatan direset, lalu daftar kabupaten/kota dimuat berdasarkan ID provinsi.
3. Saat kabupaten/kota berubah, kecamatan direset, lalu daftar kecamatan dimuat berdasarkan ID kabupaten/kota.
4. Saat kecamatan berubah, hasil pencarian lama dibersihkan dan tombol Cari disesuaikan.

Reset diperlukan agar kecamatan dari kabupaten sebelumnya tidak tetap terpilih setelah wilayah induknya berubah.

#### 7. Mencari dan menampilkan kode pos

Saat form disubmit, `preventDefault()` mencegah perpindahan halaman dan `searchPostalCodes()` dijalankan. Fungsi memanggil `form.reportValidity()` untuk memeriksa aturan HTML seperti `required`, serta memeriksa bahwa kecamatan sudah dipilih.

Permintaan dilakukan ke `villages/{districtId}.json`. Hasil dapat berisi beberapa desa/kelurahan karena satu kecamatan tidak selalu memiliki satu kode pos saja.

Setiap desa/kelurahan ditampilkan sebagai baris tabel dengan `document.createElement()`. Nama dan kode pos diisi melalui `textContent`, lalu digabungkan dengan `append()`. Penggunaan `textContent` membuat nilai API ditampilkan sebagai teks, bukan diproses sebagai markup HTML.

```javascript
postalCode.textContent = village.postal_code || "Belum tersedia";
```

Jika kode pos tidak memiliki nilai, tabel menampilkan **Belum tersedia**. Jika array desa/kelurahan kosong, halaman menampilkan **Data kode pos tidak ditemukan**. Informasi wilayah dibentuk dari `selectedOptions[0].textContent` pada ketiga dropdown dan digabungkan menggunakan `join(" / ")`.

### Contoh penggunaan dan keterbatasan

1. Pilih provinsi dan tunggu daftar kabupaten/kota tersedia.
2. Pilih kabupaten/kota, lalu pilih kecamatan.
3. Klik **Cari** untuk menampilkan desa/kelurahan beserta kode posnya.
4. Jika gagal memuat, periksa koneksi lalu klik **Coba lagi**.

Kecepatan pemuatan bergantung pada jaringan dan respons API. Kode belum memiliki cache aplikasi; browser tetap dapat menerapkan cache HTTP sesuai respons layanan. Kelengkapan hasil mengikuti data sumber API.

## Latihan 3 — Registration Form dengan validasi email

### Soal dan tujuan

Membuat form registrasi dengan validasi email yang mengharuskan pola seperti `example@domain.com`.

Halaman: [`Latihan 3`](./Latihan3).

### Implementasi HTML dan CSS

Form berisi **Name**, **Address**, **E-mail Address**, **Password**, **Select Your Course**, **College Name**, kotak persetujuan, serta tombol **Send** dan **Reset**. Semua kolom wajib diisi dan persetujuan wajib dicentang.

Input email memakai `type="email"`, password memakai `type="password"`, dan nama perguruan tinggi memakai `textarea`. CSS menyusun form dalam satu kolom serta memberi penanda fokus dan kesalahan.

### Penjelasan JavaScript

#### 1. Mengambil semua kontrol

```javascript
const fields = [...form.querySelectorAll("input, select, textarea")];
```

Array ini mencakup input teks, email, password, checkbox, dropdown, dan textarea sehingga semuanya dapat divalidasi dalam satu alur.

#### 2. Menentukan pola email

```javascript
const emailPattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
```

| Bagian | Arti |
| --- | --- |
| `^` dan `$` | Pemeriksaan berlaku untuk seluruh teks |
| `[^\s@]+` | Bagian sebelum `@` berisi satu atau lebih karakter selain spasi dan `@` |
| `@` | Pemisah nama pengguna dan domain |
| `[^\s@.]+` | Bagian awal domain tidak boleh kosong, mengandung spasi, `@`, atau titik |
| `(?:\.[^\s@.]+)+` | Memerlukan setidaknya satu titik yang diikuti bagian domain tidak kosong |

Pola ini mewajibkan domain memiliki bagian setelah titik. Akhiran tidak dibatasi hanya `.com`, sehingga format seperti `nama@kampus.ac.id` juga dapat diterima.

#### 3. Memeriksa kolom sesuai jenisnya

`validateField(field)` membedakan tiga pemeriksaan:

1. Untuk checkbox, `field.checked` harus `true`.
2. Untuk kontrol lainnya, nilai yang sudah di-`trim()` tidak boleh kosong.
3. Khusus email, pemeriksaan tipe email bawaan browser digabungkan dengan regular expression.

```javascript
if (field.validity.typeMismatch || !emailPattern.test(field.value.trim())) {
  message = "Please enter a valid email, such as example@domain.com.";
}
```

Operator `||` berarti pesan muncul jika salah satu pemeriksaan gagal. `typeMismatch` memeriksa kesesuaian nilai dengan tipe email browser, sedangkan regex menambahkan syarat domain bertitik.

| Contoh email | Hasil yang diharapkan |
| --- | --- |
| `example@domain.com` | Valid |
| `nama@kampus.ac.id` | Valid |
| `nama@domain` | Tidak valid: domain tidak memiliki titik |
| `namadomain.com` | Tidak valid: tidak memiliki `@` |
| `nama@@domain.com` | Tidak valid: memiliki lebih dari satu `@` |
| `nama@domain..com` | Tidak valid: bagian domain di antara titik kosong |
| `nama depan@domain.com` | Tidak valid: mengandung spasi |

Pemeriksaan ini memvalidasi format untuk kebutuhan latihan, bukan memastikan alamat email benar-benar terdaftar atau dapat menerima pesan. Password hanya diperiksa agar tidak kosong; tidak ada aturan panjang minimum atau kompleksitas tambahan pada implementasi ini.

#### 4. Menampilkan kesalahan dan memproses Send

Seperti Latihan 1, event `blur`, `input`, dan `change` menjalankan validasi saat pengguna berinteraksi. Kesalahan ditampilkan pada elemen dengan ID sesuai pola `${field.id}-error`, dan `aria-invalid` diperbarui.

Saat tombol **Send** ditekan, seluruh kontrol diperiksa menggunakan `fields.map(validateField).every(Boolean)`. Jika ada kesalahan, fokus dipindahkan ke kontrol pertama yang salah. Jika seluruhnya valid, status menampilkan **Registration validated successfully.** tanpa mengirim data ke server.

Form memiliki `novalidate` untuk menggunakan alur pesan JavaScript. Meskipun validasi otomatis saat submit dinonaktifkan, properti `validity.typeMismatch` tetap dibaca oleh kode untuk pemeriksaan email.

#### 5. Memproses Reset

Tombol `type="reset"` mengembalikan nilai kontrol ke nilai awal melalui perilaku bawaan browser. Listener `reset` melengkapinya dengan menghapus atribut `aria-invalid`, pesan kesalahan, dan status berhasil. Dengan demikian, tampilan validasi juga kembali bersih.

## Latihan 4 — List dropdown dinamis

### Soal dan tujuan

Membuat list dropdown yang isi pilihannya berubah secara dinamis berdasarkan pilihan sebelumnya. Implementasi menggunakan hubungan **Fakultas → Program Studi → Mata Kuliah**.

Halaman: [`Latihan 4`](./Latihan4).

### Implementasi HTML dan CSS

Terdapat tiga elemen `select` dan area hasil. Pada awal halaman, hanya fakultas yang dapat dipilih. Program studi dan mata kuliah dinonaktifkan sampai pilihan induknya tersedia. CSS memberi tampilan berbeda untuk dropdown nonaktif dan mengatur form agar tetap nyaman digunakan pada layar kecil.

### Penjelasan JavaScript

#### 1. Menyimpan data dalam objek bertingkat

Data berada pada objek `dataFakultas` di dalam `script.js`. Bentuk sederhananya:

```javascript
const dataFakultas = {
  "Teknik": {
    "Teknik Komputer": ["Pemrograman Web", "Jaringan Komputer", "Sistem Digital"],
  },
};
```

Tingkat pertama adalah nama fakultas, tingkat kedua adalah nama program studi, sedangkan array di dalamnya berisi mata kuliah. Seluruh data merupakan contoh untuk demonstrasi dropdown, bukan daftar resmi institusi tertentu. Latihan ini tidak membutuhkan API.

#### 2. Mengisi ulang pilihan

Fungsi `isiDropdown(dropdown, placeholder, pilihan = [])` dipakai untuk ketiga dropdown.

```javascript
dropdown.replaceChildren(new Option(placeholder, ""));

pilihan.forEach((nama) => {
  dropdown.add(new Option(nama, nama));
});

dropdown.disabled = pilihan.length === 0;
```

Parameter `pilihan = []` menyediakan array kosong sebagai nilai bawaan. Pilihan lama dibuang agar tidak menumpuk ketika fakultas atau program studi diganti. Setiap `new Option(nama, nama)` memakai nama yang sama untuk teks tampilan dan nilai pilihan. Dropdown dinonaktifkan jika tidak ada pilihan selain placeholder.

#### 3. Mengisi fakultas ketika halaman dibuka

```javascript
isiDropdown(fakultas, "Pilih fakultas", Object.keys(dataFakultas));
```

`Object.keys()` mengambil nama-nama properti pada objek menjadi array. Pada tingkat pertama, hasilnya berupa daftar nama fakultas yang kemudian dimasukkan ke dropdown.

#### 4. Memperbarui program studi

Ketika event `change` terjadi pada fakultas, kode mengambil objek program studi sesuai nilai fakultas:

```javascript
const daftarProgram = dataFakultas[fakultas.value];
```

`Object.keys(daftarProgram || {})` menghasilkan nama program studi. Jika fakultas belum dipilih, `|| {}` menyediakan objek kosong agar `Object.keys()` tetap dapat dijalankan. Dropdown program studi diisi ulang, dropdown mata kuliah direset, dan hasil lama dihapus.

#### 5. Memperbarui mata kuliah

```javascript
const daftarMataKuliah = dataFakultas[fakultas.value]?.[programStudi.value] || [];
```

Optional chaining `?.` mencegah akses lanjutan pada nilai fakultas yang tidak tersedia. Jika program studi tidak ditemukan atau belum dipilih, `|| []` menyediakan array kosong. Array hasil dipakai untuk mengisi dropdown mata kuliah.

#### 6. Menampilkan hasil pilihan

Event `change` pada mata kuliah memperbarui hasil menggunakan operator ternary:

```javascript
hasil.textContent = mataKuliah.value
  ? `${fakultas.value} / ${programStudi.value} / ${mataKuliah.value}`
  : "";
```

Jika mata kuliah sudah dipilih, hasil menampilkan ketiga pilihan dengan pemisah `/`. Jika pengguna kembali ke placeholder, hasil dikosongkan. Template literal menyisipkan nilai pilihan ke teks, sedangkan `textContent` memperbarui isi elemen hasil.

### Contoh penggunaan

1. Pilih **Teknik** pada fakultas.
2. Pilih **Teknik Komputer** pada program studi.
3. Pilih **Pemrograman Web** pada mata kuliah.
4. Hasil menampilkan `Teknik / Teknik Komputer / Pemrograman Web`.
5. Ganti fakultas: program studi, mata kuliah, dan hasil sebelumnya akan direset.

## Konsep JavaScript yang digunakan

| Konsep | Penerapan |
| --- | --- |
| Seleksi dan manipulasi DOM | Mengambil kontrol, mengubah pesan, dan membuat pilihan atau baris tabel |
| Event listener | Merespons `input`, `blur`, `change`, `submit`, dan `reset` sesuai kebutuhan latihan |
| Array dan objek | Mengelola kontrol form, respons API, serta data dropdown lokal |
| Regular expression | Memeriksa angka NIM dan pola email |
| `preventDefault()` | Mencegah form berpindah halaman saat divalidasi atau digunakan untuk pencarian |
| `async`, `await`, dan `fetch()` | Mengambil data wilayah secara asinkron pada Latihan 2 |
| `AbortController` dan timer | Membatalkan permintaan lama dan membatasi waktu tunggu API |
| Callback | Memisahkan proses pengambilan data dari pengisian dropdown atau tabel |
| Optional chaining dan nilai cadangan | Mengakses data yang belum tersedia tanpa gagal pada akses tersebut |

Semua `script.js` memakai `"use strict"` untuk mengaktifkan aturan JavaScript yang lebih ketat. Skrip dimuat melalui atribut `defer` pada HTML agar dijalankan setelah dokumen selesai diparsing dan elemen form sudah tersedia. Pesan dinamis memakai `aria-live` atau `role="status"` untuk membantu teknologi pembaca layar mengetahui perubahan informasi.
