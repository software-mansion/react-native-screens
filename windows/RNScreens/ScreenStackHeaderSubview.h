#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// RNSScreenStackHeaderSubview - stub. Custom header content (left/right/title
// slots) is rendered by JS.
//
// TODO: implement native header subview hosting.
void RegisterScreenStackHeaderSubview(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation