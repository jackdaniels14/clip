#!/bin/bash

# Script to create Xcode project for StokeVideo
# This creates a basic project structure that can be opened in Xcode

echo "🚀 Creating StokeVideo Xcode Project..."
echo ""

PROJECT_DIR="/Users/landongriffith/stoke-video-system/ios-app"
PROJECT_NAME="StokeVideo"

cd "$PROJECT_DIR"

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode is not installed or not in PATH"
    echo "Please install Xcode from the Mac App Store"
    exit 1
fi

echo "✅ Xcode found"
echo ""

# Create project using xcodebuild
echo "📦 Creating new iOS app project..."
echo "This will open Xcode to create the project."
echo ""
echo "Please configure the project with these settings:"
echo "  • Product Name: StokeVideo"
echo "  • Organization Identifier: com.stokemountain"
echo "  • Bundle Identifier: com.stokemountain.video"
echo "  • Interface: SwiftUI"
echo "  • Language: Swift"
echo ""
echo "When prompted for location, select:"
echo "  $PROJECT_DIR"
echo ""
read -p "Press Enter to open Xcode and create the project..."

# Open Xcode to create new project
open -a Xcode

echo ""
echo "⏳ Waiting for you to create the project in Xcode..."
echo ""
echo "After creating the project in Xcode:"
echo "1. Close Xcode"
echo "2. Run this script again"
echo ""
read -p "Did you create the project? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "👋 No problem! Run this script again when ready."
    exit 0
fi

# Check if project was created
if [ ! -f "$PROJECT_DIR/$PROJECT_NAME.xcodeproj/project.pbxproj" ]; then
    echo "❌ Project not found at: $PROJECT_DIR/$PROJECT_NAME.xcodeproj"
    echo "Please make sure you saved the project in the correct location."
    exit 1
fi

echo "✅ Project found!"
echo ""
echo "📝 Next steps:"
echo "1. Add GoogleService-Info.plist from Firebase Console"
echo "2. Add Firebase SDK via Swift Package Manager"
echo "3. Organize the Swift files into groups (Models, ViewModels, Views)"
echo ""
echo "See XCODE_SETUP.md for detailed instructions"
echo ""
echo "🎉 Ready to open your project in Xcode!"
read -p "Open project now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "$PROJECT_DIR/$PROJECT_NAME.xcodeproj"
    echo "✅ Xcode opened!"
else
    echo "You can open it later with:"
    echo "  open $PROJECT_DIR/$PROJECT_NAME.xcodeproj"
fi

echo ""
echo "✨ Done!"
