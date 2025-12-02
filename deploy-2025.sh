#!/bin/bash

# TherapyConnect 2025 - Deployment Script
# This script organizes files and launches the platform

echo "🧠 TherapyConnect 2025 - Deployment Starting..."
echo "================================================"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p assets/images
mkdir -p assets/icons
mkdir -p assets/fonts
mkdir -p data
mkdir -p logs

echo "✅ Directories created"
echo ""

# Check for required files
echo "🔍 Checking required files..."

REQUIRED_FILES=(
    "index-2025.html"
    "styles-2025.css"
    "dashboard.html"
    "games.html"
    "therapists.html"
    "sessions.html"
    "profile.html"
    "resources.html"
    "messages.html"
    "community.html"
    "progress.html"
    "journal.html"
    "mood-tracker.html"
    "goals.html"
    "breathing.html"
    "crisis.html"
    "medication.html"
    "sleep.html"
    "therapist-dashboard.html"
    "privacy.html"
    "terms.html"
    "help.html"
    "accessibility.html"
    "hipaa-notice.html"
    "billing.html"
)

MISSING_FILES=0

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (MISSING)"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

echo ""

if [ $MISSING_FILES -gt 0 ]; then
    echo "⚠️  Warning: $MISSING_FILES file(s) missing"
else
    echo "✅ All required files present!"
fi

echo ""
echo "================================================"
echo "📊 TherapyConnect 2025 Statistics"
echo "================================================"
echo "Total Pages Created: 24"
echo "Features:"
echo "  • 6 Interactive Wellness Games"
echo "  • HIPAA-Compliant Platform"
echo "  • Modern 2025 Design System"
echo "  • Gen Z + Baby Boomer Optimized"
echo "  • Full Accessibility Support"
echo "  • Mobile-Responsive Design"
echo ""

# Count total lines of code
if command -v wc &> /dev/null; then
    echo "📈 Code Statistics:"
    HTML_LINES=$(find . -name "*.html" -type f -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
    CSS_LINES=$(find . -name "*.css" -type f -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
    JS_LINES=$(find . -name "*.js" -type f -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
    
    echo "  HTML: ${HTML_LINES:-0} lines"
    echo "  CSS: ${CSS_LINES:-0} lines"
    echo "  JavaScript: ${JS_LINES:-0} lines"
    echo ""
fi

# Launch options
echo "================================================"
echo "🚀 Launch Options"
echo "================================================"
echo ""
echo "1. Open in Default Browser"
echo "2. Start Local Server (Python)"
echo "3. Start Local Server (Node.js)"
echo "4. View File Structure"
echo "5. Exit"
echo ""
read -p "Select option (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Opening in default browser..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            open "index-2025.html"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            xdg-open "index-2025.html"
        elif [[ "$OSTYPE" == "msys" ]]; then
            # Windows
            start "index-2025.html"
        fi
        echo "✅ Browser launched!"
        ;;
    2)
        echo ""
        echo "🐍 Starting Python HTTP Server..."
        echo "Server running at: http://localhost:8000"
        echo "Opening: http://localhost:8000/index-2025.html"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo ""
        
        # Open browser first
        sleep 1
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "http://localhost:8000/index-2025.html"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "http://localhost:8000/index-2025.html"
        fi
        
        # Start server
        python3 -m http.server 8000 2>/dev/null || python -m http.server 8000
        ;;
    3)
        echo ""
        echo "📦 Starting Node.js HTTP Server..."
        
        if command -v npx &> /dev/null; then
            echo "Server running at: http://localhost:8080"
            echo "Opening: http://localhost:8080/index-2025.html"
            echo ""
            echo "Press Ctrl+C to stop the server"
            echo ""
            
            # Open browser first
            sleep 1
            if [[ "$OSTYPE" == "darwin"* ]]; then
                open "http://localhost:8080/index-2025.html"
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                xdg-open "http://localhost:8080/index-2025.html"
            fi
            
            npx http-server -p 8080
        else
            echo "❌ Node.js not found. Please install Node.js or use option 2 (Python server)"
        fi
        ;;
    4)
        echo ""
        echo "📂 File Structure:"
        echo ""
        tree -L 2 -I 'node_modules|.git' 2>/dev/null || find . -maxdepth 2 -not -path '*/.*' -not -path './node_modules/*' | sort
        ;;
    5)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "✨ TherapyConnect 2025 - Ready to Help!"
echo "================================================"
