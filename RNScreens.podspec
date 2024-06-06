require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'
platform = new_arch_enabled ? "11.0" : "9.0"
source_files = new_arch_enabled ? 'ios/**/*.{h,m,mm,cpp}' : ["ios/**/*.{h,m,mm}", "cpp/**/*.{cpp,h}"]

folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

# Helper class to avoid clashing with Cocoapods install_dependencies function
class RNScreensDependencyHelper
  # Helper class to add the Common subspec
  def self.add_common_subspec(s, new_arch_enabled)
    unless new_arch_enabled
      return
    end

    s.subspec "common" do |ss|
      ss.source_files         = ["common/cpp/**/*.{cpp,h}", "cpp/**/*.{cpp,h}"]
      ss.header_dir           = "rnscreens"
      ss.pod_target_xcconfig  = { "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/common/cpp\"" }
    end
  end

  # Function to support older versions of React Native which do not provide the
  # install_modules_dependencies function
  def self.install_dependencies(s, new_arch_enabled)
    if new_arch_enabled
      s.pod_target_xcconfig = {
        'HEADER_SEARCH_PATHS' => '"$(PODS_ROOT)/boost" "$(PODS_ROOT)/boost-for-react-native"  "$(PODS_ROOT)/RCT-Folly"',
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
      }

      s.compiler_flags  = folly_compiler_flags + ' ' + '-DRCT_NEW_ARCH_ENABLED'

      s.dependency "React"
      s.dependency "React-RCTFabric"
      s.dependency "React-Codegen"
      s.dependency "RCT-Folly"
      s.dependency "RCTRequired"
      s.dependency "RCTTypeSafety"
      s.dependency "ReactCommon/turbomodule/core"

      self.add_common_subspec(s, new_arch_enabled)
    else
      s.dependency "React-Core"
      s.dependency "React-RCTImage"
    end
  end
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
  s.platforms    = { :ios => platform, :tvos => "11.0", :visionos => "1.0" }
  s.source       = { :git => "https://github.com/software-mansion/react-native-screens.git", :tag => "#{s.version}" }
  s.source_files = source_files
  s.project_header_files = "cpp/**/*.h" # Don't expose C++ headers publicly to allow importing framework into Swift files
  s.requires_arc = true

  if defined?(install_modules_dependencies()) != nil
    install_modules_dependencies(s)
    # Add missing dependencies, that were not included in install_modules_dependencies
    s.dependency "React-RCTImage"
    RNScreensDependencyHelper.add_common_subspec(s, new_arch_enabled)
  else
    RNScreensDependencyHelper.install_dependencies(s, new_arch_enabled)
  end
end
