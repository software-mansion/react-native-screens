#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// RNSScreenContainer has no custom props (ScreenContainerNativeComponent.ts
// declares `interface NativeProps extends ViewProps {}`) and no events.
// Child visibility is managed entirely by JS and the Fabric reconciler.
void RegisterScreenContainer(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation