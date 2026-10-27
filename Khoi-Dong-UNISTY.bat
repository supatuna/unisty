@echo off
title Khoi dong UNISTY - DUE Network
echo ============================================================
echo      DANG KHOI DONG NEN TANG UNISTY (DUE NETWORK)
echo ============================================================
echo.

if exist "C:\Users\nguye\unisty" (
    cd /d "C:\Users\nguye\unisty"
) else (
    cd /d "%~dp0"
)

echo Dang khoi dong may chu Vite va mo trinh duyet...
echo.
echo ============================================================
echo Web se tu dong mo tai: http://localhost:5173/
echo (De dung web, ban chi can dong cua so nay)
echo ============================================================
echo.

if exist "%USERPROFILE%\.bun\bin\bun.exe" (
    "%USERPROFILE%\.bun\bin\bun.exe" run dev -- --open
) else (
    bun run dev -- --open
)
if %errorlevel% neq 0 (
    echo.
    echo Thu lai bang npm.cmd...
    call npm.cmd run dev -- --open
)

pause
