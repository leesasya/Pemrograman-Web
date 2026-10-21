# ETS - LibraryReg

**Nama: Khalisya Zahra Putria Rahman**

**NRP: 5025251045**

**Kelas: Pemrograman Web B**

## 1. Deskripsi dan ruang lingkup

LibraryReg adalah aplikasi pendaftaran anggota perpustakaan kampus. Pengunjung bisa melihat layanan dan mendaftar secara online. Petugas dapat mencari, melihat, mengedit, dan menghapus data anggota.

Pekerjaan yang dibuat:
- Landing page: informasi perpustakaan, layanan, fasilitas, statistik ilustratif, kontak, dan jam buka.
- Navigasi Bootstrap yang menyesuaikan layar dan menandai bagian aktif.
- Formulir: nama, NIM/NIP, program studi, alamat, telepon, email, dan jenis keanggotaan.
- Validasi kolom wajib, format email, nomor telepon, serta NIM/NIP yang tidak boleh sama.
- Daftar anggota dengan pencarian, detail, edit, hapus dengan konfirmasi, dan notifikasi.
- Penyimpanan sementara menggunakan localStorage.
- Login petugas berupa simulasi antarmuka.

## 2. Rancangan halaman dan struktur menu

Semua bagian berada dalam satu halaman agar pengunjung mudah berpindah melalui navbar.

| Menu | Tujuan | Isi |
| --- | --- | --- |
| Beranda | `#beranda` | Judul, foto perpustakaan, tombol daftar, statistik ilustratif |
| Tentang | `#tentang` | Profil singkat dan fasilitas |
| Layanan | `#layanan` | Peminjaman buku, referensi digital, ruang belajar |
| Daftar Anggota | `#anggota` | Pencarian, tabel, tombol detail, edit, dan hapus |
| Pendaftaran | `#pendaftaran` | Petunjuk singkat dan formulir anggota |
| Login Petugas | Dialog login | Username, kata sandi, dan tombol masuk |

Urutan halaman: header → hero → statistik → tentang → layanan → pendaftaran → daftar anggota → footer.

Alur pendaftaran: isi formulir → validasi → simpan ke localStorage → tampilkan anggota pada tabel. Edit memakai formulir yang sama. Hapus membutuhkan konfirmasi.

## 3. Desain UI landing page

- Warna: hijau tua dengan latar krem dan putih. 
- Font: Georgia (Judul), Arial (Teks dan Formulir). 
- Hero dibagi menjadi judul di kiri dan foto di kanan. 
- Di layar kecil, konten disusun ke bawah dan navigasi menjadi tombol menu.
- Tombol utama mengarah ke pendaftaran. 
- Layanan ditampilkan dalam satu panel utama dan dua bagian pendukung. 
- Formulir memakai dua kolom pada desktop dan satu kolom pada ponsel. 
- Tabel dapat digeser secara horizontal di layar kecil.