#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// Shared registration helper used by both RNSScreen and RNSModalScreen, which
// have identical native behavior on Windows. Centralizing the logic here
// prevents silent divergence from copy-paste duplication.
void RegisterScreenLike(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &
    fabricBuilder,
    const hstring &componentName) noexcept;

void RegisterScreen(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &
    fabricBuilder) noexcept;
} // namespace winrt::RNScreens::implementation
