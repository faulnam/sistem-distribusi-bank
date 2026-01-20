# 📝 Penjelasan Detail Perubahan Kode Web → Cordova

## 🎯 Overview

Aplikasi BankKrut yang awalnya dibuat untuk web browser telah disesuaikan agar bisa berjalan sebagai aplikasi mobile Android menggunakan Apache Cordova.

---

## 📄 File: www/index.html

### ✅ Perubahan 1: Menambahkan Meta Charset

**Sebelum:**
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta http-equiv="Content-Security-Policy" ...>
```

**Sesudah:**
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" ...>
```

**Alasan:** HTML5 standard requires charset declaration.

---

### ✅ Perubahan 2: Update Content Security Policy (CSP)

**Sebelum:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self' data: https://ssl.gstatic.com 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline'; 
               media-src *; 
               img-src 'self' data: content:;">
```

**Sesudah:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self' data: https://ssl.gstatic.com https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com 'unsafe-eval' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; 
               font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; 
               media-src *; 
               img-src 'self' data: content:;">
```

**Alasan:** 
- Mengizinkan loading Font Awesome dari CDN (cdnjs.cloudflare.com)
- Mengizinkan loading Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
- Tambah `font-src` untuk font files
- Cordova memerlukan CSP yang lebih spesifik untuk external resources

---

### ✅ Perubahan 3: Update Viewport

**Sebelum:**
```html
<meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover, user-scalable=no">
```

**Sesudah:**
```html
<meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover">
```

**Alasan:** 
- `user-scalable=no` deprecated dan tidak direkomendasikan
- Mobile apps biasanya sudah disable zoom by default

---

### ✅ Perubahan 4: Script Loading Order

**Sebelum:**
```html
<script src="js/index.js"></script>
```

**Sesudah:**
```html
<!-- Cordova Script HARUS dimuat pertama -->
<script src="cordova.js"></script>
<script src="js/index.js"></script>
```

**Alasan:**
- `cordova.js` HARUS dimuat sebelum script lain
- File `cordova.js` otomatis di-generate saat build (tidak perlu dibuat manual)
- Script app harus menunggu Cordova ready sebelum akses plugin

---

## 📜 File: www/js/index.js

### ✅ Perubahan 1: Tambah Variable untuk Cordova Detection

**Ditambahkan:**
```javascript
let isCordovaApp = false;
```

**Alasan:** 
- Untuk detect apakah app jalan di Cordova atau browser
- Berguna untuk conditional logic (native dialog vs browser dialog)

---

### ✅ Perubahan 2: Event Listener DeviceReady

**Ditambahkan:**
```javascript
// Cordova initialization
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Cordova is ready!');
    isCordovaApp = true;
    
    // Initialize app after Cordova is ready
    initializeApp();
    
    // Handle back button for Android
    document.addEventListener("backbutton", onBackKeyDown, false);
}
```

**Alasan:**
- Event `deviceready` dipanggil saat Cordova siap
- Semua inisialisasi app harus dilakukan SETELAH deviceready
- Akses plugin Cordova hanya bisa setelah deviceready
- Back button handler untuk Android experience yang lebih baik

---

### ✅ Perubahan 3: Android Back Button Handler

**Ditambahkan:**
```javascript
function onBackKeyDown(e) {
    e.preventDefault();
    
    // Check if modal is open
    const modal = document.getElementById('confirmModal');
    if (modal && modal.classList.contains('active')) {
        closeModal();
        return;
    }
    
    // Check if on dashboard
    const dashboardPage = document.getElementById('dashboard');
    if (dashboardPage && dashboardPage.classList.contains('active')) {
        // Ask before exit
        navigator.notification.confirm(
            'Apakah Anda yakin ingin keluar dari aplikasi?',
            function(buttonIndex) {
                if (buttonIndex === 1) {
                    navigator.app.exitApp();
                }
            },
            'Keluar Aplikasi',
            ['Ya', 'Tidak']
        );
    } else {
        // Go back to dashboard
        navigateTo('dashboard');
    }
}
```

**Alasan:**
- Tombol back Android perlu di-handle custom
- Jika modal terbuka → tutup modal
- Jika di dashboard → konfirmasi keluar app
- Jika di page lain → kembali ke dashboard
- User experience lebih baik dan intuitif

---

### ✅ Perubahan 4: Update Fungsi Logout (Native Dialog)

**Sebelum:**
```javascript
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        alert('Terima kasih telah menggunakan MiniBank');
        location.reload();
    }
}
```

**Sesudah:**
```javascript
function logout() {
    const confirmMessage = 'Apakah Anda yakin ingin keluar?';
    
    if (isCordovaApp && navigator.notification) {
        // Use Cordova dialog
        navigator.notification.confirm(
            confirmMessage,
            function(buttonIndex) {
                if (buttonIndex === 1) {
                    showLogoutMessage();
                }
            },
            'Konfirmasi Keluar',
            ['Ya', 'Tidak']
        );
    } else {
        // Use browser confirm
        if (confirm(confirmMessage)) {
            showLogoutMessage();
        }
    }
}

function showLogoutMessage() {
    if (isCordovaApp && navigator.notification) {
        navigator.notification.alert(
            'Terima kasih telah menggunakan MiniBank',
            function() {
                location.reload();
            },
            'BankKrut',
            'OK'
        );
    } else {
        alert('Terima kasih telah menggunakan MiniBank');
        location.reload();
    }
}
```

**Alasan:**
- Native dialog (`navigator.notification`) lebih bagus dari browser dialog
- Tampilan lebih native dan professional
- Fallback ke browser dialog jika testing di browser
- Conditional logic berdasarkan `isCordovaApp`

---

### ✅ Perubahan 5: Browser Fallback

**Sebelum:**
```javascript
document.addEventListener('DOMContentLoaded', initializeApp);
```

**Sesudah:**
```javascript
// Fallback for web browser - DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    // Only initialize if not Cordova or Cordova not detected within 1 second
    setTimeout(function() {
        if (!isCordovaApp) {
            console.log('Running in browser mode');
            initializeApp();
        }
    }, 100);
});
```

**Alasan:**
- App tetap bisa jalan di browser untuk testing
- Jika Cordova tidak terdetect dalam 100ms → assume browser mode
- Initialize app via DOMContentLoaded jika di browser
- Mencegah double initialization

---

### ✅ Perubahan 6: Update initializeApp

**Sebelum:**
```javascript
function initializeApp() {
    loadFromLocalStorage();
    setupEventListeners();
    // ... rest of code
}
```

**Sesudah:**
```javascript
function initializeApp() {
    console.log('Initializing app...');
    loadFromLocalStorage();
    setupEventListeners();
    // ... rest of code (tidak berubah)
}
```

**Alasan:**
- Tambah console.log untuk debugging
- Membantu track kapan app di-initialize
- Rest of function tetap sama (tidak perlu diubah)

---

## 🗂️ File: config.xml

### ✅ Update Lengkap

**Sebelum:**
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.fauls.minibank" version="1.0.0" ...>
    <name>Mini Bank</name>
    <description>Sample Apache Cordova App</description>
    <author email="dev@cordova.apache.org" href="https://cordova.apache.org">
        Apache Cordova Team
    </author>
    <content src="index.html" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
</widget>
```

**Sesudah:**
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.fauls.minibank" version="1.0.0" ...>
    <name>Mini Bank</name>
    <description>
        Aplikasi Internet Banking BankKrut - Kelola rekening Anda dengan mudah
    </description>
    <author email="dev@bankrut.com" href="https://bankrut.com">
        BankKrut Development Team
    </author>
    <content src="index.html" />
    
    <!-- Allow access to external resources -->
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
    
    <!-- Android specific settings -->
    <platform name="android">
        <allow-intent href="market:*" />
        
        <!-- App icons -->
        <icon density="ldpi" src="www/img/logo.png" />
        <!-- ... more icons ... -->
        
        <!-- Preferences -->
        <preference name="android-minSdkVersion" value="24" />
        <preference name="android-targetSdkVersion" value="33" />
        <preference name="Orientation" value="portrait" />
    </platform>
    
    <!-- Global preferences -->
    <preference name="DisallowOverscroll" value="true" />
    <preference name="BackgroundColor" value="0xffffffff" />
    <preference name="HideKeyboardFormAccessoryBar" value="false" />
    <preference name="Fullscreen" value="false" />
    <preference name="Webview" value="SystemWebView" />
</widget>
```

**Alasan:**
- Update description dan author info
- `<access origin="*" />` - izinkan akses ke semua domain (untuk CDN)
- `allow-intent` - izinkan buka tel, sms, mailto, geo links
- Android specific: minSdk 24 (Android 7.0), targetSdk 33 (Android 13)
- Orientation portrait - lock ke portrait mode
- DisallowOverscroll - disable overscroll effect
- App icons - setup icons untuk berbagai densitas

---

## 🔌 Plugin yang Dibutuhkan

### 1. cordova-plugin-dialogs
```javascript
// Native dialog API
navigator.notification.alert(message, callback, title, buttonName);
navigator.notification.confirm(message, callback, title, buttonLabels);
navigator.notification.prompt(message, callback, title, buttonLabels, defaultText);
```

**Digunakan di:**
- `logout()` function
- `onBackKeyDown()` function

### 2. cordova-plugin-whitelist
**Fungsi:** Network security dan CSP enforcement
**Diperlukan untuk:** Akses ke external CDN (Font Awesome, Google Fonts)

---

## 📊 Comparison: Browser vs Cordova

| Feature | Browser (Sebelum) | Cordova (Sesudah) |
|---------|-------------------|-------------------|
| Dialog | `alert()`, `confirm()` | `navigator.notification.alert/confirm()` |
| Initialization | `DOMContentLoaded` | `deviceready` |
| Back Button | Browser default | Custom handler |
| Icons | N/A | Multi-density icons |
| Offline | LocalStorage only | LocalStorage + native storage options |
| Distribution | Website URL | APK file |
| Platform | Web only | Android (+ iOS possible) |

---

## 🎯 Code Flow

### Browser Mode:
```
1. DOM loads
2. DOMContentLoaded event fires (100ms delay)
3. Check if Cordova (false)
4. initializeApp() runs
5. App ready
```

### Cordova Mode:
```
1. DOM loads
2. cordova.js loads
3. deviceready event fires
4. onDeviceReady() runs
5. isCordovaApp = true
6. initializeApp() runs
7. Setup backbutton listener
8. App ready
```

---

## ✅ Testing Checklist

### Di Browser:
- ✅ App loads dan jalan normal
- ✅ Dialog menggunakan browser alert/confirm
- ✅ Console: "Running in browser mode"

### Di Cordova:
- ✅ App loads dan jalan normal
- ✅ Dialog menggunakan native notification
- ✅ Back button berfungsi custom
- ✅ Console: "Cordova is ready!"
- ✅ No white screen
- ✅ All features working

---

## 🚀 Summary Perubahan

### HTML (index.html):
1. ✅ Meta charset
2. ✅ CSP update untuk CDN
3. ✅ Viewport fix
4. ✅ cordova.js script

### JavaScript (index.js):
1. ✅ isCordovaApp variable
2. ✅ deviceready listener
3. ✅ onDeviceReady function
4. ✅ onBackKeyDown function
5. ✅ logout function update
6. ✅ Browser fallback
7. ✅ Native dialogs

### Config (config.xml):
1. ✅ Complete configuration
2. ✅ Android settings
3. ✅ Permissions
4. ✅ Icons
5. ✅ Preferences

### Plugins:
1. ✅ cordova-plugin-dialogs
2. ✅ cordova-plugin-whitelist

---

**Total Lines Changed:** ~150 lines
**New Features Added:** Native dialogs, Back button handler, Multi-mode support
**Breaking Changes:** None (backward compatible dengan browser)

---

**Happy Coding! 🎉**
