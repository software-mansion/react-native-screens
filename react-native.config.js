module.exports = {
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
          'RNSBottomTabsComponentDescriptor',
          'RNSSafeAreaViewComponentDescriptor'
        ],
        cmakeListsPath: "../android/src/main/jni/CMakeLists.txt"
      },
    },
  },
};
