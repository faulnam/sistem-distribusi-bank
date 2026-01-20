# 🎯 QUICK START - Fix Crash & Rebuild

## ⚡ Cara Tercepat (1 Command)

```powershell
.\debug-android.ps1
```

Kemudian install:
```powershell
adb install -r platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🔍 Jika Masih Crash - Debug

```powershell
# Terminal 1: Monitor log
.\view-log.ps1

# Terminal 2: Test app di HP
adb install -r platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

Lihat error di Terminal 1!

---

## 🌐 Remote Debug (Best Way!)

1. Install app ke HP
2. Chrome di PC → `chrome://inspect`
3. Klik "inspect" pada Mini Bank
4. Lihat Console untuk error JavaScript

---

## 📚 Dokumentasi Lengkap

- **FIX-CRASH.md** - Solusi crash lengkap
- **TROUBLESHOOTING.md** - Error umum & solusi
- **debug-android.ps1** - Script rebuild otomatis
- **view-log.ps1** - Script monitor log

---

## ✅ Yang Sudah Diperbaiki

1. ✅ Cordova plugin fallback (navigator.notification)
2. ✅ DOM ready handling
3. ✅ Error handling dengan try-catch
4. ✅ Content Security Policy
5. ✅ compileSdkVersion → 35
6. ✅ Color format → #FFFFFFFF

---

## 🚨 Jika Masih Error

```powershell
# Nuclear option - hapus semua
Remove-Item "platforms" -Recurse -Force
Remove-Item "$env:USERPROFILE\.gradle\caches" -Recurse -Force
npx cordova platform add android
npx cordova build android
```
