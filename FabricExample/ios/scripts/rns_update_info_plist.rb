require 'plist'
require 'shellwords'

INFO_PLIST_PATH = File.expand_path('../FabricExample/Info.plist', __dir__)

def rns_add_scene_manifest_to_info_plist
  unless File.exist?(INFO_PLIST_PATH)
    puts "Info.plist not found at: #{INFO_PLIST_PATH}"
    return
  end

  plist = Plist.parse_xml(INFO_PLIST_PATH) || {}

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

  File.write(INFO_PLIST_PATH, plist.to_plist)
  system("plutil -convert xml1 #{Shellwords.escape(INFO_PLIST_PATH)}")
  puts "Added UIApplicationSceneManifest to Info.plist"
end

def rns_remove_scene_manifest_from_info_plist
  unless File.exist?(INFO_PLIST_PATH)
    puts "Info.plist not found at: #{INFO_PLIST_PATH}"
    return
  end

  plist = Plist.parse_xml(INFO_PLIST_PATH) || {}

  if plist.delete('UIApplicationSceneManifest')
    File.write(INFO_PLIST_PATH, plist.to_plist)
    system("plutil -convert xml1 #{Shellwords.escape(INFO_PLIST_PATH)}")
    puts "Removed UIApplicationSceneManifest from Info.plist"
  else
    puts "UIApplicationSceneManifest not present in Info.plist"
  end
end
