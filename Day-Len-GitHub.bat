@echo off
title Day code UNISTY len GitHub
echo ============================================================
echo         DAY CODE UNISTY LEN GITHUB (DUE 50K32.3)
echo ============================================================
echo.
cd /d "C:\Users\nguye\unisty"
set "PATH=%USERPROFILE%\.git-bin\cmd;%PATH%"

git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Hay nhap link repository GitHub cua ban:
    set /p REPO_URL="Link (vi du: https://github.com/supatuna/unisty.git): "
    if "%REPO_URL%"=="" (
        echo Ban chua nhap link!
        pause
        exit /b
    )
    git remote add origin %REPO_URL%
)

echo Dang su dung Remote:
git remote -v
echo.
echo Dang kiem tra nhanh main...
git branch -M main

echo.
echo [1/2] Dang kiem tra cac file va commit...
git add .
git commit -m "feat: synchronize Supabase Cloud, Escrow top-up/withdrawal, VietQR memo, and changelog" >nul 2>&1

echo.
echo [2/2] Dang day code len GitHub (origin/main)...
echo (Luu y: Neu trinh duyet bat len cua so GitHub, hay bam 'Authorize' de cap quyen)
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo   THANH CONG! Toan bo code va LICHSU_CHINHSUA.md da len GitHub.
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo   Chua day duoc! Hay kiem tra ket noi mang hoac tai khoan GitHub.
    echo ============================================================
)

pause
