#include "pch.h"

#include "ReactPackageProvider.h"
#if __has_include("ReactPackageProvider.g.cpp")
#include "ReactPackageProvider.g.cpp"
#endif

#include "RNScreens.h"
#include "Screen.h"
#include "ModalScreen.h"
#include "ScreenStack.h"
#include "ScreenContainer.h"
#include "ScreenStackHeaderConfig.h"
#include "ScreenStackHeaderSubview.h"
#include "SearchBar.h"

using namespace winrt::Microsoft::ReactNative;
using namespace winrt::RNScreens::implementation;

namespace winrt::ReactNativeScreens::implementation {

void ReactPackageProvider::CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept {
  AddAttributedModules(packageBuilder, true);

  auto fabricBuilder = packageBuilder.try_as<IReactPackageBuilderFabric>();
  if (!fabricBuilder) return;

  RegisterRNSScreen(fabricBuilder);
  RegisterRNSModalScreen(fabricBuilder);
  RegisterRNSScreenStack(fabricBuilder);
  RegisterRNSScreenContainer(fabricBuilder);
  RegisterRNSScreenStackHeaderConfig(fabricBuilder);
  RegisterRNSScreenStackHeaderSubview(fabricBuilder);
  RegisterRNSSearchBar(fabricBuilder);
}

} // namespace winrt::ReactNativeScreens::implementation
