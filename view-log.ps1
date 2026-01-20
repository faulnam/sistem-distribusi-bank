# Script untuk melihat log error aplikasi di Android device
Write-Host "=== Android Device Log Monitor ===" -ForegroundColor Cyan
Write-Host "Menampilkan log untuk aplikasi Mini Bank (com.fauls.minibank)" -ForegroundColor Yellow
Write-Host "Tekan Ctrl+C untuk berhenti`n" -ForegroundColor Gray

# Clear log terlebih dahulu
adb logcat -c

Write-Host "Menunggu log dari aplikasi...`n" -ForegroundColor Green

# Filter log untuk aplikasi kita dan error
adb logcat | Select-String -Pattern "minibank|chromium|CordovaWebView|SystemWebView|FATAL|AndroidRuntime" -CaseSensitive:$false
