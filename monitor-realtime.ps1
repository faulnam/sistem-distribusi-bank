# Real-time crash monitor
Write-Host "=== REAL-TIME CRASH MONITOR ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitoring dimulai..." -ForegroundColor Yellow
Write-Host "BUKA APP MINI BANK SEKARANG!" -ForegroundColor Red
Write-Host "Tekan Ctrl+C untuk stop" -ForegroundColor Gray
Write-Host ""

# Clear first
adb logcat -c

# Monitor with highlighting
adb logcat | ForEach-Object {
    if ($_ -match "FATAL|AndroidRuntime|com\.fauls\.minibank.*crash|Process.*died") {
        Write-Host $_ -ForegroundColor Red
    }
    elseif ($_ -match "com\.fauls\.minibank") {
        Write-Host $_ -ForegroundColor Yellow
    }
    elseif ($_ -match "Exception|Error") {
        Write-Host $_ -ForegroundColor Magenta
    }
}
