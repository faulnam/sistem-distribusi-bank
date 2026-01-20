# ✅ Checklist: BankKrut Cordova Setup

## 📋 Pre-Build Checklist

### 1. Environment Setup
- [ ] Node.js terinstall (`node --version`)
- [ ] Cordova CLI terinstall (`cordova --version`)
- [ ] Java JDK 11+ terinstall (`java -version`)
- [ ] Android Studio terinstall
- [ ] Android SDK terinstall
- [ ] JAVA_HOME environment variable set (`echo %JAVA_HOME%`)
- [ ] ANDROID_HOME environment variable set (`echo %ANDROID_HOME%`)
- [ ] PATH includes Android platform-tools

### 2. Project Setup
- [ ] Masuk ke direktori project (`cd d:\miniBank`)
- [ ] Android platform terinstall (`cordova platform list`)
- [ ] Plugin dialogs terinstall (`cordova plugin list`)
- [ ] Plugin whitelist terinstall (`cordova plugin list`)

### 3. Code Changes
- [ ] `www/index.html` - cordova.js script ada
- [ ] `www/index.html` - CSP sudah update
- [ ] `www/index.html` - Meta charset ada
- [ ] `www/js/index.js` - deviceready listener ada
- [ ] `www/js/index.js` - onDeviceReady function ada
- [ ] `www/js/index.js` - onBackKeyDown function ada
- [ ] `config.xml` - Konfigurasi lengkap

---

## 🔧 Installation Checklist

### Step 1: Install Cordova CLI
```cmd
npm install -g cordova
```
- [ ] Command berhasil
- [ ] Verify: `cordova --version` menampilkan versi

### Step 2: Add Android Platform (jika belum)
```cmd
cd d:\miniBank
cordova platform add android
```
- [ ] Command berhasil
- [ ] Verify: `cordova platform list` menampilkan android

### Step 3: Install Plugins
```cmd
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-whitelist
```
- [ ] Dialogs plugin terinstall
- [ ] Whitelist plugin terinstall
- [ ] Verify: `cordova plugin list` menampilkan kedua plugin

### Step 4: Check Requirements
```cmd
cordova requirements android
```
- [ ] Java JDK: ✓
- [ ] Android SDK: ✓
- [ ] Android target: ✓
- [ ] Gradle: ✓

---

## 🏗️ Build Checklist

### Step 1: Clean (Optional)
```cmd
cordova clean android
```
- [ ] Command berhasil
- [ ] No errors

### Step 2: Build
```cmd
cordova build android
```
- [ ] Build started
- [ ] No errors
- [ ] Build successful
- [ ] APK created

### Step 3: Verify APK
```cmd
dir platforms\android\app\build\outputs\apk\debug\app-debug.apk
```
- [ ] APK file exists
- [ ] File size > 0 bytes

---

## 📱 Testing Checklist

### Testing di Browser (Development)
```cmd
start www\index.html
```
- [ ] App loads
- [ ] No console errors
- [ ] Console: "DOM Content Loaded"
- [ ] Console: "Running in browser mode"
- [ ] Dashboard muncul
- [ ] Menu navigation works
- [ ] Transfer form works
- [ ] Modal works
- [ ] Logout works

### Testing di Emulator
```cmd
cordova emulate android
```
- [ ] Emulator starts
- [ ] App installs
- [ ] App launches
- [ ] Console: "Cordova is ready!"
- [ ] Dashboard muncul
- [ ] Native dialog muncul (bukan browser alert)
- [ ] Back button works
- [ ] All features working

### Testing di Device
#### Preparation:
- [ ] USB Debugging aktif di HP
- [ ] HP tersambung via USB
- [ ] `adb devices` menampilkan device

#### Run App:
```cmd
cordova run android
```
- [ ] App installs ke HP
- [ ] App launches automatically
- [ ] Console: "Cordova is ready!"
- [ ] Dashboard muncul
- [ ] Native dialog muncul
- [ ] Back button works
- [ ] App responsive
- [ ] No crashes

---

## 🧪 Feature Testing Checklist

### Dashboard
- [ ] Saldo muncul (Rp 50.000.000)
- [ ] Nomor rekening muncul (1234567890)
- [ ] Nama user muncul (Syifaul)
- [ ] Clock berjalan
- [ ] Transaksi terakhir muncul
- [ ] Profile dropdown works

### Lihat Saldo
- [ ] Navigate ke Lihat Saldo works
- [ ] Informasi saldo lengkap muncul
- [ ] Format currency correct

### Histori Transaksi
- [ ] Navigate ke Histori works
- [ ] Tabel transaksi muncul
- [ ] Filter tanggal works
- [ ] Filter tipe works
- [ ] Data correct

### Mutasi Rekening
- [ ] Navigate ke Mutasi works
- [ ] Tabel mutasi muncul
- [ ] Filter tanggal works
- [ ] Kolom Debit/Kredit correct

### Transfer Online
- [ ] Navigate ke Transfer Online works
- [ ] Form lengkap muncul
- [ ] Select bank works
- [ ] Input validation works
- [ ] Submit form works
- [ ] Modal konfirmasi muncul (NATIVE DIALOG)
- [ ] Konfirmasi transfer works
- [ ] Saldo berkurang
- [ ] Transaksi tercatat
- [ ] Success message muncul (NATIVE DIALOG)

### Transfer Overbooking
- [ ] Navigate ke Transfer Overbooking works
- [ ] Info box muncul
- [ ] Form lengkap muncul
- [ ] Input validation works
- [ ] Submit form works
- [ ] Modal konfirmasi muncul (NATIVE DIALOG)
- [ ] Konfirmasi transfer works
- [ ] Saldo berkurang
- [ ] Transaksi tercatat
- [ ] Success message muncul (NATIVE DIALOG)

### Logout
- [ ] Logout button works
- [ ] Konfirmasi dialog muncul (NATIVE DIALOG)
- [ ] Cancel works
- [ ] Confirm works
- [ ] Success message muncul (NATIVE DIALOG)
- [ ] App reloads

### Android Back Button
- [ ] Back di dashboard → konfirmasi keluar (NATIVE DIALOG)
- [ ] Back di page lain → kembali ke dashboard
- [ ] Back saat modal terbuka → tutup modal
- [ ] Exit app works

### LocalStorage
- [ ] Data tersimpan saat reload
- [ ] Saldo persist
- [ ] Transaksi persist
- [ ] User data persist

---

## 🐛 Debug Checklist

### Browser Console (chrome://inspect)
- [ ] Chrome inspect page terbuka
- [ ] Device terdeteksi
- [ ] App bisa di-inspect
- [ ] Console accessible
- [ ] No red errors
- [ ] "Cordova is ready!" muncul

### Common Issues Fixed
- [ ] No white screen
- [ ] No "deviceready not fired"
- [ ] No CSP violations
- [ ] No plugin errors
- [ ] No undefined errors
- [ ] No network errors (fonts/icons load)

---

## 📦 Distribution Checklist

### APK Debug (Testing)
- [ ] APK file ada di: `platforms\android\app\build\outputs\apk\debug\app-debug.apk`
- [ ] File size reasonable (5-10 MB)
- [ ] APK bisa di-copy
- [ ] APK bisa diinstall manual di HP
- [ ] App jalan normal setelah install manual

### APK Release (Production) - Optional
```cmd
cordova build android --release
```
- [ ] Release build berhasil
- [ ] APK ada di: `platforms\android\app\build\outputs\apk\release\`
- [ ] APK perlu di-sign untuk distribusi

---

## 📚 Documentation Checklist

File dokumentasi yang tersedia:
- [ ] `README.md` - Overview dan dokumentasi lengkap
- [ ] `INSTALL.md` - Panduan instalasi step-by-step
- [ ] `SUMMARY.md` - Ringkasan perubahan
- [ ] `CODE_CHANGES.md` - Detail perubahan kode
- [ ] `COMMANDS.md` - Quick reference commands
- [ ] `TROUBLESHOOTING.md` - Solusi error umum
- [ ] `CHECKLIST.md` - File ini

---

## 🎯 Final Verification

### Code Quality
- [ ] No console errors
- [ ] No lint errors
- [ ] Code formatted properly
- [ ] Comments clear

### Functionality
- [ ] All features working
- [ ] No crashes
- [ ] Performance good
- [ ] UI responsive

### User Experience
- [ ] Native dialogs (bukan browser alert)
- [ ] Back button intuitive
- [ ] Smooth transitions
- [ ] No lag

### Ready for Distribution
- [ ] APK created
- [ ] App tested thoroughly
- [ ] No critical bugs
- [ ] Documentation complete

---

## 🚀 Ready to Ship!

Jika semua checklist di atas sudah ✅, maka:

**APLIKASI SIAP DIGUNAKAN! 🎉**

### Next Steps:
1. Copy APK ke HP dan test sekali lagi
2. Share APK ke user lain untuk testing
3. Collect feedback
4. Fix bugs (jika ada)
5. Build release version
6. Sign APK untuk production
7. Publish ke Google Play Store (optional)

---

## 📞 Quick Help

Jika ada yang ❌, lihat:
- `TROUBLESHOOTING.md` untuk solusi
- `COMMANDS.md` untuk command reference
- `CODE_CHANGES.md` untuk detail perubahan

**Good luck! 🍀**
