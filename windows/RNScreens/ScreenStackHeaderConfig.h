#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// RNSScreenStackHeaderConfig - stub. All header rendering is performed by JS.
//
// TODO: implement native title, tint colors, and back-button control using
// WinUI NavigationView or a custom header ContentControl.
void RegisterScreenStackHeaderConfig(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation
