#include "pch.h"
#include "ScreenContainer.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
void RegisterScreenContainer(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept {
  RegisterStubComponent(fabricBuilder, L"RNSScreenContainer");
}
} // namespace winrt::RNScreens::implementation