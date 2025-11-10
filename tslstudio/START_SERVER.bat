@echo off
cd /d "%~dp0"
echo ============================================
echo Starting TSLStudio Dev Server...
echo ============================================
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Starting Vite dev server...
echo.
echo Server will be available at:
echo   http://localhost:5173/examples/
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.
call npm run dev
pause

