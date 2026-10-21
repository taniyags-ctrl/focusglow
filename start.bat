@echo off
cd /d "C:\Users\senth\OneDrive\Documents\Default Project\aurafocus\out"
start /min npx serve . -l 3000 -s
timeout /t 5 /nobreak >nul
start /min "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000 --no-autoupdate
echo.
echo ============================================
echo   Server: http://localhost:3000
echo   Tunnel will print URL below...
echo ============================================
timeout /t 99999 /nobreak >nul
