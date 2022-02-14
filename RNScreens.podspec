require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED']

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
      'HEADER_SEARCH_PATHS' => '"$(PODS_ROOT)/boost" "$(PODS_ROOT)/boost-for-react-native"  "$(PODS_ROOT)/RCT-Folly"'
    }
    s.platforms       = { ios: '11.0', tvos: '11.0' }
    s.compiler_flags  = folly_compiler_flags
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
    s.source_files = "ios/**/*.{h,m}"
    s.requires_arc = true
  
    s.dependency "React-Core"
    s.dependency "React-RCTImage"
  end
end
