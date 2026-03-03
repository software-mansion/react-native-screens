#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// TODO: Implement a native search bar for Windows (AutoSuggestBox or
// SearchBox control). Currently a stub — no native visual is rendered.
void RegisterRNSSearchBar(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation