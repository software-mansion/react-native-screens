#pragma once

#include "ReactPackageProvider.g.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::ReactNativeScreens::implementation
{

struct ReactPackageProvider : ReactPackageProviderT<ReactPackageProvider>
{
  ReactPackageProvider() = default;

  void CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept;
};

} // namespace winrt::ReactNativeScreens::implementation

namespace winrt::ReactNativeScreens::factory_implementation
{

struct ReactPackageProvider : ReactPackageProviderT<ReactPackageProvider, implementation::ReactPackageProvider> {};

} // namespace winrt::ReactNativeScreens::factory_implementation
