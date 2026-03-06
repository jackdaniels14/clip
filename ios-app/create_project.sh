#!/bin/bash

# Create Xcode project for StokeVideo iOS App
PROJECT_NAME="StokeVideo"
BUNDLE_ID="com.stokemountain.video"
PROJECT_DIR="/Users/landongriffith/stoke-video-system/ios-app"

# Navigate to project directory
cd "$PROJECT_DIR"

# Create project using xed (Xcode CLI tool) if available
# Or use xcrun to generate a basic project

# Method: Use xcrun and xcodebuild to create from template
/usr/bin/xcrun xcodebuild -project "$PROJECT_NAME.xcodeproj" 2>/dev/null && echo "Project exists" && exit 0

echo "Creating Xcode project..."

# Create the Info.plist
cat > "$PROJECT_NAME/Info.plist" << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>$(PRODUCT_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0</string>
	<key>CFBundleVersion</key>
	<string>1</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>UILaunchScreen</key>
	<dict/>
	<key>UIRequiredDeviceCapabilities</key>
	<array>
		<string>armv7</string>
	</array>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
	</array>
</dict>
</plist>
PLIST

echo "✅ Info.plist created"
echo ""
echo "Please create the Xcode project manually:"
echo "1. Open Xcode"
echo "2. File → New → Project"
echo "3. iOS → App"
echo "4. Name: StokeVideo"
echo "5. Bundle ID: com.stokemountain.video"
echo "6. Interface: SwiftUI"
echo "7. Save to: $PROJECT_DIR"

