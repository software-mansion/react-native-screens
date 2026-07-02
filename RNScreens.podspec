require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

gamma_project_enabled = ENV['RNS_GAMMA_ENABLED'] == '1'
debug_logging_enabled = ENV['RNS_DEBUG_LOGGING'] == '1'
use_cxxbridge = ENV['RNS_USE_CXXBRIDGE'] == '1'


source_files_exts = '{h,m,mm,cpp,swift}'
source_files = ["ios/**/*.#{source_files_exts}"]

min_supported_ios_version = "15.1"
min_supported_tvos_version = "15.1"
min_supported_visionos_version = "1.0"

rnscreens_cpp_flags = []
rnscreens_swift_flags = []

if debug_logging_enabled
  rnscreens_cpp_flags << "-DRNS_DEBUG_LOGGING=1"
  rnscreens_swift_flags << "-DRNS_DEBUG_LOGGING"
end
rnscreens_cpp_flags << "-DRNS_GAMMA_ENABLED=1" if gamma_project_enabled
rnscreens_cpp_flags << "-DRNS_USE_CXXBRIDGE=1" if use_cxxbridge

rnscreens_config  =  {
  'OTHER_CPLUSPLUSFLAGS' => rnscreens_cpp_flags.join(" "),
  'OTHER_SWIFT_FLAGS' => rnscreens_swift_flags.join(" ")
}

if gamma_project_enabled
  # This setting is required to make Swift code build. However we have 
  # dependency on `React-RCTImage` pod, which does not set `DEFINES_MODULE` 
  # and therefore it fails to build. Currently we do patch react-native source
  # code to make it work & the fix is already merged, however it'll be most likely released 
  # with 0.81. We can not expect users to patch the react-native sources, thus 
  # we can not have Swift code in stable package. 
  rnscreens_config['DEFINES_MODULE'] = 'YES'
end

Pod::Spec.new do |s|
  s.name         = "RNScreens"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  RNScreens - first incomplete navigation solution for your React Native app
                   DESC
  s.homepage     = "https://github.com/software-mansion/react-native-screens"
  s.license      = "MIT"
  s.author       = { "author" => "author@domain.cn" }
  s.platforms    = { :ios => min_supported_ios_version, :tvos => min_supported_tvos_version, :visionos => min_supported_visionos_version }
  s.source       = { :git => "https://github.com/software-mansion/react-native-screens.git", :tag => "#{s.version}" }
  s.source_files = source_files
  s.project_header_files = "ios/bridging/Swift-Bridging.h"
  s.requires_arc = true

  if !gamma_project_enabled
    s.exclude_files = "ios/gamma/**/*.#{source_files_exts}"
  else
    s.exclude_files = "ios/stubs/**/*.#{source_files_exts}"
    Pod::UI.puts "[RNScreens] Gamma project enabled. Including source files."
  end

  if debug_logging_enabled
    Pod::UI.puts "[RNScreens] Debug logging enabled."
  end

  s.pod_target_xcconfig = rnscreens_config

  install_modules_dependencies(s)
  s.subspec "common" do |ss|
    ss.source_files         = ["common/cpp/**/*.{cpp,h}", "cpp/**/*.{cpp,h}"]
    ss.project_header_files = "common/cpp/**/*.h", "cpp/**/*.h" # Don't expose C++ headers publicly to allow importing framework into Swift files
    ss.header_dir           = "rnscreens"
    ss.pod_target_xcconfig  = { "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/common/cpp\"" }
  end

  s.dependency "React-RCTImage"
end
