#include "pch.h"
#include "ScreenStackHeaderConfig.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
void RegisterScreenStackHeaderConfig(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept {
  RegisterStubComponent(fabricBuilder, L"RNSScreenStackHeaderConfig");
}
} // namespace winrt::RNScreens::implementation
