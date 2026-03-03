#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// RNSScreenContainer - stub. No custom props or events.
// Child visibility is controlled via activityState on each RNSScreen child,
// set by JS navigation logic and applied natively in Screen.cpp.
void RegisterScreenContainer(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation