# 📱 BankKrut - Ringkasan Perubahan Web ke Cordova

## ✅ Perubahan yang Sudah Dilakukan

### 1. **www/index.html**
- ✅ Ditambahkan `<meta charset="UTF-8">`
- ✅ Update Content Security Policy untuk mengizinkan CDN eksternal (Font Awesome, Google Fonts)
- ✅ Perbaikan viewport untuk mobile
- ✅ Script `cordova.js` dimuat sebelum `index.js`

### 2. **www/js/index.js**
- ✅ Ditambahkan event listener `deviceready` untuk inisialisasi Cordova
- ✅ Ditambahkan fungsi `onDeviceReady()` yang dipanggil saat Cordova siap
- ✅ Ditambahkan handling tombol **Back** Android (`onBackKeyDown`)
- ✅ Update fungsi `logout()` untuk menggunakan native dialog Cordova
- ✅ Ditambahkan fallback untuk mode browser (testing)
- ✅ Variable `isCordovaApp` untuk deteksi environment

### 3. **config.xml**
- ✅ Update informasi aplikasi (name, description, author)
- ✅ Ditambahkan `<access origin="*" />` untuk network access
- ✅ Ditambahkan konfigurasi Android (minSdk, targetSdk, orientation)
- ✅ Ditambahkan preferences (DisallowOverscroll, BackgroundColor, dll)
- ✅ Konfigurasi icon aplikasi

### 4. **package.json** (Optional)
- 📝 Sudah disiapkan versi update dengan plugin dependencies

### 5. **Dokumentasi**
- ✅ README.md - Dokumentasi lengkap
- ✅ INSTALL.md - Panduan instalasi detail dalam Bahasa Indonesia

## 🎯 Yang Perlu Dilakukan Selanjutnya

### Step 1: Install Plugin Cordova
```cmd
cd d:\miniBank

cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-whitelist
```

**Jika PowerShell bermasalah**, gunakan CMD atau:
```powershell
cmd /c "cd d:\miniBank && cordova plugin add cordova-plugin-dialogs"
cmd /c "cd d:\miniBank && cordova plugin add cordova-plugin-whitelist"
```

### Step 2: Verifikasi Plugin
```cmd
cordova plugin list
```

Harusnya muncul:
```
cordova-plugin-dialogs 2.0.2 "Notification"
cordova-plugin-whitelist 1.3.5 "Whitelist"
```

### Step 3: Build Aplikasi
```cmd
cordova build android
```

### Step 4: Run di Device/Emulator
```cmd
# Di emulator
cordova emulate android

# Di device (sambungkan HP via USB)
cordova run android
```

## 🔥 Fitur Cordova yang Ditambahkan

### 1. **Native Dialog Boxes**
- `navigator.notification.alert()` - Alert native
- `navigator.notification.confirm()` - Confirm dialog native
- Lebih bagus dari `alert()` dan `confirm()` browser

### 2. **Android Back Button Handler**
- Tombol back di dashboard = konfirmasi keluar
- Tombol back di page lain = kembali ke dashboard
- Tombol back saat modal terbuka = tutup modal

### 3. **Cordova DeviceReady Event**
- App hanya initialize setelah Cordova siap
- Mencegah error saat akses plugin Cordova

### 4. **Browser Fallback**
- Aplikasi tetap bisa jalan di browser untuk testing
- Auto-detect Cordova atau browser mode
- Gunakan browser standard dialog jika bukan Cordova

## 📋 Checklist Sebelum Build

- [ ] Plugin dialogs terinstall
- [ ] Plugin whitelist terinstall
- [ ] Android SDK terinstall
- [ ] Java JDK terinstall
- [ ] ANDROID_HOME environment variable di-set
- [ ] JAVA_HOME environment variable di-set
- [ ] Cordova CLI terinstall (`npm install -g cordova`)

## 🚀 Quick Start

```cmd
# 1. Install plugins
cd d:\miniBank
cordova plugin add cordova-plugin-dialogs cordova-plugin-whitelist

# 2. Build
cordova build android

# 3. Run
cordova run android
```

## 📱 Testing

### Testing di Browser (Development)
1. Buka `d:\miniBank\www\index.html` di browser
2. Atau jalankan: `cordova serve`

### Testing di Emulator
```cmd
cordova emulate android
```

### Testing di Device
1. Aktifkan USB Debugging di HP
2. Sambungkan HP via USB
3. Jalankan: `cordova run android`

## 🎨 Perubahan Kode Utama

### Before (Web Version):
```javascript
document.addEventListener('DOMContentLoaded', initializeApp);

function logout() {
    if (confirm('Yakin keluar?')) {
        alert('Terima kasih');
        location.reload();
    }
}
```

### After (Cordova Version):
```javascript
// Cordova initialization
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    initializeApp();
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function logout() {
    if (isCordovaApp && navigator.notification) {
        navigator.notification.confirm(...); // Native dialog
    } else {
        if (confirm(...)) { ... } // Browser fallback
    }
}

// Fallback untuk browser
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (!isCordovaApp) {
            initializeApp();
        }
    }, 100);
});
```

## 📄 File APK Output

Setelah build berhasil, APK ada di:
```
platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

APK ini bisa langsung diinstall di HP Android!

## 💡 Tips

1. **Development cepat**: Test di browser dulu sebelum build
2. **Debug**: Gunakan Chrome DevTools saat testing di browser
3. **Build error**: Jalankan `cordova clean android` lalu build lagi
4. **Plugin error**: Remove dan add ulang plugin yang bermasalah

## 🆘 Help

Lihat file lengkap:
- `README.md` - Dokumentasi lengkap
- `INSTALL.md` - Panduan instalasi detail

## 🎉 Selesai!

Aplikasi web Anda sudah berhasil dikonversi ke aplikasi Cordova mobile!
Tinggal install plugin dan build untuk dapat APK Android.

---
**Happy Coding! 🚀**
