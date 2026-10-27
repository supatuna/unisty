@echo off
title Day code UNISTY len GitHub
echo ============================================================
echo         DAY CODE UNISTY LEN GITHUB (DUE 50K32.3)
echo ============================================================
echo.
cd /d "%~dp0"
set "PATH=%USERPROFILE%\.git-bin\cmd;%PATH%"
echo Hay tao mot repository moi tren GitHub (https://github.com/new).
echo Dat ten repository la: unisty (chon che do Public hoac Private).
echo KHONG can tich chon Add a README file vi du an da co san.
echo.
set /p REPO_URL="Dan duong link Repository cua ban vao day (vi du: https://github.com/.../unisty.git): "

if "%REPO_URL%"=="" (
    echo Ban chua nhap link! Vui long chay lai file nay.
    pause
    exit /b
)

echo.
echo [1/3] Dang cau hinh remote origin...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo [2/3] Dang kiem tra nhanh main...
git branch -M main

echo [3/3] Dang day code len GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo   THANH CONG! Code da duoc day len GitHub.
    echo   Bay gio ban co the vao Vercel.com va chon Import repo nay!
    echo ============================================================
) else (
    echo.
    echo Co loi xay ra khi day code. Hay kiem tra lai quyen truy cap GitHub hoac duong link.
)

pause
