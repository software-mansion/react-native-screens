require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

def self.detect_rn_version
  begin
    # standard app layout
    # /appName/node_modules/react-native-screens/RNScreens.podspec
    # /appName/node_modules/react-native/package.json
    react_json = JSON.parse(File.read(File.join(__dir__, "..", "..", "node_modules", "react-native", "package.json")))
    react_native_version = react_json["version"]
  rescue
    begin
      # monorepo
      # /monorepo/packages/appName/node_modules/react-native-screens/RNScreens.podspec
      # /monorepo/node_modules/react-native/package.json
      react_json = JSON.parse(File.read(File.join(__dir__, "..", "..", "..", "..", "node_modules", "react-native", "package.json")))
      react_native_version = react_json["version"]
    rescue
      begin
        # Example apps in screens repo
        # /react-native-screens/RNScreens.podspec
        # /react-native-screens/node_modules/react-native/package.json
        react_json = JSON.parse(File.read(File.join(__dir__, "node_modules", "react-native", "package.json")))
        react_native_version = react_json["version"]
      rescue
        # should never happen
        react_native_version = '0.68.0'
        puts "[RNScreens] Unable to recognized your `react-native` version! Default `react-native` version: " + react_native_version
        return react_native_version
      end
    end
  end
  puts "[RNSScreens] Detected `react-native` version: #{react_native_version}"
  return react_native_version
end

react_native_version = detect_rn_version()
react_native_version_minor = react_native_version.split('.')[1]
react_native_version_flag = '-DRNS_RN_VERSION_MINOR=' + react_native_version_minor 

fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

# folly_version must match the version used in React Native
# See folly_version in react-native/React/FBReactNativeSpec/FBReactNativeSpec.podspec
folly_version = '2021.06.28.00-v2'
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "RNScreens"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  RNScreens - first incomplete navigation solution for your React Native app
                   DESC
  s.homepage     = "https://github.com/software-mansion/react-native-screens"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author       = { "author" => "author@domain.cn" }
  s.platforms    = { :ios => "9.0", :tvos => "11.0" }
  s.source       = { :git => "https://github.com/software-mansion/react-native-screens.git", :tag => "#{s.version}" }

  if fabric_enabled
    s.pod_target_xcconfig = {
      'HEADER_SEARCH_PATHS' => '"$(PODS_ROOT)/boost" "$(PODS_ROOT)/boost-for-react-native"  "$(PODS_ROOT)/RCT-Folly"',
      "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
    }
    s.platforms       = { ios: '11.0', tvos: '11.0' }
    s.compiler_flags  = react_native_version_flag + ' ' + folly_compiler_flags + ' ' + '-DRN_FABRIC_ENABLED'
    s.source_files    = 'ios/**/*.{h,m,mm,cpp}'
    s.requires_arc    = true
  
    s.dependency "React"
    s.dependency "React-RCTFabric"
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly", folly_version
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  
    s.subspec "common" do |ss|
      ss.source_files         = "common/cpp/**/*.{cpp,h}"
      ss.header_dir           = "rnscreens"
      ss.pod_target_xcconfig  = { "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/common/cpp\"" }
    end
  else 
    s.compiler_flags = react_native_version_flag
    s.source_files = "ios/**/*.{h,m,mm}"
    s.requires_arc = true
  
    s.dependency "React-Core"
    s.dependency "React-RCTImage"
  end
end
