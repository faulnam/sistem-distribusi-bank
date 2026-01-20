# 🚀 Quick Reference - BankKrut Cordova Commands

## 📦 Instalasi Plugin (WAJIB!)

```cmd
cd d:\miniBank

cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-whitelist
```

**Jika PowerShell error**, gunakan:
```cmd
cmd /c "cd d:\miniBank && cordova plugin add cordova-plugin-dialogs"
cmd /c "cd d:\miniBank && cordova plugin add cordova-plugin-whitelist"
```

---

## 🔨 Build & Run

### Build APK
```cmd
cd d:\miniBank

# Debug build (untuk testing)
cordova build android

# Release build (untuk distribusi)
cordova build android --release
```

### Run di Emulator
```cmd
cordova emulate android
```

### Run di Device (HP Android)
```cmd
# Sambungkan HP via USB dengan USB Debugging aktif
cordova run android
```

---

## 🧹 Clean & Rebuild

```cmd
# Clean cache
cordova clean android

# Rebuild
cordova build android

# Atau full clean rebuild:
cordova clean android
cordova platform remove android
cordova platform add android
cordova plugin add cordova-plugin-dialogs cordova-plugin-whitelist
cordova build android
```

---

## 🔍 Check & Verify

```cmd
# Check plugin terinstall
cordova plugin list

# Check platform
cordova platform list

# Check requirements (ANDROID_HOME, JAVA_HOME, dll)
cordova requirements android

# Check Cordova info
cordova info

# Check Cordova version
cordova --version

# Check device connected
adb devices
```

---

## 📱 APK Location

Setelah build, APK ada di:

**Debug APK:**
```
d:\miniBank\platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

**Release APK:**
```
d:\miniBank\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
```

Copy APK ke HP dan install!

---

## 🐛 Debug

```cmd
# Run dengan verbose
cordova run android --verbose

# View Android logs
adb logcat

# Filter logs untuk Cordova
adb logcat | findstr "Cordova"

# View logs dari specific package
adb logcat | findstr "com.fauls.minibank"
```

### Debug di Chrome DevTools
1. Sambungkan HP via USB
2. Buka Chrome di PC
3. Buka URL: `chrome://inspect`
4. Pilih device dan app
5. Click "Inspect"

---

## 🔧 Plugin Management

```cmd
# List plugin
cordova plugin list

# Add plugin
cordova plugin add cordova-plugin-dialogs

# Remove plugin
cordova plugin remove cordova-plugin-dialogs

# Update plugin
cordova plugin update cordova-plugin-dialogs

# Add plugin dengan versi spesifik
cordova plugin add cordova-plugin-dialogs@2.0.2
```

---

## 📦 Platform Management

```cmd
# List platform
cordova platform list

# Add Android platform
cordova platform add android

# Remove Android platform
cordova platform remove android

# Update Android platform
cordova platform update android

# Check platform version
cordova platform version android
```

---

## 🌐 Testing di Browser

```cmd
# Serve app di browser (development)
cordova serve

# Buka di browser: http://localhost:8000

# Atau langsung buka file:
start www/index.html
```

**Note:** Beberapa fitur Cordova tidak jalan di browser!

---

## 📂 Project Structure Check

```cmd
# List files di www folder
dir www

# List platforms
dir platforms

# List plugins
dir plugins
```

---

## 🔑 Environment Variables Check

```cmd
# Check ANDROID_HOME
echo %ANDROID_HOME%

# Check JAVA_HOME
echo %JAVA_HOME%

# Check Java version
java -version

# Check Android Debug Bridge
adb version

# Check Gradle
gradle --version
```

---

## 🎯 Complete Workflow (First Time)

```cmd
# 1. Install plugins
cd d:\miniBank
cordova plugin add cordova-plugin-dialogs cordova-plugin-whitelist

# 2. Check requirements
cordova requirements android

# 3. Build
cordova build android

# 4. Run di device
cordova run android

# APK ada di:
# platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🔄 Update Workflow (Setelah edit kode)

```cmd
# 1. Clean (optional, jika ada masalah)
cordova clean android

# 2. Rebuild
cordova build android

# 3. Run
cordova run android
```

---

## 📝 Common Plugin Commands

### Install Semua Plugin Sekaligus
```cmd
cordova plugin add cordova-plugin-dialogs cordova-plugin-whitelist
```

### Remove Semua Plugin
```cmd
cordova plugin remove cordova-plugin-dialogs
cordova plugin remove cordova-plugin-whitelist
```

### Reinstall Plugin (jika bermasalah)
```cmd
cordova plugin remove cordova-plugin-dialogs
cordova plugin add cordova-plugin-dialogs
```

---

## 🚨 Emergency: Reset Everything

```cmd
# PERINGATAN: Ini akan hapus semua platform dan plugin!

# 1. Remove platform
cordova platform remove android

# 2. Remove plugin folder (optional)
rmdir /s plugins

# 3. Remove node_modules (optional)
rmdir /s node_modules

# 4. Install ulang
npm install
cordova platform add android
cordova plugin add cordova-plugin-dialogs cordova-plugin-whitelist

# 5. Build
cordova build android
```

---

## 💾 Backup APK

```cmd
# Copy APK ke folder lain
copy "platforms\android\app\build\outputs\apk\debug\app-debug.apk" "D:\Backup\BankKrut.apk"
```

---

## 📊 Project Info

```cmd
# Full project info
cordova info

# Output example:
# Cordova CLI: 12.0.0
# Platform android: 12.0.1
# Plugin dialogs: 2.0.2
# Plugin whitelist: 1.3.5
```

---

## 🎉 Final Command (Build & Install)

```cmd
# One command untuk build dan langsung install ke HP
cordova run android

# Atau dengan device specific
cordova run android --device=<device-id>
```

---

## 📱 Install APK Manual ke HP

1. Copy APK dari PC ke HP via USB atau Bluetooth
2. Di HP, buka File Manager
3. Tap file APK
4. Izinkan "Install from Unknown Sources" jika diminta
5. Tap Install

---

## ✅ Checklist Sebelum Build

- [ ] Plugin dialogs terinstall: `cordova plugin list`
- [ ] Plugin whitelist terinstall: `cordova plugin list`
- [ ] Android platform terinstall: `cordova platform list`
- [ ] ANDROID_HOME set: `echo %ANDROID_HOME%`
- [ ] JAVA_HOME set: `echo %JAVA_HOME%`
- [ ] Edit kode sudah di-save
- [ ] No errors di console

Build command:
```cmd
cordova build android
```

---

**Selamat Coding! 🚀**

Lihat juga:
- `README.md` - Dokumentasi lengkap
- `INSTALL.md` - Panduan instalasi
- `TROUBLESHOOTING.md` - Solusi error
- `SUMMARY.md` - Ringkasan perubahan
