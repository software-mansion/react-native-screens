#include "pch.h"
#include "SearchBar.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
using namespace winrt::Microsoft::ReactNative;

void RegisterSearchBar(
    const IReactPackageBuilderFabric &fabricBuilder) noexcept {
  fabricBuilder.AddViewComponent(
      L"RNSSearchBar",
      [](const IReactViewComponentBuilder &builder) noexcept {
        builder.SetCreateProps(
            [](
            ViewProps props,
            const IComponentProps &cloneFrom) noexcept
          -> IComponentProps {
              return winrt::make<BaseProps>(props, cloneFrom);
            });
      });
}
} // namespace winrt::RNScreens::implementation