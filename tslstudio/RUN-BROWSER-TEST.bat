@echo off
echo ========================================
echo   TSLStudio Browser Test Launcher
echo ========================================
echo.

REM Check if test file exists
if not exist "test-browser.html" (
    echo ERROR: test-browser.html not found!
    echo Please run this from tslstudio directory
    pause
    exit /b 1
)

echo Found test-browser.html
echo.
echo Opening in default browser...
echo.

REM Try to open in Chrome first (if available)
where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Opening in Chrome...
    start chrome "%~dp0test-browser.html"
    goto :success
)

REM Try Edge
where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Opening in Edge...
    start msedge "%~dp0test-browser.html"
    goto :success
)

REM Fallback to default browser
echo Opening in default browser...
start "" "%~dp0test-browser.html"

:success
echo.
echo ========================================
echo Browser test should now be open!
echo ========================================
echo.
echo WHAT TO EXPECT:
echo   - Rotating sphere with material
echo   - WebGPU status indicator
echo   - Material selection dropdown
echo   - FPS counter
echo.
echo IF YOU SEE ERRORS:
echo   1. Make sure you're using Chrome 113+ or Edge 113+
echo   2. Check if WebGPU is enabled (chrome://flags)
echo   3. Check browser console (F12) for errors
echo.
echo TO TEST ALL MATERIALS:
echo   Click the "Test All Materials" button
echo.
pause

