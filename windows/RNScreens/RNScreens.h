#pragma once

#include "pch.h"
#include "resource.h"

#if __has_include("codegen/NativeRnScreensDataTypes.g.h")
#include "codegen/NativeRnScreensDataTypes.g.h"
#endif
#include "codegen/NativeScreensModuleSpec.g.h"

#include "NativeModules.h"

namespace winrt::ReactNativeScreens {

REACT_MODULE(RnScreens)

struct RnScreens {
  using ModuleSpec = ReactNativeScreensCodegen::ScreensModuleSpec;

  REACT_INIT(Initialize)
  void Initialize(const React::ReactContext &reactContext) noexcept;

  REACT_SYNC_METHOD(multiply)
  double multiply(double a, double b) noexcept;

private:
  React::ReactContext m_context;
};
} // namespace winrt::ReactNativeScreens