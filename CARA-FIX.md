# 🔧 CARA MENGATASI CRASH DI POCO M5

## IKUTI LANGKAH INI:

### 1️⃣ Rebuild & Install
```powershell
.\fix-poco.ps1
```

Pilih 'y' untuk install otomatis.

---

### 2️⃣ Jika Masih Crash - Ambil Log Error

```powershell
.\get-log.ps1
```

**Cara pakai:**
- Jangan buka app dulu
- Jalankan script
- Tunggu instruksi
- Buka app di HP
- Tunggu crash
- Tekan ENTER
- Lihat hasil analisis

---

### 3️⃣ Remote Debug (Cara Terbaik!)

1. Buka **Chrome** di PC
2. Ketik: `chrome://inspect`
3. Buka app di HP
4. Klik **"inspect"** pada Mini Bank
5. Lihat tab **Console** - semua error terlihat di sini!

---

### 4️⃣ Khusus Poco M5 - MIUI Permission

Buka **Settings** di HP:
- **Apps** → **Mini Bank**
- **Permissions** → Allow all
- **Autostart** → Enable
- **Battery saver** → No restrictions

---

## ❓ Troubleshooting

### Device Tidak Terdeteksi
```powershell
# Cek koneksi
adb devices
```

Jika kosong:
1. **Settings** → **About Phone**
2. Tap **MIUI Version** 7x (sampai muncul "Developer mode")
3. **Settings** → **Additional Settings** → **Developer Options**
4. Enable **USB Debugging**
5. Tap **Allow** saat popup muncul di HP

### Build Error
```powershell
# Clean total
npx cordova clean android
npx cordova platform remove android
npx cordova platform add android
npx cordova build android
```

### Install Error
```powershell
# Uninstall dulu
adb uninstall com.fauls.minibank

# Install ulang
adb install -r platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📞 Masih Bermasalah?

Kirim hasil dari:
```powershell
.\get-log.ps1
```

Atau screenshot dari Chrome Remote Debug (`chrome://inspect`)
