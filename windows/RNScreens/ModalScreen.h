#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// Delegates to RegisterScreenLike; see Screen.h for the shared behavior.
void RegisterModalScreen(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation