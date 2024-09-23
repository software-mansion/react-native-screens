#pragma once
#include "NativeModules.h"
#include "winrt/Microsoft.ReactNative.h"
#include "ScreenViewManager.h"

namespace winrt::RNScreens::implementation {

class ModalScreenViewManager : public ScreenViewManager {
 public:
  ModalScreenViewManager() = default;
  winrt::hstring Name() noexcept;
};
} // namespace winrt::RNScreens::implementation
