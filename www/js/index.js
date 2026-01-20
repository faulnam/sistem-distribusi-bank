// --- KONFIGURASI API ---
// Sesuai dokumen: Cluster 1 / Syifaul
const BASE_URL = 'https://mbankingsyifaul.katgamind.or.id'; 

// Data Akun Sementara (Hardcode karena belum ada fitur Login Screen)
// Pastikan nomor rekening ini ADA di database db_mbanking Cluster 1 Anda
let currentUser = {
    name: 'Syifaul',
    accountNumber: '1001', // Ganti dengan No Rekening asli di DB Anda
    balance: 0
};

let pendingTransfer = null;
let isCordovaApp = false;

// --- INITIALIZATION ---
document.addEventListener('deviceready', onDeviceReady, false);

// Fallback jika dibuka di browser biasa
if (!window.cordova) {
    document.addEventListener('DOMContentLoaded', () => {
        isCordovaApp = false;
        initializeApp();
    });
}

function onDeviceReady() {
    console.log('Cordova Ready');
    isCordovaApp = true;
    initializeApp();
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function initializeApp() {
    console.log('Initializing App...');
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
    
    // PANGGIL DATA DARI SERVER
    fetchSaldo(); 
}

// --- FUNGSI API (Fetch Data) ---

// 1. CEK SALDO (GET /api/saldo/{account}) [cite: 55]
function fetchSaldo() {
    const url = `${BASE_URL}/api/saldo/${currentUser.accountNumber}`;
    
    // Tampilkan loading state
    document.getElementById('dashBalance').innerText = "Loading...";
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Gagal mengambil data saldo");
        return response.json();
    })
    .then(data => {
        console.log("Saldo Response:", data);
        // Update variable lokal
        currentUser.balance = parseFloat(data.balance);
        currentUser.name = data.account; // API mengembalikan nama di field 'account' kadang-kadang, sesuaikan response
        
        // Update UI
        updateAllDisplays();
    })
    .catch(error => {
        console.error("Error Fetch Saldo:", error);
        document.getElementById('dashBalance').innerText = "Error Koneksi";
        alert("Gagal terhubung ke server: " + error.message);
    });
}

// 2. TRANSFER (POST /api/transfer) [cite: 54]
function confirmTransfer() {
    if (!pendingTransfer) return;

    // Siapkan payload sesuai Dokumen [cite: 493-498]
    // Laravel route membutuhkan: from_account, to_account, amount, layanan_transaksi
    const payload = {
        "from_account": currentUser.accountNumber,
        "to_account": pendingTransfer.rekening,
        "amount": pendingTransfer.jumlah,
        "layanan_transaksi": pendingTransfer.layanan // Harus ditentukan Cluster 1 atau 2
    };

    console.log("Sending Transfer:", payload);
    const url = `${BASE_URL}/api/transfer`;

    // Tutup modal dulu & tampilkan loading
    closeModal();
    alert("Sedang memproses transaksi...");

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        console.log("Transfer Result:", result);
        
        if (result.status === 'success') {
            alert(`Transfer BERHASIL!\nPesan: ${result.message}\nSaldo Baru: ${result.new_balance}`);
            // Refresh saldo otomatis
            fetchSaldo();
            // Reset Form
            document.getElementById('transferOnlineForm').reset();
            document.getElementById('transferOverbookingForm').reset();
            navigateTo('dashboard');
        } else {
            alert(`Transfer GAGAL: ${result.message}`);
        }
    })
    .catch(error => {
        console.error("Error Transfer:", error);
        alert("Terjadi kesalahan jaringan saat transfer.");
    });
}

// --- FUNGSI UI & LOGIC LAINNYA ---

function handleTransferOnline() {
    const bank = document.getElementById('bankTujuan').value;
    const rekening = document.getElementById('rekeningTujuan').value;
    const nama = document.getElementById('namaPenerima').value;
    const jumlah = parseInt(document.getElementById('jumlahTransfer').value);
    const keterangan = document.getElementById('keteranganTransfer').value;

    if (jumlah < 10000) {
        alert('Minimal transfer Rp 10.000');
        return;
    }

    // LOGIKA PENENTUAN LAYANAN (PENTING UNTUK DOKUMEN) [cite: 208-211]
    // Kita asumsikan user memilih bank tujuan.
    // Jika Bank tujuan ada di Cluster 1 -> LAYANANA, Cluster 2 -> LAYANANB
    // Untuk demo ini, kita harus menentukan 'layanan_transaksi'
    
    // CONTOH LOGIKA SEDERHANA (Sesuaikan dengan kebutuhan soal):
    // Misal: Transfer Online dianggap ke Bank Lain (Cluster 2 / LAYANANB)
    let targetLayanan = 'LAYANANB'; 

    pendingTransfer = {
        type: 'online',
        bank,
        rekening,
        nama,
        jumlah,
        keterangan: keterangan || '-',
        layanan: targetLayanan
    };

    showConfirmationModal();
}

function handleTransferOverbooking() {
    const rekening = document.getElementById('rekeningOverbooking').value;
    const nama = document.getElementById('namaOverbooking').value;
    const jumlah = parseInt(document.getElementById('jumlahOverbooking').value);
    const keterangan = document.getElementById('keteranganOverbooking').value;

    if (jumlah < 10000) {
        alert('Minimal transfer Rp 10.000');
        return;
    }

    // Overbooking = Sesama Bank (Cluster 1 / LAYANANA)
    let targetLayanan = 'LAYANANA';

    pendingTransfer = {
        type: 'overbooking',
        rekening,
        nama,
        jumlah,
        keterangan: keterangan || '-',
        layanan: targetLayanan
    };

    showConfirmationModal();
}

function updateAllDisplays() {
    // Update Dashboard
    document.getElementById('dashAccountNumber').textContent = currentUser.accountNumber;
    document.getElementById('dashBalance').textContent = formatCurrency(currentUser.balance);
    document.getElementById('dashUserName').textContent = currentUser.name;
    document.getElementById('dashAccountNum').textContent = currentUser.accountNumber;
    
    // Update Header
    document.getElementById('userName').textContent = currentUser.name;
    const profileName = document.getElementById('profileName');
    const profileAccount = document.getElementById('profileAccount');
    if (profileName) profileName.textContent = currentUser.name;
    if (profileAccount) profileAccount.textContent = `Rek: ${currentUser.accountNumber}`;

    // Update Halaman Saldo
    document.getElementById('saldoAccountNumber').textContent = currentUser.accountNumber;
    document.getElementById('saldoUserName').textContent = currentUser.name;
    document.getElementById('saldoBalance').textContent = formatCurrency(currentUser.balance);
}

// --- HELPER FUNCTIONS (Sama seperti punya Anda) ---

function setupEventListeners() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.getAttribute('data-page');
            navigateTo(pageName);
        });
    });

    const tfOnline = document.getElementById('transferOnlineForm');
    if(tfOnline) tfOnline.addEventListener('submit', (e) => { e.preventDefault(); handleTransferOnline(); });

    const tfOver = document.getElementById('transferOverbookingForm');
    if(tfOver) tfOver.addEventListener('submit', (e) => { e.preventDefault(); handleTransferOverbooking(); });
}

function navigateTo(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    const targetPage = document.getElementById(pageName);
    const targetMenu = document.querySelector(`[data-page="${pageName}"]`);
    
    if(targetPage) targetPage.classList.add('active');
    if(targetMenu) targetMenu.classList.add('active');

    // Jika masuk dashboard atau saldo, refresh data dari server
    if (pageName === 'dashboard' || pageName === 'saldo') {
        fetchSaldo();
    }
}

function showConfirmationModal() {
    const modal = document.getElementById('confirmModal');
    const modalBody = document.getElementById('modalBody');
    // ... (Gunakan kode HTML generator modal Anda yang lama di sini, tidak perlu diubah) ...
    // Agar ringkas, saya persingkat, tapi gunakan logika render HTML Anda yang lama
    modalBody.innerHTML = `<p>Transfer Rp ${formatCurrency(pendingTransfer.jumlah)} ke ${pendingTransfer.rekening}?</p>`; 
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function updateClock() {
    const now = new Date();
    const clock = document.getElementById('clock');
    if(clock) clock.innerText = now.toLocaleTimeString('id-ID');
}

function toggleProfileDropdown() {
    document.getElementById('profileMenu').classList.toggle('active');
}

function onBackKeyDown(e) {
    e.preventDefault();
    // Logika back button sederhana
    if(document.getElementById('confirmModal').classList.contains('active')) {
        closeModal();
    } else {
        navigateTo('dashboard');
    }
}

function logout() {
    alert("Logout berhasil (Demo)");
    location.reload();
}