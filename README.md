# Ruang Stok — Sistem Informasi Persediaan

Aplikasi inventaris untuk latihan mahasiswa menggunakan **HTML, CSS, dan JavaScript**, tanpa backend dan tanpa database.

## Fitur
- Dashboard ringkasan stok dan estimasi nilai persediaan.
- Master data: tambah, edit, hapus, cari, dan filter barang.
- Transaksi barang masuk dan keluar.
- Validasi agar stok tidak negatif saat barang keluar.
- Riwayat transaksi dan penyesuaian stok.
- Laporan persediaan dan ekspor CSV.
- Grafik pergerakan barang tujuh hari terakhir.
- Penyimpanan data dengan \`localStorage\`.
- Tampilan responsif untuk desktop dan ponsel.

## Menjalankan aplikasi
1. Clone repository:
   \`\`\`bash
   git clone https://github.com/muhammadaidildzulfikarsaviola-ui/Web-si-persediaan.git
   cd Web-si-persediaan
   \`\`\`
2. Buka folder di VS Code.
3. Jalankan \`index.html\` menggunakan Live Server, atau buka langsung file tersebut di browser.
4. Data demo akan muncul otomatis.

Tidak perlu Node.js, PHP, MySQL, XAMPP, atau dependency tambahan.

## Struktur file
\`\`\`text
Web-si-persediaan/
├── index.html
├── style.css
├── script.js
└── README.md
\`\`\`

## Catatan
Ini adalah **prototipe pembelajaran**, bukan aplikasi produksi. Data tersimpan di \`localStorage\` browser dan perangkat yang digunakan. Data tidak tersinkron antarperangkat atau antar pengguna dan dapat hilang jika data browser dihapus. Gunakan tombol reset untuk memulihkan data demo.

Harga dan nilai persediaan adalah simulasi. Belum ada autentikasi, multi-user, audit log aman, atau database server.

## Ide materi pembelajaran
1. HTML: struktur halaman, form, tabel, navigasi.
2. CSS: layout, grid, tabel, dan desain responsif.
3. JavaScript: event listener, array/object, validasi, filter, dan perhitungan stok.
4. Penyimpanan browser: JSON dan \`localStorage\`.
5. Materi lanjutan: pindahkan penyimpanan ke PHP dan MySQL setelah mahasiswa belajar database.
