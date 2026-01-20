# Script to clean and rebuild Android app
Write-Host "=== Cleaning Gradle Cache ===" -ForegroundColor Cyan
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n=== Cleaning Cordova Android Platform ===" -ForegroundColor Cyan
npx cordova clean android

Write-Host "`n=== Rebuilding Android App ===" -ForegroundColor Cyan
npx cordova build android

Write-Host "`n=== Build Complete ===" -ForegroundColor Green
