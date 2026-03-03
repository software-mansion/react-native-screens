#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// RNSSearchBar - stub. No native visual is rendered.
//
// TODO: implement using WinUI AutoSuggestBox; wire search text and cancel
// events through a SearchBarUserData event emitter.
void RegisterSearchBar(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation
