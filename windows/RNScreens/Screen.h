#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// RNSScreen and RNSModalScreen share identical native behavior on Windows:
// lifecycle event forwarding and activityState-driven DComp visibility.
// RegisterScreenLike centralizes that logic; each component calls it with
// its own JS component name.
void RegisterScreenLike(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &
    fabricBuilder,
    const hstring &componentName) noexcept;

void RegisterScreen(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &
    fabricBuilder) noexcept;
} // namespace winrt::RNScreens::implementation
