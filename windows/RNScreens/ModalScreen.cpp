#include "pch.h"
#include "ModalScreen.h"
#include "Screen.h"

namespace winrt::RNScreens::implementation {
using namespace winrt::Microsoft::ReactNative;

// RNSModalScreen shares identical native behavior with RNSScreen on Windows.
// Both components are containers whose screen-level semantics (presentation
// style, animation) are managed by JS; the native side only needs to forward
// lifecycle events.
void RegisterModalScreen(
    const IReactPackageBuilderFabric &fabricBuilder) noexcept {
  RegisterScreenLike(fabricBuilder, L"RNSModalScreen");
}
} // namespace winrt::RNScreens::implementation
