# Ruang Stok — Sistem Informasi Persediaan

Ruang Stok adalah contoh aplikasi persediaan sederhana untuk belajar **HTML, CSS, dan JavaScript**. Aplikasi ini belum memakai PHP, MySQL, atau database server. Data disimpan di browser yang sedang digunakan melalui `localStorage`.

## 1. Cara menjalankan

1. Unduh ZIP repository dari GitHub, lalu ekstrak.
2. Buka folder hasil ekstrak di Visual Studio Code.
3. Buka `index.html` di browser, atau jalankan dengan ekstensi **Live Server**.
4. Gunakan menu di sisi kiri untuk berpindah halaman.

Tidak perlu memasang Git, Node.js, PHP, MySQL, atau XAMPP hanya untuk menjalankan demo ini.

## 2. Struktur file

```text
Web-si-persediaan/
├── index.html       # Halaman Ringkasan / dashboard
├── barang.html      # Halaman Data Barang
├── transaksi.html   # Halaman Transaksi
├── laporan.html     # Halaman Laporan
├── style.css        # Tampilan bersama untuk semua halaman
├── script.js        # Logika, data demo, dan isi dinamis setiap halaman
└── README.md        # Panduan proyek ini
```

## 3. Mau mengubah apa? Cari di sini

| Kalau ingin mengubah... | Buka file | Bagian yang dicari |
| --- | --- | --- |
| Nama aplikasi yang muncul di tab browser | File HTML yang ingin diubah | Tag `<title>` |
| Menu di sidebar | Semua file HTML | `<nav class="nav-list">` |
| Tujuan link menu | Semua file HTML | Atribut `href="...html"` di menu |
| Warna, font, ukuran teks, jarak, tabel, tombol, dan tampilan HP | `style.css` | Bagian CSS dengan nama seperti `.sidebar`, `.button`, `.data-table`, atau `@media` |
| Data barang contoh saat pertama kali dibuka | `script.js` | Fungsi `seed()` |
| Data transaksi contoh saat pertama kali dibuka | `script.js` | Bagian `transactions` di dalam fungsi `seed()` |
| Angka ringkasan dashboard | `script.js` | Fungsi `dashboard()` |
| Daftar stok yang perlu perhatian di dashboard | `script.js` | Fungsi `dashboard()`, bagian `#attentionList` |
| Aktivitas terbaru di dashboard | `script.js` | Fungsi `activity()` dan pemanggilnya di `dashboard()` |
| Grafik pergerakan stok tujuh hari | `script.js` | Fungsi `chart()` |
| Kolom tabel, pencarian, dan filter Data Barang | `script.js` | Fungsi `productsPage()` |
| Form tambah atau edit barang | `script.js` | Fungsi `openModal()` dan `field()` |
| Kolom dan tampilan daftar Transaksi | `script.js` | Fungsi `transactionsPage()` |
| Validasi barang masuk dan keluar | `script.js` | Fungsi `submit()` |
| Apa yang terjadi saat transaksi dihapus | `script.js` | Fungsi `removeTx()` |
| Kartu ringkasan dan tabel Laporan | `script.js` | Fungsi `reportsPage()` |
| Format file CSV yang diunduh | `script.js` | Fungsi `csv()` |
| Format angka dan Rupiah | `script.js` | Fungsi `num()` dan `rupiah()` |
| Status stok “Aman”, “Menipis”, atau “Habis” | `script.js` | Fungsi `status()` dan `badge()` |
| Penyimpanan data di browser | `script.js` | Fungsi `save()` dan variabel `KEY` |
| Tombol reset data demo | `script.js` | Fungsi `reset()` |
| Aksi klik tombol dan menu | `script.js` | Bagian `document.addEventListener("click", ...)` |

## 4. Apa fungsi setiap file HTML?

### `index.html` — Ringkasan

Halaman awal aplikasi. Berisi kerangka umum aplikasi, sidebar, bar atas, area konten, form modal, dan pemanggilan `script.js`.

### `barang.html` — Data Barang

Halaman untuk melihat, mencari, memfilter, menambah, mengedit, dan menghapus barang. Halaman ini memakai tampilan bersama dari `style.css` dan logika dari fungsi `productsPage()` di `script.js`.

### `transaksi.html` — Transaksi

Halaman untuk mencatat barang masuk dan barang keluar, melihat riwayat, dan menghapus transaksi. Tampilan daftar dibuat oleh fungsi `transactionsPage()` di `script.js`.

### `laporan.html` — Laporan

Halaman ringkasan nilai persediaan dan jumlah barang masuk/keluar, termasuk ekspor CSV. Isi halaman dibuat oleh fungsi `reportsPage()` di `script.js`.

**Penting:** file HTML dipisah agar setiap menu punya alamat dan kerangka halaman sendiri. Sebagian besar tabel dan kartu di dalam area konten dibuat oleh JavaScript supaya angka berubah mengikuti data. Karena itu, kalau ingin mengubah susunan tabel atau isi kartu, cari fungsi JavaScript yang disebutkan di tabel panduan, bukan hanya mengedit file HTML.

## 5. Cara mengubah tampilan

Semua halaman menggunakan file `style.css` yang sama.

- Cari `.sidebar` untuk mengubah sidebar.
- Cari `.topbar` untuk mengubah bar bagian atas.
- Cari `.page-heading` untuk mengubah jarak dan tata letak judul halaman.
- Cari `.button`, `.button-dark`, atau `.button-light` untuk mengubah tombol.
- Cari `.data-table` untuk mengubah tampilan tabel.
- Cari `@media(max-width:700px)` untuk aturan tampilan layar ponsel.

Titik (`.`) di depan nama seperti `.sidebar` adalah penanda class CSS. Class tersebut biasanya juga ditemukan pada atribut `class="sidebar"` di HTML atau teks HTML yang dibuat JavaScript.

## 6. Cara mengubah data contoh

Buka `script.js`, lalu cari `function seed()`. Di sana ada daftar barang contoh dan transaksi contoh. Setiap barang mempunyai data seperti:

- `id`: kode barang, misalnya `BRG-001`
- `name`: nama barang
- `category`: kategori barang
- `unit`: satuan barang
- `stock`: jumlah stok awal
- `minStock`: batas minimum stok
- `cost`: harga per unit
- `location`: lokasi penyimpanan

Gunakan format yang sama saat menambahkan contoh baru. Pastikan koma dan tanda kurung tidak terhapus.

## 7. Cara kerja penyimpanan

Data disimpan pada browser dengan nama kunci `ruang-stok-v1` melalui `localStorage`. Perubahan disimpan oleh fungsi `save()`.

- Data tetap ada ketika halaman ditutup dan dibuka lagi di browser yang sama.
- Data tidak otomatis tersinkron ke komputer lain atau pengguna lain.
- Menghapus data situs/browser dapat menghapus data aplikasi.
- Tombol **Reset data demo** mengembalikan data awal dan menghapus perubahan lokal.

Jika mengubah data contoh di `seed()`, browser yang sudah pernah menyimpan data lama mungkin tetap menampilkan data lama. Untuk melihat data contoh terbaru, gunakan tombol reset data demo. Perhatian: tindakan ini menghapus perubahan data lokal.

## 8. Fitur yang tersedia

- Ringkasan jenis barang, jumlah stok, stok menipis, dan estimasi nilai persediaan.
- Tambah, edit, hapus, cari, dan filter barang.
- Pencatatan barang masuk dan barang keluar.
- Validasi agar jumlah barang keluar tidak melebihi stok tersedia.
- Riwayat transaksi.
- Laporan persediaan dan ekspor CSV.
- Grafik pergerakan barang selama tujuh hari terakhir.
- Penyimpanan data menggunakan `localStorage`.
- Tampilan responsif untuk desktop dan ponsel.

## 9. Batasan demo

Ini adalah prototipe untuk belajar, bukan aplikasi produksi. Belum ada akun pengguna, hak akses, database server, pencadangan otomatis, atau sinkronisasi antarperangkat. Harga dan nilai persediaan merupakan simulasi berdasarkan harga per unit yang dimasukkan.

## 10. Urutan belajar yang disarankan

1. **HTML:** pahami struktur halaman, link menu, form, dan elemen tabel.
2. **CSS:** ubah warna, ukuran, jarak, dan tampilan responsif.
3. **JavaScript:** pelajari fungsi, array, objek, event klik, pencarian, dan validasi.
4. **Penyimpanan browser:** pelajari `localStorage` dan JSON.
5. **Materi lanjutan:** setelah memahami database, barulah penyimpanan dapat dikembangkan menjadi PHP dan MySQL.
