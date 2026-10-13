@echo off
title ExcelAssessment Server - Đang chạy...
echo ==========================================
echo    KHOI DONG HE THONG EXCEL ASSESSMENT
echo ==========================================
echo.

:: Get local IP address
for /f "tokens=14" %%a in ('ipconfig ^| findstr IPv4') do set LOCAL_IP=%%a

echo [*] He thong dang duoc khoi chay.
echo [*] De moi nguoi trong mang LAN (cong ty) truy cap, hay gui cho ho duong link nay:
echo.
echo     http://%LOCAL_IP%:5200
echo.
echo ==========================================
echo Vui long KHONG tat cua so nay trong suot qua trinh thi.
echo Nhan Ctrl+C neu ban muon dung he thong.
echo ==========================================
echo.

cd /d "%~dp0"
npm run dev
