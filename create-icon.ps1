# Script untuk membuat icon placeholder jika tidak ada
Write-Host "Checking logo.png..." -ForegroundColor Yellow

$logoPath = "www\img\logo.png"

if (-not (Test-Path $logoPath)) {
    Write-Host "Logo tidak ditemukan! Membuat placeholder..." -ForegroundColor Red
    
    # Create img directory if not exists
    if (-not (Test-Path "www\img")) {
        New-Item -Path "www\img" -ItemType Directory -Force
    }
    
    # Download a simple icon or create blank
    Write-Host "Downloading icon..." -ForegroundColor Yellow
    
    # Create a simple 512x512 white PNG with text
    Add-Type -AssemblyName System.Drawing
    $bmp = New-Object System.Drawing.Bitmap 512, 512
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.Clear([System.Drawing.Color]::White)
    
    # Draw border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Blue, 10)
    $graphics.DrawRectangle($pen, 10, 10, 492, 492)
    
    # Draw text "MB"
    $font = New-Object System.Drawing.Font("Arial", 120, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Blue)
    $graphics.DrawString("MB", $font, $brush, 150, 180)
    
    # Save
    $bmp.Save($logoPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
    
    Write-Host "✅ Logo placeholder dibuat!" -ForegroundColor Green
} else {
    $size = (Get-Item $logoPath).Length
    Write-Host "✅ Logo sudah ada - Size: $size bytes" -ForegroundColor Green
}

Write-Host ""
Write-Host "Sekarang rebuild dengan:" -ForegroundColor Cyan
Write-Host "  .\fix-poco.ps1" -ForegroundColor Yellow
