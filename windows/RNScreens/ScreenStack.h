#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
void RegisterScreenStack(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation
