# 🔧 Troubleshooting - BankKrut Cordova App

## ❌ Error: "running scripts is disabled on this system"

### Penyebab
PowerShell ExecutionPolicy memblokir script.

### Solusi 1: Gunakan CMD
```cmd
cd d:\miniBank
cordova plugin add cordova-plugin-dialogs
```

### Solusi 2: Update PowerShell ExecutionPolicy
Buka PowerShell **sebagai Administrator**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Solusi 3: Gunakan CMD dari PowerShell
```powershell
cmd /c "cd d:\miniBank && cordova plugin add cordova-plugin-dialogs"
```

---

## ❌ Error: "cordova: command not found"

### Penyebab
Cordova CLI belum terinstall.

### Solusi
```cmd
npm install -g cordova
```

Verifikasi:
```cmd
cordova --version
```

---

## ❌ Error: "ANDROID_HOME not set"

### Penyebab
Environment variable ANDROID_HOME belum di-set.

### Solusi
1. Cari lokasi Android SDK (biasanya: `C:\Users\[Username]\AppData\Local\Android\Sdk`)
2. Buka System Properties > Environment Variables
3. Tambah variable baru:
   - Name: `ANDROID_HOME`
   - Value: Path ke Android SDK Anda

4. Tambahkan ke PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`

5. Restart Command Prompt dan test:
```cmd
echo %ANDROID_HOME%
```

---

## ❌ Error: "JAVA_HOME not set"

### Penyebab
Java JDK belum terinstall atau environment variable belum di-set.

### Solusi
1. Install Java JDK 11: https://www.oracle.com/java/technologies/downloads/
2. Set environment variable:
   - Name: `JAVA_HOME`
   - Value: Path ke JDK (contoh: `C:\Program Files\Java\jdk-11`)
3. Tambahkan ke PATH: `%JAVA_HOME%\bin`
4. Restart CMD dan test:
```cmd
java -version
```

---

## ❌ Error: "Failed to find 'ANDROID_HOME'"

### Solusi
```cmd
# Check apakah Android SDK terinstall
dir %ANDROID_HOME%

# Jika tidak ada, install Android Studio dulu
# Download: https://developer.android.com/studio
```

---

## ❌ Error: "Plugin already exists"

### Solusi
```cmd
# Remove plugin dulu
cordova plugin remove cordova-plugin-dialogs

# Install lagi
cordova plugin add cordova-plugin-dialogs
```

---

## ❌ Error: Build Android gagal

### Solusi 1: Clean Build
```cmd
cordova clean android
cordova build android
```

### Solusi 2: Remove dan Add Platform
```cmd
cordova platform remove android
cordova platform add android
cordova build android
```

### Solusi 3: Update Cordova
```cmd
npm install -g cordova
cordova platform update android
```

---

## ❌ Error: "Device not found"

### Penyebab
HP tidak terdeteksi atau USB debugging tidak aktif.

### Solusi
1. **Aktifkan USB Debugging di HP:**
   - Settings > About Phone
   - Tap "Build Number" 7 kali
   - Kembali > Developer Options
   - Aktifkan "USB Debugging"

2. **Check koneksi:**
```cmd
adb devices
```

Jika tidak muncul device:
```cmd
adb kill-server
adb start-server
adb devices
```

3. **Install USB Driver:**
   - Download driver HP dari website manufacturer
   - Atau install via Android Studio > SDK Manager > Google USB Driver

---

## ❌ Error: "App tidak terbuka di HP"

### Solusi
1. **Check log:**
```cmd
cordova run android --verbose
```

2. **Uninstall dulu app lama:**
   - Uninstall app BankKrut dari HP
   - Install ulang: `cordova run android`

3. **Check permissions:**
   - Buka App Settings di HP
   - Berikan semua permissions yang diminta

---

## ❌ Error: Aplikasi crash saat dibuka

### Solusi 1: Check Cordova Console
```cmd
# Run dengan verbose mode
cordova run android --verbose

# Atau lihat logcat
adb logcat | grep -i "cordova"
```

### Solusi 2: Rebuild dari awal
```cmd
cordova clean android
cordova platform remove android
cordova platform add android
cordova plugin add cordova-plugin-dialogs cordova-plugin-whitelist
cordova build android
```

---

## ❌ Error: "White screen" saat app dibuka

### Penyebab
Cordova tidak load dengan benar atau CSP terlalu ketat.

### Solusi
1. **Check console di Chrome DevTools:**
   - Buka `chrome://inspect` di Chrome
   - Sambungkan HP via USB
   - Inspect app dan lihat console error

2. **Update Content Security Policy** di `index.html`

3. **Check cordova.js load:**
   - Pastikan `<script src="cordova.js"></script>` ada di HTML
   - Cordova.js otomatis di-generate saat build

---

## ❌ Plugin tidak berfungsi

### Solusi
```cmd
# Check plugin terinstall
cordova plugin list

# Jika tidak ada, install:
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-whitelist

# Rebuild
cordova build android
```

---

## ❌ Error: "Module not found"

### Solusi
```cmd
# Install dependencies
npm install

# Atau install ulang Cordova
npm install -g cordova
```

---

## ❌ Error: Gradle build gagal

### Solusi
1. **Update Gradle:**
   - Buka `platforms/android/gradle/wrapper/gradle-wrapper.properties`
   - Update versi Gradle jika diperlukan

2. **Clean Gradle cache:**
```cmd
cd platforms/android
gradlew clean
cd ../..
cordova build android
```

---

## ❌ Dialog native tidak muncul

### Penyebab
Plugin dialogs belum terinstall atau deviceready belum terpanggil.

### Solusi
1. **Pastikan plugin terinstall:**
```cmd
cordova plugin list
```

2. **Check kode JavaScript:**
   - Pastikan kode hanya jalan setelah `deviceready` event
   - Lihat di console: "Cordova is ready!" harusnya muncul

3. **Rebuild:**
```cmd
cordova plugin remove cordova-plugin-dialogs
cordova plugin add cordova-plugin-dialogs
cordova build android
```

---

## ❌ LocalStorage tidak persist

### Penyebab
Data terhapus saat app di-restart.

### Solusi
- Ini normal di development mode
- Untuk production, gunakan plugin storage seperti:
  - `cordova-plugin-nativestorage`
  - `cordova-sqlite-storage`

Atau tetap pakai localStorage (sudah cukup untuk app ini).

---

## 📱 Testing Checklist

Sebelum build, pastikan:
- [ ] Plugin dialogs terinstall
- [ ] Plugin whitelist terinstall
- [ ] `cordova.js` di-load di HTML
- [ ] Event `deviceready` listener ada
- [ ] ANDROID_HOME di-set
- [ ] JAVA_HOME di-set
- [ ] USB Debugging aktif (untuk device testing)

---

## 🔍 Debug Commands

```cmd
# Check Cordova info
cordova info

# Check requirements
cordova requirements android

# Check platforms
cordova platform list

# Check plugins
cordova plugin list

# Check devices
adb devices

# View logs
adb logcat

# Build dengan verbose
cordova build android --verbose

# Run dengan verbose
cordova run android --verbose
```

---

## 📞 Still Having Issues?

1. **Check dokumentasi:**
   - README.md
   - INSTALL.md
   - SUMMARY.md

2. **Clean everything dan start fresh:**
```cmd
cordova clean android
cordova platform remove android
cordova platform add android
cordova plugin add cordova-plugin-dialogs cordova-plugin-whitelist
cordova build android
cordova run android
```

3. **Check Cordova documentation:**
   - https://cordova.apache.org/docs/

---

**Good luck! 🚀**
