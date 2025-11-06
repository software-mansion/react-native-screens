def rns_update_info_plist
  plist_path = File.expand_path('../FabricExample/Info.plist', __dir__)

  unless File.exist?(plist_path)
    puts "Info.plist not found at: #{plist_path}"
    return
  end

  content = File.read(plist_path)
  value = ENV['RNS_USE_SCENE_DELEGATE'] == '1' ? '<true/>' : '<false/>'

  key_tag = 'UIApplicationSupportsMultipleScenes'

  if content.sub!(/<key>#{key_tag}<\/key>\s*<(true|false)\/>/, "<key>#{key_tag}</key>\n#{value}")
    puts "Updated existing #{key_tag} to #{value}"
  else
    puts "Some error occurred when updating #{key_tag} to #{value}"
  end

  File.write(plist_path, content)
end
