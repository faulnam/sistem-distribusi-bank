# Script untuk debug dan rebuild aplikasi Android
Write-Host "=== Debug & Rebuild Android App ===" -ForegroundColor Cyan

Write-Host "`n[1/6] Menghapus Gradle Cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n[2/6] Membersihkan platform Android..." -ForegroundColor Yellow
npx cordova clean android

Write-Host "`n[3/6] Menghapus dan install ulang platform Android..." -ForegroundColor Yellow
npx cordova platform remove android
npx cordova platform add android

Write-Host "`n[4/6] Memastikan plugin terpasang..." -ForegroundColor Yellow
npx cordova plugin list

Write-Host "`n[5/6] Building aplikasi Android..." -ForegroundColor Yellow
npx cordova build android

Write-Host "`n[6/6] Mengecek apk yang dihasilkan..." -ForegroundColor Yellow
$apkPath = "platforms\android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "`n✅ Build BERHASIL!" -ForegroundColor Green
    Write-Host "APK Location: $apkPath" -ForegroundColor Cyan
    Write-Host "APK Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
    
    Write-Host "`n=== Untuk install ke device ===" -ForegroundColor Magenta
    Write-Host "adb install -r $apkPath" -ForegroundColor White
    
    Write-Host "`n=== Untuk lihat log saat aplikasi berjalan ===" -ForegroundColor Magenta
    Write-Host "adb logcat | Select-String 'chromium'" -ForegroundColor White
} else {
    Write-Host "`n❌ Build GAGAL - APK tidak ditemukan!" -ForegroundColor Red
}
