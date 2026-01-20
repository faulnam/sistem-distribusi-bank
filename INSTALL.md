# Panduan Instalasi dan Menjalankan Aplikasi BankKrut

## Langkah-langkah Install Plugin

### Opsi 1: Menggunakan CMD (Disarankan jika PowerShell bermasalah)

Buka Command Prompt (CMD) dan jalankan:

```cmd
cd d:\miniBank

cordova plugin add cordova-plugin-dialogs

cordova plugin add cordova-plugin-whitelist
```

### Opsi 2: Menggunakan PowerShell dengan ExecutionPolicy

Buka PowerShell sebagai Administrator dan jalankan:

```powershell
# Set execution policy (hanya sekali)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Masuk ke direktori
cd d:\miniBank

# Install plugin
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-whitelist
```

### Opsi 3: Menggunakan cmd dari PowerShell

```powershell
cmd /c "cd d:\miniBank && cordova plugin add cordova-plugin-dialogs"
cmd /c "cd d:\miniBank && cordova plugin add cordova-plugin-whitelist"
```

## Verifikasi Plugin Terinstall

```cmd
cd d:\miniBank
cordova plugin list
```

Output yang diharapkan:
```
cordova-plugin-dialogs 2.0.2 "Notification"
cordova-plugin-whitelist 1.3.5 "Whitelist"
```

## Build dan Run Aplikasi

### 1. Build Aplikasi

```cmd
cd d:\miniBank
cordova build android
```

### 2. Run di Emulator

Pastikan Android Emulator sudah berjalan, lalu:

```cmd
cordova emulate android
```

### 3. Run di Device Android

1. Sambungkan HP Android via USB
2. Aktifkan USB Debugging di HP:
   - Buka Settings > About Phone
   - Tap "Build Number" 7 kali untuk mengaktifkan Developer Mode
   - Kembali ke Settings > Developer Options
   - Aktifkan "USB Debugging"

3. Jalankan:
```cmd
cordova run android
```

### 4. Build APK untuk Distribusi

```cmd
# Build APK debug
cordova build android --debug

# Build APK release (untuk distribusi)
cordova build android --release

# APK akan ada di:
# platforms\android\app\build\outputs\apk\debug\app-debug.apk
# atau
# platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
```

## Testing di Browser (Development Only)

Untuk development dan testing cepat:

1. Buka file `d:\miniBank\www\index.html` di browser
2. Atau gunakan live server:
```cmd
cordova serve
```
Lalu buka: http://localhost:8000

**Catatan:** Beberapa fitur Cordova tidak akan berfungsi di browser (native dialogs, back button, dll), tapi akan menggunakan fallback browser standard.

## Requirements yang Harus Terinstall

1. **Node.js** - Download dari https://nodejs.org
2. **Cordova CLI**:
   ```cmd
   npm install -g cordova
   ```
3. **Android Studio** - Download dari https://developer.android.com/studio
   - Install Android SDK
   - Install Android SDK Platform Tools
   - Install Android SDK Build-Tools

4. **Java JDK 11**:
   - Download dari https://www.oracle.com/java/technologies/downloads/
   - Set JAVA_HOME environment variable

5. **Gradle** - Biasanya sudah include di Android Studio

## Set Environment Variables

Tambahkan ke System Environment Variables:

1. **JAVA_HOME**: Path ke JDK (contoh: `C:\Program Files\Java\jdk-11`)
2. **ANDROID_HOME**: Path ke Android SDK (contoh: `C:\Users\[Username]\AppData\Local\Android\Sdk`)
3. **PATH**: Tambahkan:
   - `%JAVA_HOME%\bin`
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`

## Troubleshooting

### Error: "cordova: command not found"
```cmd
npm install -g cordova
```

### Error: "ANDROID_HOME not set"
Set environment variable ANDROID_HOME ke path Android SDK Anda.

### Error: "JAVA_HOME not set"
Set environment variable JAVA_HOME ke path JDK Anda.

### Error: "Plugin already installed"
```cmd
cordova plugin remove cordova-plugin-dialogs
cordova plugin add cordova-plugin-dialogs
```

### Build gagal
```cmd
# Clean cache
cordova clean android

# Remove platform
cordova platform remove android

# Add platform lagi
cordova platform add android

# Build
cordova build android
```

### Device tidak terdeteksi
```cmd
# Cek device
adb devices

# Jika tidak muncul, restart adb
adb kill-server
adb start-server
adb devices
```

## Perintah Berguna

```cmd
# Cek Cordova version
cordova --version

# Cek platform terinstall
cordova platform list

# Cek plugin terinstall
cordova plugin list

# Cek requirements
cordova requirements android

# Info platform
cordova info

# Clean build
cordova clean android
```

## File APK Location

Setelah build, APK bisa ditemukan di:
- Debug: `platforms\android\app\build\outputs\apk\debug\app-debug.apk`
- Release: `platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk`

APK debug bisa langsung diinstall di HP. Untuk release, perlu di-sign terlebih dahulu.

## Next Steps

Setelah semua setup, jalankan:
1. `cordova plugin add cordova-plugin-dialogs cordova-plugin-whitelist`
2. `cordova build android`
3. `cordova run android`

Selamat! Aplikasi BankKrut Anda siap digunakan! 🎉
