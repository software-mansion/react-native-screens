require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNScreensApps"
  s.version      = package["version"]
  s.summary      = "Native modules of the react-native-screens example apps"
  s.homepage     = "https://github.com/software-mansion/react-native-screens"
  s.license      = "MIT"
  s.author       = "Software Mansion"
  s.platforms    = { :ios => "15.1", :tvos => "15.1" }
  s.source       = { :git => "https://github.com/software-mansion/react-native-screens.git" }
  s.source_files = "ios/**/*.{h,m,mm}"

  install_modules_dependencies(s)
end
