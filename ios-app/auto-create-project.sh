#!/bin/bash

echo "🚀 Automated Xcode Project Creation"
echo ""
echo "I'll open Xcode with instructions..."
echo ""

# Create a helper file with all the settings
cat > /tmp/xcode-project-settings.txt << 'SETTINGS'
XCODE PROJECT SETTINGS - Copy & Paste These:

Product Name: StokeVideo
Team: (Select your team or None)
Organization Identifier: com.stokemountain
Bundle Identifier: com.stokemountain.video
Interface: SwiftUI
Language: Swift
Storage: None

Save Location: /Users/landongriffith/stoke-video-system/ios-app/

IMPORTANT: UNCHECK "Create Git repository"
SETTINGS

# Open the settings file and Xcode
open /tmp/xcode-project-settings.txt
sleep 1
open -a Xcode

echo "📋 Settings file opened - you can copy/paste from it!"
echo "📱 Xcode is opening..."
echo ""
echo "In Xcode:"
echo "1. Click 'Create a new Xcode project'"
echo "2. Select iOS → App → Next"
echo "3. Copy settings from the text file that opened"
echo "4. Choose the save location shown above"
echo "5. UNCHECK 'Create Git repository'"
echo "6. Click Create"
echo ""
echo "Once created, come back here and press Enter..."
read -p "Press Enter when you've created the project in Xcode..."

# Check if project was created
if [ -d "/Users/landongriffith/stoke-video-system/ios-app/StokeVideo.xcodeproj" ]; then
    echo "✅ Project created successfully!"
    echo ""
    echo "Opening project in Xcode..."
    open /Users/landongriffith/stoke-video-system/ios-app/StokeVideo.xcodeproj
    echo ""
    echo "Next steps:"
    echo "1. Download GoogleService-Info.plist from Firebase Console"
    echo "2. Drag it into your Xcode project"
    echo "3. Add Firebase SDK (File → Add Package Dependencies)"
    echo "4. See XCODE_SETUP.md for details"
else
    echo "❌ Project not found. Please try again."
    echo "Make sure you save it to: /Users/landongriffith/stoke-video-system/ios-app/"
fi
