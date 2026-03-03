#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {

// RNSScreenStack - stub. Child ordering and screen transitions are managed
// entirely by JS and the Fabric reconciler.
//
// The JS spec declares onFinishTransitioning (topFinishTransitioning). To
// implement it when native push/pop animations are added:
//   1. Add ScreenStackUserData storing an EventEmitter (see Screen.cpp for
//      the established pattern).
//   2. Register SetViewComponentViewInitializer + SetUpdateEventEmitterHandler.
//   3. Dispatch topFinishTransitioning at the end of each transition.
void RegisterScreenStack(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept;
} // namespace winrt::RNScreens::implementation
