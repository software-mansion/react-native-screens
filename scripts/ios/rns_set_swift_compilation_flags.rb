require 'xcodeproj'

def rns_set_swift_active_compilation_flag(project_path:, flag:)
  app_project = Xcodeproj::Project.open(project_path)

  app_project.build_configurations.each do |config|
    key = 'SWIFT_ACTIVE_COMPILATION_CONDITIONS'
    flags = config.build_settings[key] || ''
    flags_list = flags.split(' ')

    unless flags_list.include?(flag)
      flags_list << flag
    end

    config.build_settings[key] = flags_list.uniq.join(' ')
    puts "Added #{flag} for '#{config.name}'"
  end

  app_project.save
end

def rns_unset_swift_active_compilation_flag(project_path:, flag:)
  app_project = Xcodeproj::Project.open(project_path)

  app_project.build_configurations.each do |config|
    key = 'SWIFT_ACTIVE_COMPILATION_CONDITIONS'
    flags = config.build_settings[key] || ''
    flags_list = flags.split(' ')

    if flags_list.delete(flag)
      puts "Removed #{flag} from '#{config.name}'"
    end

    config.build_settings[key] = flags_list.join(' ')
  end

  app_project.save
end
