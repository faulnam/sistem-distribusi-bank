Write-Host "=== CRASH LOG ANALYZER ===" -ForegroundColor Cyan
Write-Host ""

# Check device
Write-Host "Mengecek device..." -ForegroundColor Yellow
$devices = adb devices | Select-String "device$"
if ($devices.Count -eq 0) {
    Write-Host "❌ DEVICE TIDAK TERDETEKSI!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Aktifkan USB Debugging:" -ForegroundColor Yellow
    Write-Host "Settings > Additional Settings > Developer Options > USB Debugging" -ForegroundColor White
    exit 1
}

Write-Host "✅ Device terdeteksi: $devices" -ForegroundColor Green
Write-Host ""

# Get device info
$model = adb shell getprop ro.product.model
$android = adb shell getprop ro.build.version.release
Write-Host "Model: $model" -ForegroundColor Cyan
Write-Host "Android: $android" -ForegroundColor Cyan
Write-Host ""

# Clear old logs
Write-Host "Membersihkan log lama..." -ForegroundColor Yellow
adb logcat -c
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║  SEKARANG BUKA APP MINI BANK DI HP    ║" -ForegroundColor Red
Write-Host "║  TUNGGU SAMPAI CRASH                  ║" -ForegroundColor Red
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""
Write-Host "Tekan ENTER setelah app crash..." -ForegroundColor Yellow
Read-Host

# Capture full log
Write-Host ""
Write-Host "Mengambil crash log..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "crash_$timestamp.txt"
adb logcat -d > $logFile

Write-Host "✅ Log disimpan ke: $logFile" -ForegroundColor Green
Write-Host ""

# Analyze
Write-Host "=== ANALISIS ERROR ===" -ForegroundColor Cyan
Write-Host ""

$content = Get-Content $logFile -Raw

# Find FATAL EXCEPTION
if ($content -match "FATAL EXCEPTION[\s\S]{0,500}minibank") {
    Write-Host "FATAL EXCEPTION DITEMUKAN:" -ForegroundColor Red
    $matches[0] | Write-Host -ForegroundColor Yellow
    Write-Host ""
}

# Find specific errors
$errors = Get-Content $logFile | Select-String "AndroidRuntime|FATAL|minibank.*crash|Resources\$NotFoundException" | Select-Object -First 20
if ($errors) {
    Write-Host "ERROR LOG:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
}

Write-Host ""
Write-Host "Buka file '$logFile' untuk detail lengkap" -ForegroundColor Cyan
Write-Host ""
$open = Read-Host "Buka file log sekarang? (y/n)"
if ($open -eq 'y') {
    notepad $logFile
}
