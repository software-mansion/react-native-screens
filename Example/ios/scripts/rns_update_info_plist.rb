require 'plist'
require 'shellwords'

def rns_update_info_plist
  plist_path = File.expand_path('../Example/Info.plist', __dir__)

  unless File.exist?(plist_path)
    puts "Info.plist not found at: #{plist_path}"
    return
  end

  use_scene_delegate = ENV['RNS_USE_SCENE_DELEGATE'] == '1'

  unless use_scene_delegate
    return
  end

  plist = Plist.parse_xml(plist_path) || {}

  scene_manifest = {
    'UIApplicationSupportsMultipleScenes' => true,
    'UISceneConfigurations' => {
      'UIWindowSceneSessionRoleApplication' => [
        {
          'UISceneConfigurationName' => 'Default Configuration',
          'UISceneDelegateClassName' => '$(PRODUCT_MODULE_NAME).SceneDelegate'
        }
      ]
    }
  }

  plist['UIApplicationSceneManifest'] = scene_manifest

  File.write(plist_path, plist.to_plist)

  system("plutil -convert xml1 #{Shellwords.escape(plist_path)}")

  puts "UIApplicationSceneManifest inserted into Info.plist."
end
