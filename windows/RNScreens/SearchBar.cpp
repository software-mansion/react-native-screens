#include "pch.h"
#include "SearchBar.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {

using namespace winrt::Microsoft::ReactNative;

void RegisterRNSSearchBar(IReactPackageBuilderFabric const& fabricBuilder) noexcept {
  fabricBuilder.AddViewComponent(
      L"RNSSearchBar",
      [](IReactViewComponentBuilder const& builder) noexcept {
        builder.SetCreateProps(
            [](ViewProps props, IComponentProps const& cloneFrom) noexcept
            -> IComponentProps {
              return winrt::make<BaseProps>(props, cloneFrom);
            });
      });
}

} // namespace winrt::RNScreens::implementation
