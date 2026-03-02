#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {

// TODO: Implement native header configuration for Windows (title text, tint
// colors, back-button visibility, etc.).
// Currently a stub — all header rendering is performed by JS.
void RegisterRNSScreenStackHeaderConfig(
    winrt::Microsoft::ReactNative::IReactPackageBuilderFabric const& fabricBuilder) noexcept;

} // namespace winrt::RNScreens::implementation
