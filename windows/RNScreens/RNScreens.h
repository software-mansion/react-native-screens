#pragma once

#include "pch.h"
#include "resource.h"

#if __has_include("codegen/NativeRnScreensDataTypes.g.h")
#include "codegen/NativeRnScreensDataTypes.g.h"
#endif
#include "codegen/NativeScreensModuleSpec.g.h"

#include "NativeModules.h"

namespace winrt::ReactNativeScreens {
// "RNSModule" must match TurboModuleRegistry.get('RNSModule') in src/fabric/NativeScreensModule.ts.
REACT_MODULE(RnScreens, L"RNSModule")

struct RnScreens {
  using ModuleSpec = ReactNativeScreensCodegen::ScreensModuleSpec;
};
} // namespace winrt::ReactNativeScreens
