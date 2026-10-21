# Tugas 6 — Bootstrap

## Identitas

- **Nama:** Khalisya Zahra Putria Rahman
- **NRP:** 5025251045
- **Kelas:** Pemrograman Web B

## Konsep website

KelasKode adalah learning hub les programming dengan katalog jalur Frontend, Backend, dan Python. Identitas visual memakai warna biru tua, hijau limau, dan latar terang. Logo berupa wordmark **kelaskode.** dengan Space Grotesk, sedangkan teks memakai Plus Jakarta Sans. Font disimpan lokal agar tidak bergantung pada Google Fonts saat website dibuka.

Website dikembangkan sendiri. Referensi tugas digunakan untuk memahami cakupan halaman konten, login, registrasi, serta penerapan komponen Bootstrap. Tema, nama, tulisan, katalog, dan susunan halaman KelasKode dibuat untuk proyek ini.

## Halaman

| File            | Isi                                                                          |
| --------------- | ---------------------------------------------------------------------------- |
| `index.html`    | Beranda, katalog kelas, sidebar filter, cara belajar, FAQ, dan modal silabus |
| `login.html`    | Form email dan password, opsi tampilkan password, serta validasi             |
| `register.html` | Form nama, email, password, konfirmasi password, dan persetujuan             |
| `style.css`     | Font lokal, identitas visual, penyesuaian komponen, dan tampilan responsif   |
| `app.js`        | Filter katalog, isi modal kelas, validasi form, dan visibilitas password     |
| `assets/`       | Bootstrap 5.3.8, font, foto, dan lisensi pustaka/font                        |

## Cara menjalankan

Buka `index.html` langsung di browser atau melalui Live Server. Tidak diperlukan instalasi npm, proses build, maupun API. File Bootstrap, font, dan foto sudah disimpan lokal sehingga halaman dapat digunakan tanpa koneksi internet.

## Komponen Bootstrap

- **Container dan grid:** `container`, `row`, serta kolom responsif mengatur hero, sidebar katalog, daftar kelas, dan form.
- **Navbar dan collapse:** navigasi berubah menjadi menu yang dapat dibuka pada layar kecil.
- **List group:** pilihan filter Semua kelas, Frontend, Backend, dan Python.
- **Card dan button:** menampilkan katalog dan tautan tindakan.
- **Modal:** satu modal dipakai untuk menampilkan silabus sesuai kelas yang dipilih.
- **Accordion:** pertanyaan umum dibuka dan ditutup menggunakan Bootstrap Collapse.
- **Form control, form check, invalid feedback, dan alert:** tampilan input, persetujuan, kesalahan, serta hasil validasi.

Bootstrap dimuat sebelum CSS khusus. Bundle JavaScript Bootstrap dimuat sebelum `app.js`; keduanya menggunakan `defer`.

## Cara kerja JavaScript

### Filter katalog

Tombol filter memiliki atribut `data-filter`, sedangkan setiap kartu memiliki `data-category`. Event `click` membandingkan kategori yang dipilih dengan kategori kartu. Properti `hidden` menyembunyikan kartu yang tidak cocok. Tombol terpilih diberi class `active` serta `aria-pressed="true"`. Jumlah kelas yang terlihat diperbarui melalui area status.

Filter bekerja pada data lokal tanpa pemuatan ulang halaman. Empat kelas merupakan katalog contoh, bukan layanan kelas yang sudah tersedia.

### Validasi login dan registrasi

Form menggunakan `novalidate` agar pesan kesalahan dapat diatur JavaScript. Semua kontrol dengan atribut `required` dikumpulkan ke array dan diperiksa melalui fungsi `validate()`.

Aturannya:

1. Kolom wajib tidak boleh kosong atau hanya berisi spasi.
2. Email harus memenuhi pemeriksaan `type="email"` browser dan regex yang mewajibkan bagian domain bertitik, misalnya `nama@domain.com`.
3. Password minimal delapan karakter.
4. Konfirmasi password harus sama persis dengan password.
5. Persetujuan pada registrasi wajib dicentang.

`setCustomValidity()` menyimpan pesan validasi kontrol. Class `is-invalid`, atribut `aria-invalid`, dan elemen `invalid-feedback` diperbarui untuk memberikan penanda visual dan teks kesalahan.

Event `blur` memeriksa kolom yang ditinggalkan. Event `input` memeriksa ulang kolom yang sebelumnya salah dan membersihkan status berhasil. Jika password diubah setelah konfirmasi diisi, konfirmasi juga diperiksa ulang. Event `change` menangani perubahan nilai termasuk checkbox.

Saat submit, `preventDefault()` mencegah pengiriman data. `fields.map(validate).every(Boolean)` memeriksa seluruh kontrol. Fokus diarahkan ke kontrol pertama yang salah. Jika valid, komponen alert menjelaskan bahwa pemeriksaan berhasil dalam lingkup demo frontend.

### Tampilkan password

Checkbox mengubah tipe input antara `password` dan `text`. Pada registrasi, password dan konfirmasi diubah bersama. Setelah submit valid, kedua nilai password dikosongkan, tipenya dikembalikan ke `password`, dan checkbox tampilkan password dinonaktifkan kembali melalui penghapusan centangnya.

## Aksesibilitas dan responsivitas

Halaman menggunakan label form, skip link, penanda fokus, `aria-pressed` untuk filter, serta area status untuk feedback. Grid menumpuk ke satu kolom pada layar kecil. Pengaturan `prefers-reduced-motion` mengurangi transisi dan menonaktifkan smooth scrolling ketika diminta pengguna.

## Referensi dan kredit

- [Dokumentasi resmi Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/) — pemasangan, grid, dan komponen; Bootstrap 5.3.8 menggunakan lisensi MIT.
- [Space Grotesk](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) — font logo dan judul, SIL Open Font License.
- [Foto belajar bersama dari Unsplash](https://images.unsplash.com/photo-1516321318423-f06f85e504b3) — foto hero; file lokal `assets/learning.jpg`, sumber gambar `photo-1516321318423-f06f85e504b3`.

Salinan lisensi Bootstrap dan kedua font tersedia di folder `assets/`.

## Layout halaman utama

Header berada di atas seluruh halaman. Bagian tengah menggunakan grid Bootstrap dengan sidebar navigasi kiri (col-lg-2) dan konten kanan (col-lg-10). Sidebar menyediakan Beranda, Katalog kelas, Cara belajar, Pertanyaan umum, serta tautan akun. Footer berada di bawah kedua kolom. Pada layar kecil, sidebar tersusun di atas konten.