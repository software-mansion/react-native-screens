#include "pch.h"
#include "SearchBar.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
void RegisterSearchBar(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder)
  noexcept {
  RegisterStubComponent(fabricBuilder, L"RNSSearchBar");
}
} // namespace winrt::RNScreens::implementation
