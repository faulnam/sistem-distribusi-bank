@echo off
echo ========================================
echo REBUILD DENGAN PERMISSION
echo ========================================
echo.

echo [1/4] Menghapus platform lama...
call npx cordova platform remove android

echo.
echo [2/4] Menambah platform baru dengan permission...
call npx cordova platform add android

echo.
echo [3/4] Building APK...
call npx cordova build android

echo.
echo [4/4] Installing ke HP...
set APK=platforms\android\app\build\outputs\apk\debug\app-debug.apk

if exist "%APK%" (
    echo APK ditemukan!
    echo Uninstall versi lama...
    adb uninstall com.fauls.minibank 2>nul
    
    echo Installing...
    adb install -r "%APK%"
    
    echo.
    echo ========================================
    echo SEKARANG CEK DI HP POCO M5:
    echo ========================================
    echo.
    echo Settings ^> Apps ^> Mini Bank
    echo.
    echo Seharusnya SEKARANG ADA PERMISSION:
    echo   - Internet
    echo   - Network state  
    echo   - WiFi state
    echo.
    echo ALLOW SEMUA PERMISSION!
    echo Lalu coba buka app!
    echo ========================================
) else (
    echo ERROR: APK tidak ditemukan!
    echo Build mungkin gagal, cek error di atas
)

pause
