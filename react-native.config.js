module.exports = {
  spm: {
    name: 'RNScreens',
  },
  dependency: {
    platforms: {
      android: {
        componentDescriptors: [
          "RNSFullWindowOverlayComponentDescriptor",
          "RNSScreenContainerComponentDescriptor",
          "RNSScreenNavigationContainerComponentDescriptor",
          "RNSScreenStackHeaderConfigComponentDescriptor",
          "RNSScreenStackHeaderSubviewComponentDescriptor",
          "RNSScreenStackComponentDescriptor",
          "RNSSearchBarComponentDescriptor",
          'RNSScreenComponentDescriptor',
          "RNSScreenFooterComponentDescriptor",
          "RNSScreenContentWrapperComponentDescriptor",
          'RNSModalScreenComponentDescriptor',
          'RNSTabsHostComponentDescriptor',
          'RNSSafeAreaViewComponentDescriptor',
          'RNSStackScreenComponentDescriptor',
          'RNSStackHeaderConfigComponentDescriptor',
          'RNSStackHeaderSubviewComponentDescriptor',
          'RNSFormSheetHostComponentDescriptor'
        ],
        cmakeListsPath: "../android/src/main/jni/CMakeLists.txt"
      },
    },
  },
};
