require 'plist'
require 'shellwords'

def rns_add_scene_manifest_to_info_plist(info_plist_path:)
  unless File.exist?(info_plist_path)
    puts "Info.plist not found at: #{info_plist_path}"
    return
  end

  plist = Plist.parse_xml(info_plist_path) || {}

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

  File.write(info_plist_path, plist.to_plist)
  system("plutil -convert xml1 #{Shellwords.escape(info_plist_path)}")
  puts "Added UIApplicationSceneManifest to Info.plist"
end

def rns_remove_scene_manifest_from_info_plist(info_plist_path:)
  unless File.exist?(info_plist_path)
    puts "Info.plist not found at: #{info_plist_path}"
    return
  end

  plist = Plist.parse_xml(info_plist_path) || {}

  if plist.delete('UIApplicationSceneManifest')
    File.write(info_plist_path, plist.to_plist)
    system("plutil -convert xml1 #{Shellwords.escape(info_plist_path)}")
    puts "Removed UIApplicationSceneManifest from Info.plist"
  else
    puts "UIApplicationSceneManifest not present in Info.plist"
  end
end
