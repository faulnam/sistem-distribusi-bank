# 🔴 APP CRASH DI POCO M5 - SOLUSI LENGKAP

## MASALAH
Aplikasi "terus berhenti" tapi **TIDAK ADA** error FATAL di log.
Ini berarti **MIUI Security** membunuh app sebelum sempat jalan.

---

## ✅ SOLUSI (IKUTI URUTAN!)

### STEP 1: Fix Permission & Security via ADB
```powershell
.\fix-miui.ps1
```

Script ini akan:
- ✅ Grant semua permission
- ✅ Disable battery optimization  
- ✅ Clear app data
- ✅ Reinstall app

---

### STEP 2: Setting Manual di HP Poco M5

#### A. APP PERMISSIONS
**Settings** → **Apps** → **Manage Apps** → **Mini Bank**

1. **Permissions**
   - ☑️ Storage → Allow
   - ☑️ Phone → Allow (jika ada)
   - ☑️ Location → Allow (jika ada)

2. **Other permissions**
   - ☑️ Display pop-up windows → Allow
   - ☑️ Display pop-up windows while running in background → Allow
   - ☑️ Install unknown apps → Allow

3. **Autostart**
   - ☑️ Enable

4. **Battery saver**
   - ☑️ No restrictions

5. **Display over other apps** (jika ada)
   - ☑️ Allow

#### B. SECURITY SETTINGS
**Settings** → **Apps** → **Manage Apps** → **Mini Bank** → **App info**

Di bagian atas, pastikan:
- **Restrict data usage** → OFF
- **MIUI optimization** → OFF (jika ada)

#### C. DEVELOPER OPTIONS
**Settings** → **Additional Settings** → **Developer Options**

- ☑️ **USB Debugging** → ON
- ☑️ **Install via USB** → ON
- ☑️ **USB debugging (Security settings)** → ON
- ☑️ **Disable permission monitoring** → ON (PENTING!)

#### D. PRIVACY SETTINGS  
**Settings** → **Privacy protection** → **Special permissions**

Cari **Mini Bank**, set:
- Display over other apps → Allow
- Modify system settings → Allow

---

### STEP 3: Test Buka App

Setelah semua setting di atas, coba buka app.

**Jika masih crash:**

#### Monitor Real-time:
```powershell
.\monitor-realtime.ps1
```

Lalu buka app, lihat error yang muncul.

#### Atau ambil log:
```powershell
.\get-log.ps1
```

---

## 🔧 TROUBLESHOOTING MIUI

### Masalah: "Installation blocked" atau "App not installed"

**Solusi:**
```powershell
# Uninstall total
adb uninstall com.fauls.minibank

# Reinstall
adb install platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

Di HP:
- Settings → Security → Install unknown apps → File Manager → Allow

### Masalah: "App keeps stopping" setelah icon splash

Ini biasanya WebView issue. 

**Solusi:**
```powershell
# Update WebView
adb shell pm enable com.google.android.webview
```

Di HP:
- Play Store → Update "Android System WebView"

### Masalah: Black screen lalu crash

Resource tidak ditemukan.

**Solusi:**
```powershell
# Rebuild dengan fix
.\fix-poco.ps1
```

---

## 📱 TIPS POCO M5 SPESIFIK

### 1. Disable MIUI Optimization
Settings → Additional Settings → Developer Options → Turn OFF "MIUI optimization"
(Perlu restart HP)

### 2. Change Default Launcher
Kadang MIUI Launcher block app tertentu.
Install launcher lain (Nova, Lawnchair) untuk test.

### 3. Clear MIUI Cache
Settings → About Phone → Storage → Cached data → Clear

### 4. Check ROM Version
Settings → About Phone → MIUI Version

Jika versi MIUI terlalu baru (15+), kadang ada bug. Update ke latest atau downgrade.

---

## 🎯 KESIMPULAN

Karena **TIDAK ADA FATAL ERROR** di log, berarti:
1. ❌ Bukan JavaScript error (kode OK)
2. ❌ Bukan build error (APK OK)  
3. ✅ **MIUI Security** yang block app

**SOLUSI UTAMA:**
1. Jalankan `.\fix-miui.ps1`
2. Setting manual permission di HP
3. Disable "Permission monitoring" di Developer Options
4. Test lagi

---

## ❓ MASIH TIDAK BISA?

Coba build mode **release** (lebih stabil):

```powershell
npx cordova build android --release
adb install platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
```

Atau coba di HP lain (non-Xiaomi) untuk confirm apakah masalah di MIUI.
