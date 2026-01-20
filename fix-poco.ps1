# STEP-BY-STEP FIX UNTUK POCO M5

Write-Host "=== FIX CRASH POCO M5 (Dengan Permission) ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean everything
Write-Host "[1/6] Membersihkan cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\transforms*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "platforms\android\app\build" -Recurse -Force -ErrorAction SilentlyContinue

# Step 2: Rebuild platform untuk apply permission
Write-Host "[2/6] Rebuild platform (untuk apply permission)..." -ForegroundColor Yellow
npx cordova platform remove android 2>&1 | Out-Null
npx cordova platform add android
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Platform add gagal!" -ForegroundColor Red
    exit 1
}
Write-Host "   Platform ready dengan permission" -ForegroundColor Green

# Step 3: Fix colors.xml
Write-Host "[3/6] Memperbaiki colors.xml..." -ForegroundColor Yellow
$colorsPath = "platforms\android\app\src\main\res\values\colors.xml"
if (Test-Path $colorsPath) {
    $colors = @"
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <color name="cdv_splashscreen_background">#FFFFFF</color>
</resources>
"@
    $colors | Set-Content $colorsPath
    Write-Host "   colors.xml diperbaiki" -ForegroundColor Green
}

# Step 4: Build
Write-Host "[4/6] Building aplikasi..." -ForegroundColor Yellow
npx cordova build android 2>&1 | Tee-Object -Variable buildOutput | Out-Null
$buildSuccess = $LASTEXITCODE -eq 0

if ($buildSuccess) {
    Write-Host "   Build berhasil!" -ForegroundColor Green
} else {
    Write-Host "   Build gagal! Lihat error:" -ForegroundColor Red
    $buildOutput | Select-String "error|failed" -Context 2
    exit 1
}

# Step 5: Check APK
Write-Host "[5/6] Verifikasi APK..." -ForegroundColor Yellow
$apkPath = "platforms\android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    $size = (Get-Item $apkPath).Length / 1MB
    Write-Host "   APK OK - Size: $([math]::Round($size, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "   APK tidak ditemukan!" -ForegroundColor Red
    exit 1
}

# Step 5: Install instructions
Write-Host ""
Write-Host "[6/6] Install ke HP..." -ForegroundColor Green
Write-Host ""

$install = Read-Host "Install sekarang? (y/n)"
if ($install -eq 'y') {
    Write-Host ""
    Write-Host "Installing..." -ForegroundColor Yellow
    
    # Uninstall old version first
    adb uninstall com.fauls.minibank 2>$null
    
    # Install new
    adb install -r $apkPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Install berhasil!" -ForegroundColor Green
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host "SEKARANG CEK DI HP:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Settings → Apps → Mini Bank" -ForegroundColor White
        Write-Host ""
        Write-Host "Seharusnya SEKARANG ADA PERMISSION:" -ForegroundColor Green
        Write-Host "  - Internet ✓" -ForegroundColor Gray
        Write-Host "  - Network state ✓" -ForegroundColor Gray
        Write-Host "  - WiFi state ✓" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Jika permission muncul, ALLOW SEMUA!" -ForegroundColor Yellow
        Write-Host "Lalu coba buka app!" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Install gagal!" -ForegroundColor Red
        Write-Host "Pastikan USB Debugging aktif dan device terhubung" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Manual install:" -ForegroundColor Cyan
    Write-Host "  adb install -r $apkPath" -ForegroundColor White
}
