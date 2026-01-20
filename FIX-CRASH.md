# 📱 Solusi: Aplikasi Crash "Terus Berhenti" di Android

## 🔍 Masalah yang Sudah Diperbaiki

### 1. ✅ Cordova Plugin Error
**Problem:** App crash karena memanggil `navigator.notification` dan `navigator.app` yang tidak tersedia
**Fix:** Ditambahkan fallback ke JavaScript standard:
```javascript
// Sekarang menggunakan fallback
if (window.navigator.notification) {
    navigator.notification.confirm(...);
} else {
    confirm(...); // Fallback
}
```

### 2. ✅ DOM Not Ready Error  
**Problem:** Event listener dipasang sebelum DOM ready
**Fix:** Proper initialization sequence:
```javascript
DOMContentLoaded → deviceready → initializeApp()
```

### 3. ✅ No Error Handling
**Problem:** JavaScript error langsung crash app
**Fix:** Try-catch di semua fungsi kritikal

### 4. ✅ Content Security Policy Too Strict
**Problem:** CSP memblokir resource yang diperlukan
**Fix:** CSP sudah disesuaikan untuk Cordova

---

## 🚀 Langkah-Langkah Rebuild

### Opsi 1: Menggunakan Script (Recommended)

```powershell
# Full rebuild dengan clean cache
.\debug-android.ps1
```

### Opsi 2: Manual Step-by-Step

```powershell
# 1. Clear Gradle cache
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force

# 2. Clean Cordova
npx cordova clean android

# 3. Reinstall platform
npx cordova platform remove android
npx cordova platform add android

# 4. Build
npx cordova build android
```

---

## 📋 Testing & Debugging

### 1. Install ke Device
```powershell
adb install -r platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

### 2. Monitor Log Real-time
```powershell
.\view-log.ps1
```

Atau manual:
```powershell
adb logcat -c  # Clear log dulu
adb logcat | Select-String "minibank|chromium|FATAL|AndroidRuntime|CordovaWebView"
```

### 3. Remote Debugging (Sangat Berguna!)

1. Install app di HP (USB Debugging ON)
2. Buka Chrome di PC
3. Go to: `chrome://inspect`
4. Pilih device Anda
5. Klik **"inspect"** pada "Mini Bank"
6. DevTools akan terbuka - lihat Console untuk error!

---

## 🐛 Cara Mendiagnosis Error

### Jika App Crash Saat Dibuka

1. **Lihat logcat:**
   ```powershell
   .\view-log.ps1
   ```

2. **Cari baris dengan:**
   - `FATAL EXCEPTION`
   - `AndroidRuntime`
   - `CordovaWebView`
   - JavaScript error

3. **Contoh Error yang Umum:**
   ```
   FATAL EXCEPTION: main
   Process: com.fauls.minibank, PID: 12345
   java.lang.RuntimeException: Unable to start activity
   Caused by: android.content.res.Resources$NotFoundException
   ```

### Jika App Layar Putih (White Screen)

1. **Remote debugging** (chrome://inspect)
2. Check Console log
3. Biasanya:
   - CSP memblokir resource
   - File tidak ditemukan
   - JavaScript syntax error

---

## 📊 Checklist Sebelum Build

- [ ] Test dulu di browser (`www/index.html`)
- [ ] Tidak ada error di console browser
- [ ] File `www/img/logo.png` ada
- [ ] Run `npx cordova clean android`
- [ ] Clear Gradle cache jika perlu
- [ ] `compileSdkVersion` = 35 di config.xml

---

## 🔥 Quick Fixes

### Clear Everything & Rebuild
```powershell
# Nuclear option - hapus semua dan rebuild
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force
Remove-Item -Path "platforms" -Recurse -Force
npx cordova platform add android
npx cordova build android
```

### Clear App Data di Device
```powershell
adb shell pm clear com.fauls.minibank
```

### Uninstall & Reinstall
```powershell
adb uninstall com.fauls.minibank
adb install platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📁 File-File Penting yang Diubah

| File | Perubahan |
|------|-----------|
| `www/js/index.js` | ✅ Ditambah error handling, fallback plugin, proper init |
| `www/index.html` | ✅ CSP disesuaikan untuk Cordova |
| `config.xml` | ✅ Ditambah preferences Android |
| `platforms/android/cdv-gradle-config.json` | ✅ compileSdkVersion: 35 |
| `debug-android.ps1` | ✅ Script rebuild otomatis |
| `view-log.ps1` | ✅ Script monitor log |

---

## 💡 Tips Pro

1. **SELALU test di browser dulu** sebelum build Android
   - Buka `www/index.html` di Chrome
   - F12 → Console
   - Fix semua error dulu

2. **Gunakan Remote Debugging**
   - `chrome://inspect` adalah best friend Anda
   - Bisa lihat console, network, DOM, dll.

3. **Monitor log saat app dibuka**
   - Jalankan `.\view-log.ps1` SEBELUM buka app
   - Perhatikan error yang muncul

4. **Incremental testing**
   - Comment out fitur yang kompleks
   - Test basic functionality dulu
   - Tambah fitur satu per satu

5. **Keep build clean**
   - Jika ragu, `cordova clean android`
   - Clear Gradle cache jika ada masalah aneh

---

## 🆘 Masih Crash?

Jalankan ini dan kirim outputnya:

```powershell
# 1. Get device info
adb shell getprop ro.build.version.sdk

# 2. Get logcat saat crash
adb logcat -c
# Buka app di HP
adb logcat > crash-log.txt
# Ctrl+C setelah crash
# Check crash-log.txt
```

Cari baris dengan "FATAL" - itu yang menyebabkan crash.
