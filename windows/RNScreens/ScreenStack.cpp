#include "pch.h"
#include "ScreenStack.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
void RegisterScreenStack(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept {
  RegisterStubComponent(fabricBuilder, L"RNSScreenStack");
}
} // namespace winrt::RNScreens::implementation