#!/usr/bin/env bash

set -eox pipefail

# Convert FabricExample to a tvOS app

echo "Modifying storyboard..."

sed -i '' 's/com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB/com.apple.InterfaceBuilder.AppleTV.Storyboard/g;' FabricExample/ios/FabricExample/LaunchScreen.storyboard
sed -i '' 's/iOS.CocoaTouch/AppleTV/g;' FabricExample/ios/FabricExample/LaunchScreen.storyboard
sed -i '' 's/retina4_7/AppleTV/g;' FabricExample/ios/FabricExample/LaunchScreen.storyboard

echo "Modifying Xcode project..."

sed -i '' 's/\"1,2\"/3/g;' FabricExample/ios/FabricExample.xcodeproj/project.pbxproj
sed -i '' 's/IPHONEOS_DEPLOYMENT_TARGET/TVOS_DEPLOYMENT_TARGET/g;' FabricExample/ios/FabricExample.xcodeproj/project.pbxproj
sed -i '' 's/iphoneos/appletvos/g;' FabricExample/ios/FabricExample.xcodeproj/project.pbxproj
sed -i '' 's/iphonesimulator/appletvsimulator/g;' FabricExample/ios/FabricExample.xcodeproj/project.pbxproj

echo "Modifying Podfile..."

sed -i '' 's/:ios/:tvos/g;' FabricExample/ios/Podfile

echo "Set correct react-native dependency..."

node scripts/set-tvos-example-dependencies.js

echo "Remove any existing lock files and generated files from FabricExample..."

rm -rf FabricExample/ios/Podfile.lock
rm -rf FabricExample/ios/Pods
rm -rf FabricExample/ios/build
rm -rf FabricExample/node_modules

echo "Done."
