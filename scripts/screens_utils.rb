def rnscreens_find_react_native_minor_version
  react_native_path = rnscreens_resolve_react_native_path_from_node || rnscreens_resolve_react_native_path_from_env

  unless react_native_path
    raise '[RNScreens] Unable to determine your `react-native` version. Please set environment variable: export REACT_NATIVE_NODE_MODULES_DIR="/path/to/node_modules/react-native" && pod install'
  end

  react_native_json = rnscreens_parse_react_native_package_json(react_native_path)
  version_string = react_native_json['version']
  minor_version = version_string.split('.')[1].to_i
  minor_version.zero? ? 1000 : minor_version
end

private

def rnscreens_parse_react_native_package_json(node_modules_dir)
  react_native_package_json_path = File.join(node_modules_dir, 'react-native/package.json')
  if !File.exist?(react_native_package_json_path)
    return nil
  end
  return JSON.parse(File.read(react_native_package_json_path))
end

def rnscreens_resolve_react_native_path_from_node
  package_json_path = `cd "#{Pod::Config.instance.installation_root}" && node --print "require.resolve('react-native/package.json')"` rescue nil
  return nil if package_json_path.nil? || package_json_path.strip.empty?
  File.expand_path('..', File.dirname(package_json_path.strip))
end

def rnscreens_resolve_react_native_path_from_env
  env_path = ENV['REACT_NATIVE_NODE_MODULES_DIR']
  return nil if env_path.nil? || env_path.strip.empty?
  env_path.strip
end