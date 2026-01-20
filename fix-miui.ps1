# SOLUSI KHUSUS POCO M5 / MIUI
# App crash "terus berhenti" tapi tidak ada fatal error di log

Write-Host "=== FIX MIUI SECURITY BLOCK ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking device..." -ForegroundColor Yellow
$device = adb devices | Select-String "device$"
if (!$device) {
    Write-Host "❌ Device tidak terdeteksi!" -ForegroundColor Red
    exit
}

Write-Host "✅ Device OK" -ForegroundColor Green
Write-Host ""

# 1. Grant all permissions
Write-Host "[1/5] Granting ALL permissions..." -ForegroundColor Yellow
$permissions = @(
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.READ_EXTERNAL_STORAGE"
)

foreach ($perm in $permissions) {
    adb shell pm grant com.fauls.minibank $perm 2>$null
}
Write-Host "   Permissions granted" -ForegroundColor Green

# 2. Disable battery optimization
Write-Host "[2/5] Disabling battery optimization..." -ForegroundColor Yellow
adb shell dumpsys deviceidle whitelist +com.fauls.minibank 2>$null
Write-Host "   Battery optimization disabled" -ForegroundColor Green

# 3. Clear app data
Write-Host "[3/5] Clearing app data..." -ForegroundColor Yellow
adb shell pm clear com.fauls.minibank
Write-Host "   App data cleared" -ForegroundColor Green

# 4. Reinstall
Write-Host "[4/5] Reinstalling app..." -ForegroundColor Yellow
$apk = "platforms\android\app\build\outputs\apk\debug\app-debug.apk"
if (!(Test-Path $apk)) {
    Write-Host "   APK tidak ditemukan! Build dulu!" -ForegroundColor Red
    Write-Host "   Jalankan: .\fix-poco.ps1" -ForegroundColor Yellow
    exit
}

adb install -r $apk
if ($LASTEXITCODE -eq 0) {
    Write-Host "   Install SUCCESS" -ForegroundColor Green
} else {
    Write-Host "   Install FAILED" -ForegroundColor Red
    exit
}

# 5. Manual steps needed
Write-Host ""
Write-Host "[5/5] LANGKAH MANUAL DI HP:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Buka SETTINGS di HP Poco M5:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Apps → Manage Apps → Mini Bank" -ForegroundColor White
Write-Host "   ├─ Permissions → Allow ALL" -ForegroundColor Gray
Write-Host "   ├─ Other permissions → Allow ALL" -ForegroundColor Gray
Write-Host "   ├─ Autostart → Enable" -ForegroundColor Gray
Write-Host "   └─ Battery saver → No restrictions" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Security → Manage Apps" -ForegroundColor White
Write-Host "   └─ Trust this app (jika ada)" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Additional Settings → Privacy" -ForegroundColor White
Write-Host "   └─ Special permissions → Install unknown apps → Chrome/Files → Allow" -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Setelah setting di atas, COBA BUKA APP lagi!" -ForegroundColor Green
Write-Host ""
Write-Host "Jika masih crash:" -ForegroundColor Yellow
Write-Host "  .\monitor-realtime.ps1   (monitor log real-time)" -ForegroundColor White
