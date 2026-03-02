#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {

// RNSScreenContainer has no custom props (ScreenContainerNativeComponent.ts
// declares `interface NativeProps extends ViewProps {}`) and no events.
// Child visibility is managed entirely by JS and the Fabric reconciler.
void RegisterRNSScreenContainer(
    winrt::Microsoft::ReactNative::IReactPackageBuilderFabric const& fabricBuilder) noexcept;

} // namespace winrt::RNScreens::implementation
