@echo off
title Khoi dong UNISTY - DUE Network
echo ============================================================
echo      DANG KHOI DONG NEN TANG UNISTY (DUE NETWORK)
echo ============================================================
echo.

cd /d "C:\Users\Phuong Thao\.gemini\antigravity\scratch\unisty"

echo [1/2] Dang mo trinh duyet web...
timeout /t 1 /nobreak >nul
start http://localhost:5173/

echo [2/2] Dang khoi dong may chu Vite...
echo.
echo ============================================================
echo Web dang chay tai: http://localhost:5173/
echo (De dung web, ban chi can dong cua so nay)
echo ============================================================
echo.

"C:\Users\Phuong Thao\.bun\bin\bun.exe" run dev
if %errorlevel% neq 0 (
    echo.
    echo Thu lai bang npm.cmd...
    call npm.cmd run dev
)

pause
