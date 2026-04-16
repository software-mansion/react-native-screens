#pragma once

#include "ReactPackageProvider.g.h"

namespace winrt::ReactNativeScreens::implementation {
struct ReactPackageProvider : ReactPackageProviderT<ReactPackageProvider> {
  ReactPackageProvider() = default;

  void CreatePackage(
      const Microsoft::ReactNative::IReactPackageBuilder &packageBuilder)
      noexcept;
};
} // namespace winrt::ReactNativeScreens::implementation

namespace winrt::ReactNativeScreens::factory_implementation {
struct ReactPackageProvider
    : ReactPackageProviderT<ReactPackageProvider,
                            implementation::ReactPackageProvider> {
};
} // namespace winrt::ReactNativeScreens::factory_implementation
