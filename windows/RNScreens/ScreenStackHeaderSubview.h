#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// TODO: Implement native header subview rendering for Windows (left/right/
// center button slots in the navigation bar).
// Currently a stub — subview content is rendered by JS.
void RegisterRNSScreenStackHeaderSubview(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation