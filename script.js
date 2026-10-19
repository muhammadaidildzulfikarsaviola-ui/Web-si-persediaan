(() => {
  "use strict";
  const KEY = "ruang-stok-v1", $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
  const dateStr = d => [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
  const today = dateStr(new Date()), ago = n => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return dateStr(d);
  };
  const seed = () => ({
    products: [
      {
        id: "BRG-001",
        name: "Baut M10",
        category: "Fastener",
        unit: "pcs",
        stock: 125,
        minStock: 80,
        cost: 1200,
        location: "Rak A-01"
      },
      {
        id: "BRG-002",
        name: "Plat Besi 2 mm",
        category: "Material",
        unit: "lembar",
        stock: 18,
        minStock: 25,
        cost: 85000,
        location: "Rak B-02"
      },
      {
        id: "BRG-003",
        name: "Cat Antikarat",
        category: "Finishing",
        unit: "kaleng",
        stock: 9,
        minStock: 12,
        cost: 62000,
        location: "Rak C-01"
      },
      {
        id: "BRG-004",
        name: "Bearing 6202",
        category: "Sparepart",
        unit: "pcs",
        stock: 46,
        minStock: 20,
        cost: 27500,
        location: "Rak A-03"
      },
      {
        id: "BRG-005",
        name: "Sarung Tangan",
        category: "Safety",
        unit: "pasang",
        stock: 7,
        minStock: 15,
        cost: 18000,
        location: "Rak D-01"
      },
      {
        id: "BRG-006",
        name: "Kabel NYA 2.5 mm",
        category: "Electrical",
        unit: "meter",
        stock: 230,
        minStock: 50,
        cost: 4500,
        location: "Rak E-02"
      }
    ],
    transactions: [
      {
        id: "TRX-1005",
        productId: "BRG-001",
        type: "in",
        qty: 40,
        date: today,
        note: "Penerimaan pemasok"
      },
      {
        id: "TRX-1004",
        productId: "BRG-003",
        type: "out",
        qty: 4,
        date: today,
        note: "Kebutuhan produksi"
      },
      {
        id: "TRX-1003",
        productId: "BRG-004",
        type: "in",
        qty: 12,
        date: ago(1),
        note: "Stok tambahan"
      },
      {
        id: "TRX-1002",
        productId: "BRG-002",
        type: "out",
        qty: 8,
        date: ago(2),
        note: "Kebutuhan produksi"
      },
      {
        id: "TRX-1001",
        productId: "BRG-005",
        type: "out",
        qty: 3,
        date: ago(4),
        note: "Perlengkapan operator"
      }
    ]
  }
});
let state;
try {
  state = JSON.parse(localStorage.getItem(KEY) || "null");
  if(! state || ! Array.isArray(state.products) || ! Array.isArray(state.transactions)) state = seed();
} catch(e) {
  state = seed();
} let page = "dashboard", search = "", category = "all", txType = "all", mode = "", editId = null, hideWelcome = false;
const esc = v => String(v == null? "": v).replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[
  c
]));
const num = n => new Intl.NumberFormat("id-ID").format(Number(n) || 0);
const rupiah = n => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
}).format(Number(n) || 0);
const product = id => state.products.find(p => p.id === id), name = id => product(id)?.name || "Barang dihapus";
const status = p => p.stock<= 0? "Habis": p.stock<= p.minStock? "Menipis": "Aman";
const badge = p => '<span class="status-pill ' + (status(p) === "Aman"? "ok": "") + '">' + status(p) + "</span>";
const swatch = (p, i) => '<span class="product-swatch ' + ([
  "",
  "orange",
  "purple"
][
  i% 3
]) + '">' + esc(p.name.charAt(0).toUpperCase()) + "</span>";
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch(e) {
    notify("Penyimpanan browser tidak tersedia.", "error");
  }
} function notify(msg, type) {
  const el = document.createElement("div");
  el.className = "toast" + (type? " " + type: "");
  el.textContent = msg;
  $("#toastRegion").append(el);
  setTimeout(() => el.remove(), 3000);
} function footer() {
  return '<footer class="page-footer"><span>RUANG STOK · PROTOTIPE PEMBELAJARAN</span><span>HTML / CSS / JAVASCRIPT</span></footer>';
} function header(kicker, title, subtitle, button, action) {
  return '<div class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span>' + kicker + '</div><h1>' + title + '</h1><p class="page-subtitle">' + subtitle + '</p></div>' + (button? '<button class="button button-dark" data-action="' + action + '"><span>＋</span> ' + button + '</button>': "") + "</div>";
} function setPage(p) {
  page = p;
  search = "";
  $$(".nav-item[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === p));
  $("#breadcrumbTitle").textContent = ({
    dashboard: "Ringkasan",
    products: "Data barang",
    transactions: "Transaksi",
    reports: "Laporan"
  })[
    p
  ];
  $("#sidebar").classList.remove("open");
  render();
} function render() {
  if(page === "dashboard") dashboard();
  if(page === "products") productsPage();
  if(page === "transactions") transactionsPage();
  if(page === "reports") reportsPage();
  $("#navProductCount").textContent = state.products.length;
} function dashboard() {
  const total = state.products.reduce((s, p) => s + p.stock, 0), low = state.products.filter(p => p.stock<= p.minStock), value = state.products.reduce((s, p) => s + p.stock * p.cost, 0), todayTx = state.transactions.filter(t => t.date === today).length;
  const stat = (label, val, icon, note, tone) => '<article class="stat-card"><div class="stat-top"><span class="stat-label">' + label + '</span><span class="stat-icon">' + icon + '</span></div><div class="stat-value">' + val + '</div><div class="stat-bottom"><span class="' + (tone || "") + '">' + note + '</span></div></article>';
  $("#pageContent").innerHTML = '<div class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span>OVERVIEW / 01</div><h1>Persediaan, <em>terkendali.</em></h1><p class="page-subtitle">Pantau stok barang dan aktivitas gudang dalam satu tempat.</p></div><button class="button button-dark" data-action="open-transaction" data-type="in"><span>＋</span> Catat transaksi</button></div>' + (hideWelcome? "": '<div class="welcome-strip"><div class="welcome-icon">✳</div><div><strong>Selamat datang di Ruang Stok.</strong><p>Ini data simulasi untuk latihan. Tambahkan barang atau catat transaksi untuk melihat angka dan laporan berubah otomatis.</p></div><button class="strip-close" id="closeWelcome">×</button></div>') + '<div class="stats-grid">' + stat("Jenis barang", num(state.products.length), "▤", "Data terdaftar") + stat("Total unit stok", num(total), "▦", "Semua barang tersedia") + stat("Stok perlu perhatian", num(low.length), "⚑", low.length? "Perlu dicek": "Semua aman", low.length? "warning": "positive") + stat("Nilai persediaan", rupiah(value), "↗", todayTx + " transaksi hari ini") + '</div>' + '<div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><div class="section-kicker">MONITORING</div><h2>Perlu perhatian</h2></div><button class="text-button" data-page="products">Semua barang ↗</button></div><div class="attention-list" id="attentionList"></div></section><section class="panel"><div class="panel-header"><div><div class="section-kicker">AKTIVITAS TERBARU</div><h2>Jejak transaksi</h2></div><button class="icon-button" data-page="transactions">↗</button></div><div class="activity-list" id="recentActivity"></div></section></div>' + '<section class="panel movement-panel"><div class="panel-header"><div><div class="section-kicker">ALUR PERSEDIAAN</div><h2>Ringkasan pergerakan</h2></div><div class="chart-legend"><span><i class="legend-in"></i>Masuk</span><span><i class="legend-out"></i>Keluar</span></div></div><div id="movementChart" class="movement-chart"></div><div class="chart-footnote">ⓘ Grafik menampilkan transaksi dalam 7 hari terakhir.</div></section>' + footer();
  $("#attentionList").innerHTML = low.length? low.slice(0, 5).map(p => '<div class="attention-row"><div class="product-identity">' + swatch(p, state.products.indexOf(p)) + '<div><div class="product-name">' + esc(p.name) + '</div><div class="product-code">' + esc(p.id) + ' · ' + esc(p.location) + '</div></div></div><div class="stock-side"><div class="stock-number">' + num(p.stock) + ' ' + esc(p.unit) + '</div><div class="stock-unit">Min. ' + num(p.minStock) + ' ' + badge(p) + '</div><div class="stock-bar"><span style="width:' + Math.min(100, p.minStock? 100 * p.stock / p.minStock: 0) + '%"></span></div></div></div>').join(""): '<div class="empty-state">Semua stok berada di atas batas minimum. ✳</div>';
  $("#recentActivity").innerHTML = activity(state.transactions.slice().sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id)).slice(0, 5));
  chart();
} function activity(list) {
  if(! list.length) return '<div class="empty-state">Belum ada transaksi. Catat barang masuk atau keluar untuk memulai.</div>';
  return list.map(t => '<div class="activity-row"><span class="activity-icon ' + (t.type === "out"? "out": "") + '">' + (t.type === "in"? "↙": "↗") + '</span><div class="activity-main"><strong>' + esc(name(t.productId)) + '</strong><small>' + esc(t.id) + ' · ' + esc(t.date) + (t.note? " · " + esc(t.note): "") + '</small></div><span class="activity-qty ' + t.type + '">' + (t.type === "in"? "+": "−") + num(t.qty) + "</span></div>").join("");
} function chart() {
  const days = Array.from({
    length: 7
  }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return dateStr(d);
  }), max = Math.max(1, ... days.flatMap(day => [
    "in",
    "out"
  ].map(type => state.transactions.filter(t => t.date === day && t.type === type).reduce((s, t) => s + t.qty, 0))));
  $("#movementChart").innerHTML = days.map(day => {
    const q = type => state.transactions.filter(t => t.date === day && t.type === type).reduce((s, t) => s + t.qty, 0), a = q("in"), b = q("out"), label = new Intl.DateTimeFormat("id-ID", {
      weekday: "short"
    }).format(new Date(day + "T12:00:00"));
    return '<div class="chart-day"><div class="bar-pair"><div class="bar" title="Masuk: ' + a + '" style="height:' + Math.max(3, a / max * 100) + '%"></div><div class="bar out" title="Keluar: ' + b + '" style="height:' + Math.max(3, b / max * 100) + '%"></div></div><label>' + label + '</label></div>';
  }).join("");
} function productsPage() {
  const cats = [
    ... new Set(state.products.map(p => p.category))
  ].sort(), list = state.products.filter(p => (p.name + " " + p.id + " " + p.category).toLowerCase().includes(search.toLowerCase()) && (category === "all" || p.category === category));
  $("#pageContent").innerHTML = header("MASTER DATA / 02", "Data <em>barang.</em>", "Kelola identitas barang, satuan, lokasi, dan batas minimum stok.", "Tambah barang", "add-product") + '<div class="subpage-toolbar"><label class="search-box"><span>⌕</span><input id="searchInput" type="search" placeholder="Cari nama atau kode barang..." value="' + esc(search) + '"></label><div class="toolbar-filters"><select class="filter-select" id="categoryFilter"><option value="all">Semua kategori</option>' + cats.map(c => '<option ' + (c === category? "selected": "") + ' value="' + esc(c) + '">' + esc(c) + "</option>").join("") + '</select></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>BARANG</th><th>KATEGORI</th><th>STOK</th><th>BATAS MIN.</th><th>STATUS</th><th>HARGA / UNIT</th><th>AKSI</th></tr></thead><tbody>' + (list.length? list.map(p => '<tr><td><div class="table-product">' + swatch(p, state.products.indexOf(p)) + '<div><strong>' + esc(p.name) + '</strong><small>' + esc(p.id) + ' · ' + esc(p.location || "-") + '</small></div></div></td><td>' + esc(p.category) + '</td><td class="table-number">' + num(p.stock) + ' ' + esc(p.unit) + '</td><td class="table-number">' + num(p.minStock) + '</td><td>' + badge(p) + '</td><td class="table-number">' + rupiah(p.cost) + '</td><td><div class="table-actions"><button class="small-action" data-action="edit-product" data-id="' + esc(p.id) + '">Edit</button><button class="small-action danger" data-action="delete-product" data-id="' + esc(p.id) + '">Hapus</button></div></td></tr>').join(""): '<tr><td colspan="7"><div class="empty-table">Tidak ada barang yang cocok.</div></td></tr>') + '</tbody></table><div class="table-footer"><span>' + list.length + ' dari ' + state.products.length + ' jenis barang</span><span>STOK DIPERBARUI OTOMATIS</span></div></div>' + footer();
} function transactionsPage() {
  const list = state.transactions.slice().sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id)).filter(t => (t.id + " " + name(t.productId) + " " + (t.note || "")).toLowerCase().includes(search.toLowerCase()) && (txType === "all" || t.type === txType));
  $("#pageContent").innerHTML = header("OPERASIONAL / 03", "Catatan <em>transaksi.</em>", "Setiap barang masuk atau keluar dicatat agar perubahan stok dapat ditelusuri.", "Catat transaksi", "open-transaction") + '<div class="transaction-cards"><button class="transaction-card" data-action="open-transaction" data-type="in"><span class="big-icon">↙</span><span><strong>Barang masuk</strong><small>Penerimaan dari pemasok atau retur.</small></span><span class="go">↗</span></button><button class="transaction-card out-card" data-action="open-transaction" data-type="out"><span class="big-icon">↗</span><span><strong>Barang keluar</strong><small>Pengeluaran untuk produksi atau pemakaian.</small></span><span class="go">↗</span></button></div><div class="subpage-toolbar"><label class="search-box"><span>⌕</span><input id="searchInput" type="search" placeholder="Cari ID, barang, atau catatan..." value="' + esc(search) + '"></label><div class="toolbar-filters"><select class="filter-select" id="typeFilter"><option value="all">Semua transaksi</option><option value="in" ' + (txType === "in"? "selected": "") + '>Barang masuk</option><option value="out" ' + (txType === "out"? "selected": "") + '>Barang keluar</option></select></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>TANGGAL</th><th>BARANG</th><th>JENIS</th><th>JUMLAH</th><th>CATATAN</th><th>AKSI</th></tr></thead><tbody>' + (list.length? list.map(t => '<tr><td class="table-number">' + esc(t.id) + '</td><td>' + esc(t.date) + '</td><td><strong>' + esc(name(t.productId)) + '</strong><div class="product-code">' + esc(t.productId) + '</div></td><td>' + badge({
    stock: t.type === "in"? 1: 0,
    minStock: 0
  }) + ' ' + (t.type === "in"? "Masuk": "Keluar") + '</td><td class="table-number">' + (t.type === "in"? "+": "−") + num(t.qty) + '</td><td>' + esc(t.note || "-") + '</td><td><button class="small-action danger" data-action="delete-transaction" data-id="' + esc(t.id) + '">Hapus</button></td></tr>').join(""): '<tr><td colspan="7"><div class="empty-table">Belum ada transaksi yang cocok.</div></td></tr>') + '</tbody></table><div class="table-footer"><span>' + list.length + ' transaksi tercatat</span><span>PERUBAHAN STOK TEREKAM</span></div></div>' + footer();
} function reportsPage() {
  const total = state.products.reduce((s, p) => s + p.stock, 0), low = state.products.filter(p => p.stock<= p.minStock), value = state.products.reduce((s, p) => s + p.stock * p.cost, 0), incoming = state.transactions.filter(t => t.type === "in").reduce((s, t) => s + t.qty, 0), outgoing = state.transactions.filter(t => t.type === "out").reduce((s, t) => s + t.qty, 0);
  const card = (label, val, note) => '<article class="report-card"><span>' + label + '</span><strong>' + val + '</strong><small>' + note + '</small></article>';
  $("#pageContent").innerHTML = header("ANALISIS / 04", "Laporan <em>persediaan.</em>", "Ringkasan posisi stok dan pergerakan barang dari data lokal.", "Ekspor CSV", "export-csv") + '<div class="report-grid">' + card("Total jenis barang", num(state.products.length), "SKU terdaftar") + card("Total unit tersedia", num(total), "Gabungan seluruh satuan") + card("Estimasi nilai stok", rupiah(value), "Stok × harga per unit") + card("Barang masuk", "+" + num(incoming), "Akumulasi transaksi") + card("Barang keluar", "−" + num(outgoing), "Akumulasi transaksi") + card("Perlu perhatian", num(low.length), "Stok di bawah batas minimum") + '</div><section class="panel"><div class="panel-header"><div><div class="section-kicker">RINCIAN</div><h2>Posisi stok saat ini</h2></div><button class="text-button" data-action="export-csv">Unduh CSV ↗</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>KODE</th><th>NAMA BARANG</th><th>STOK</th><th>NILAI PERSEDIAAN</th><th>STATUS</th></tr></thead><tbody>' + (state.products.length? state.products.slice().sort((a, b) => a.name.localeCompare(b.name)).map(p => '<tr><td class="table-number">' + esc(p.id) + '</td><td><strong>' + esc(p.name) + '</strong></td><td class="table-number">' + num(p.stock) + ' ' + esc(p.unit) + '</td><td class="table-number">' + rupiah(p.stock * p.cost) + '</td><td>' + badge(p) + '</td></tr>').join(""): '<tr><td colspan="5"><div class="empty-table">Belum ada data barang.</div></td></tr>') + '</tbody></table></div><div class="chart-footnote">Nilai persediaan adalah estimasi berdasarkan harga per unit yang diinput.</div></section><div class="report-actions" style="margin-top:16px"><button class="button button-light" data-action="export-transactions">Ekspor transaksi CSV ↗</button><button class="button button-light" data-action="reset">Kembalikan data demo ↻</button></div>' + footer();
} function field(key, label, type, value, opts) {
  opts = opts || {
  };
  let control;
  if(type === "select") control = '<select id="f-' + key + '" name="' + key + '" required>' + opts.items.map(i => '<option value="' + esc(i.value) + '" ' + (String(i.value) === String(value)? "selected": "") + '>' + esc(i.label) + '</option>').join("") + '</select>';
  else control = '<input id="f-' + key + '" name="' + key + '" type="' + type + '" value="' + esc(value == null? "": value) + '" ' + (opts.required === false? "": "required") + ' ' + (opts.min !== undefined? 'min="' + opts.min + '"': "") + ' ' + (opts.step !== undefined? 'step="' + opts.step + '"': "") + ' placeholder="' + esc(opts.placeholder || "") + '">';
  return '<div class="field ' + (opts.full? "full": "") + '"><label for="f-' + key + '">' + label + (opts.required === false? "": " *") + '</label>' + control + (opts.hint? '<small class="field-hint">' + opts.hint + "</small>": "") + "</div>";
} function openModal(which, data) {
  mode = which;
  editId = data && data.id || null;
  const prod = which === "add-product" || which === "edit-product", edit = which === "edit-product";
  $("#modalKicker").textContent = prod? "MASTER DATA": "TRANSAKSI PERSEDIAAN";
  $("#modalTitle").textContent = edit? "Edit barang": which === "add-product"? "Tambah barang": which === "transaction-out"? "Catat barang keluar": "Catat barang masuk";
  $("#submitModal").textContent = edit? "Simpan perubahan": prod? "Simpan barang": "Simpan transaksi";
  $("#formError").textContent = "";
  if(prod) {
    data = data || {
    };
    $("#modalFields").innerHTML = field("id", "Kode barang", "text", data.id || "", {
      placeholder: "BRG-007",
      hint: "Gunakan kode unik."
    }) + field("name", "Nama barang", "text", data.name || "", {
      placeholder: "Nama barang"
    }) + field("category", "Kategori", "text", data.category || "", {
      placeholder: "Material"
    }) + field("unit", "Satuan", "select", data.unit || "pcs", {
      items: [
        "pcs",
        "unit",
        "kg",
        "gram",
        "meter",
        "lembar",
        "liter",
        "kaleng",
        "pasang",
        "box"
      ].map(x => ({
        value: x,
        label: x
      }))
    }) + field("stock", "Stok tersedia", "number", data.stock ?? 0, {
      min: 0,
      step: 1
    }) + field("minStock", "Batas minimum", "number", data.minStock ?? 0, {
      min: 0,
      step: 1
    }) + field("cost", "Harga per unit (Rp)", "number", data.cost ?? 0, {
      min: 0,
      step: 1
    }) + field("location", "Lokasi penyimpanan", "text", data.location || "", {
      required: false,
      placeholder: "Rak A-01"
    });
  } else {
    if(! state.products.length) {
      notify("Tambahkan barang terlebih dahulu.", "error");
      return;
    } const type = which === "transaction-out"? "out": "in";
    $("#modalFields").innerHTML = field("productId", "Pilih barang", "select", data && data.productId || state.products[
      0
    ].id, {
      items: state.products.map(p => ({
        value: p.id,
        label: p.id + " — " + p.name + " (stok: " + p.stock + ")"
      })),
      hint: "Stok diperbarui otomatis."
    }) + field("qty", "Jumlah", "number", data && data.qty || 1, {
      min: 1,
      step: 1
    }) + field("date", "Tanggal", "date", data && data.date || today, {
    }) + field("note", "Catatan", "text", data && data.note || "", {
      required: false,
      full: true,
      placeholder: type === "in"? "Penerimaan pemasok": "Kebutuhan produksi"
    });
  } $("#modalBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => $("#modalFields input, #modalFields select")?.focus(), 30);
} function closeModal() {
  $("#modalBackdrop").hidden = true;
  document.body.style.overflow = "";
  mode = "";
  editId = null;
} function submit(e) {
  e.preventDefault();
  const v = Object.fromEntries(new FormData($("#modalForm")).entries()), err = m => $("#formError").textContent = m;
  if(mode === "add-product" || mode === "edit-product") {
    const id = v.id.trim(), nm = v.name.trim();
    if(! id || ! nm) {
      err("Kode dan nama barang wajib diisi.");
      return;
    } if(state.products.some(p => p.id.toLowerCase() === id.toLowerCase() && p.id !== editId)) {
      err("Kode barang sudah digunakan.");
      return;
    } const p = {
      id,
      name: nm,
      category: v.category.trim() || "Umum",
      unit: v.unit,
      stock: Number(v.stock),
      minStock: Number(v.minStock),
      cost: Number(v.cost),
      location: v.location.trim()
    };
    if(![
      p.stock,
      p.minStock,
      p.cost
    ].every(Number.isFinite) || p.stock < 0 || p.minStock < 0 || p.cost < 0) {
      err("Angka tidak boleh negatif.");
      return;
    } if(mode === "edit-product") {
      const old = product(editId), delta = p.stock - old.stock;
      p.id = old.id;
      state.products[
        state.products.indexOf(old)
      ] = p;
      if(delta) state.transactions.unshift({
        id: "ADJ-" + Date.now(),
        productId: p.id,
        type: delta > 0? "in": "out",
        qty: Math.abs(delta),
        date: today,
        note: "Penyesuaian saat edit barang"
      });
      notify("Perubahan barang disimpan.");
    } else {
      state.products.push(p);
      notify("Barang berhasil ditambahkan.");
    }
  } else {
    const p = product(v.productId), qty = Number(v.qty), type = mode === "transaction-out"? "out": "in";
    if(! p) {
      err("Pilih barang yang tersedia.");
      return;
    } if(! Number.isInteger(qty) || qty < 1) {
      err("Jumlah minimal 1 unit.");
      return;
    } if(type === "out" && qty > p.stock) {
      err("Stok tidak cukup. Stok tersedia " + num(p.stock) + " " + p.unit + ".");
      return;
    } p.stock += type === "in"? qty: - qty;
    state.transactions.unshift({
      id: "TRX-" + Date.now().toString().slice( - 7),
      productId: p.id,
      type,
      qty,
      date: v.date || today,
      note: (v.note || "").trim()
    });
    notify(type === "in"? "Barang masuk dicatat.": "Barang keluar dicatat.");
  } save();
  closeModal();
  render();
} function removeProduct(id) {
  const p = product(id);
  if(! p || ! confirm('Hapus "' + p.name + '"? Riwayat transaksi tetap disimpan.')) return;
  state.products = state.products.filter(x => x.id !== id);
  save();
  render();
  notify("Barang dihapus.");
} function removeTx(id) {
  const t = state.transactions.find(x => x.id === id);
  if(! t || ! confirm("Hapus transaksi ini dan kembalikan perubahan stoknya?")) return;
  const p = product(t.productId);
  if(p) {
    const next = p.stock + (t.type === "in"? - t.qty: t.qty);
    if(next < 0) {
      notify("Transaksi tidak bisa dihapus karena stok akan negatif.", "error");
      return;
    } p.stock = next;
  } state.transactions = state.transactions.filter(x => x.id !== id);
  save();
  render();
  notify("Transaksi dihapus dan stok disesuaikan.");
} function csv(kind) {
  const q = v => '"' + String(v == null? "": v).replace(/"/g, '""') + '"';
  let h, rows, file;
  if(kind === "transactions") {
    h = [
      "ID Transaksi",
      "Tanggal",
      "Kode Barang",
      "Nama Barang",
      "Jenis",
      "Jumlah",
      "Catatan"
    ];
    rows = state.transactions.map(t => [
      t.id,
      t.date,
      t.productId,
      name(t.productId),
      t.type === "in"? "Masuk": "Keluar",
      t.qty,
      t.note
    ]);
    file = "ruang-stok-transaksi.csv";
  } else {
    h = [
      "Kode Barang",
      "Nama Barang",
      "Kategori",
      "Satuan",
      "Stok",
      "Batas Minimum",
      "Status",
      "Harga per Unit",
      "Nilai Persediaan",
      "Lokasi"
    ];
    rows = state.products.map(p => [
      p.id,
      p.name,
      p.category,
      p.unit,
      p.stock,
      p.minStock,
      status(p),
      p.cost,
      p.stock * p.cost,
      p.location
    ]);
    file = "ruang-stok-persediaan.csv";
  } const blob = new Blob([
    "\uFEFF" + [
      h,
      ... rows
    ].map(r => r.map(q).join(",")).join("\r\n")
  ], {
    type: "text/csv;charset=utf-8"
  }), url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url;
  a.download = file;
  a.click();
  URL.revokeObjectURL(url);
  notify("File CSV berhasil disiapkan.");
} function reset() {
  if(! confirm("Kembalikan semua data ke demo awal? Perubahan lokal akan hilang.")) return;
  state = seed();
  save();
  search = "";
  category = "all";
  txType = "all";
  hideWelcome = false;
  render();
  notify("Data demo dipulihkan.");
} document.addEventListener("click", e => {
  const nav = e.target.closest("[data-page]");
  if(nav) {
    e.preventDefault();
    setPage(nav.dataset.page);
    return;
  } const b = e.target.closest("[data-action]");
  if(! b) return;
  const a = b.dataset.action, id = b.dataset.id;
  if(a === "add-product") openModal("add-product");
  if(a === "edit-product") openModal("edit-product", product(id));
  if(a === "delete-product") removeProduct(id);
  if(a === "open-transaction") openModal("transaction-" + (b.dataset.type || "in"));
  if(a === "delete-transaction") removeTx(id);
  if(a === "export-csv") csv("products");
  if(a === "export-transactions") csv("transactions");
  if(a === "reset") reset();
});
document.addEventListener("input", e => {
  if(e.target.id === "searchInput") {
    search = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const input = $("#searchInput");
    if(input) {
      input.focus();
      input.setSelectionRange(pos, pos);
    }
  }
});
document.addEventListener("change", e => {
  if(e.target.id === "categoryFilter") {
    category = e.target.value;
    render();
  } if(e.target.id === "typeFilter") {
    txType = e.target.value;
    render();
  }
});
$("#modalForm").addEventListener("submit", submit);
$("#closeModal").addEventListener("click", closeModal);
$("#cancelModal").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", e => {
  if(e.target === $("#modalBackdrop")) closeModal();
});
document.addEventListener("keydown", e => {
  if(e.key === "Escape" && ! $("#modalBackdrop").hidden) closeModal();
});
$("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
document.addEventListener("click", e => {
  if(e.target.id === "closeWelcome") {
    hideWelcome = true;
    dashboard();
  }
});
$("#todayDate").textContent = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric"
}).format(new Date()).toUpperCase();
render();
})();
