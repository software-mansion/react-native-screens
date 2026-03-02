#include "pch.h"

#include "ReactPackageProvider.h"
#if __has_include("ReactPackageProvider.g.cpp")
#include "ReactPackageProvider.g.cpp"
#endif

#include "RNScreens.h"
#include "ScreenContainerViewManager.h"
#include "ScreenStackHeaderConfigViewManager.h"
#include "ScreenStackViewManager.h"
#include "ScreenViewManager.h"
#include "ScreenStackHeaderSubviewViewManager.h"
#include "ModalScreenViewManager.h"
#include "SearchBarViewManager.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::ReactNativeScreens::implementation
{

void ReactPackageProvider::CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept
{
  AddAttributedModules(packageBuilder, true);

  packageBuilder.AddViewManager(L"RNScreensViewManager", []() {
    return winrt::make<winrt::RNScreens::implementation::ScreenViewManager>();
  });

  packageBuilder.AddViewManager(L"RNScreensStackHeaderConfigViewManager", []() {
    return winrt::make<winrt::RNScreens::implementation::ScreenStackHeaderConfigViewManager>();
  });

  packageBuilder.AddViewManager(L"RNSScreenStackViewManager", []() {
    return winrt::make<winrt::RNScreens::implementation::ScreenStackViewManager>();
  });

  packageBuilder.AddViewManager(L"RNSScreenContainerViewManager", []() {
    return winrt::make<winrt::RNScreens::implementation::ScreenContainerViewManager>();
  });

  packageBuilder.AddViewManager(L"RNSScreenStackHeaderSubviewViewManager", []() {
    return winrt::make<winrt::RNScreens::implementation::ScreenStackHeaderSubviewViewManager>();
  });

  packageBuilder.AddViewManager(L"RNSModalScreenViewManager", []() {
    return winrt::make<winrt::RNScreens::implementation::ModalScreenViewManager>();
  });

  packageBuilder.AddViewManager(L"RNSSearchBar", []() {
    return winrt::make<winrt::RNScreens::implementation::SearchBarViewManager>();
  });
}

} // namespace winrt::ReactNativeScreens::implementation
