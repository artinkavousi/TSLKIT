#!/bin/bash

echo "========================================"
echo "  TSLStudio Browser Test Launcher"
echo "========================================"
echo ""

# Check if test file exists
if [ ! -f "test-browser.html" ]; then
    echo "❌ ERROR: test-browser.html not found!"
    echo "Please run this from tslstudio directory"
    exit 1
fi

echo "✅ Found test-browser.html"
echo ""
echo "🚀 Opening in browser..."
echo ""

# Detect OS and open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open test-browser.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v google-chrome &> /dev/null; then
        google-chrome test-browser.html
    elif command -v chromium-browser &> /dev/null; then
        chromium-browser test-browser.html
    elif command -v firefox &> /dev/null; then
        firefox test-browser.html
    else
        xdg-open test-browser.html
    fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Git Bash on Windows
    start test-browser.html
else
    echo "⚠️  Unknown OS, trying default opener..."
    xdg-open test-browser.html 2>/dev/null || open test-browser.html 2>/dev/null || start test-browser.html
fi

echo ""
echo "========================================"
echo "✅ Browser test should now be open!"
echo "========================================"
echo ""
echo "📋 WHAT TO EXPECT:"
echo "   • Rotating sphere with material"
echo "   • WebGPU status indicator"
echo "   • Material selection dropdown"
echo "   • FPS counter"
echo ""
echo "🐛 IF YOU SEE ERRORS:"
echo "   1. Use Chrome 113+ or Edge 113+"
echo "   2. Enable WebGPU (chrome://flags)"
echo "   3. Check browser console (F12)"
echo ""
echo "🧪 TO TEST ALL MATERIALS:"
echo "   Click the 'Test All Materials' button"
echo ""

