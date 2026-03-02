#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// Shared registration helper used by both RNSScreen and RNSModalScreen, which
// have identical native behavior on Windows. Centralizing the logic here
// prevents silent divergence from copy-paste duplication.
void RegisterScreenLike(
    winrt::Microsoft::ReactNative::IReactPackageBuilderFabric const &
    fabricBuilder,
    winrt::hstring const &componentName) noexcept;

void RegisterRNSScreen(
    winrt::Microsoft::ReactNative::IReactPackageBuilderFabric const &
    fabricBuilder) noexcept;
} // namespace winrt::RNScreens::implementation