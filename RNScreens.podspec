require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

gamma_project_enabled = ENV['RNS_GAMMA_ENABLED'] == '1'
new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

source_files_exts = new_arch_enabled ? '{h,m,mm,cpp,swift}' : '{h,m,mm,swift}'
source_files = ["ios/**/*.#{source_files_exts}"]

if !new_arch_enabled
  source_files.push("cpp/RNScreensTurboModule.cpp", "cpp/RNScreensTurboModule.h")
end

min_supported_ios_version = new_arch_enabled ? "15.1" : "15.1"
min_supported_tvos_version = "15.1"
min_supported_visionos_version = "1.0"

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

  if gamma_project_enabled
    # This setting is required to make Swift code build. However we have 
    # dependency on `React-RCTImage` pod, which does not set `DEFINES_MODULE` 
    # and therefore it fails to build. Currently we do patch react-native source
    # code to make it work & the fix is already merged, however it'll be most likely released 
    # with 0.81. We can not expect users to patch the react-native sources, thus 
    # we can not have Swift code in stable package. 
    s.pod_target_xcconfig = {
      'DEFINES_MODULE' => 'YES',
      'OTHER_CPLUSPLUSFLAGS' => '-DRNS_GAMMA_ENABLED=1'
    }
  end

  install_modules_dependencies(s)
  if new_arch_enabled
    s.subspec "common" do |ss|
      ss.source_files         = ["common/cpp/**/*.{cpp,h}", "cpp/**/*.{cpp,h}"]
      ss.project_header_files = "common/cpp/**/*.h", "cpp/**/*.h" # Don't expose C++ headers publicly to allow importing framework into Swift files
      ss.header_dir           = "rnscreens"
      ss.pod_target_xcconfig  = { "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/common/cpp\"" }
    end
  end

  s.dependency "React-RCTImage"
end
