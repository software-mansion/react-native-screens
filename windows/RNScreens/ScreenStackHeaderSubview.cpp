#include "pch.h"
#include "ScreenStackHeaderSubview.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
void RegisterScreenStackHeaderSubview(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept {
  RegisterStubComponent(fabricBuilder, L"RNSScreenStackHeaderSubview");
}
} // namespace winrt::RNScreens::implementation
