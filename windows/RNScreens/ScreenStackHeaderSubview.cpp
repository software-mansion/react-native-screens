#include "pch.h"
#include "ScreenStackHeaderSubview.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
using namespace winrt::Microsoft::ReactNative;

void RegisterRNSScreenStackHeaderSubview(
    const IReactPackageBuilderFabric &fabricBuilder) noexcept {
  fabricBuilder.AddViewComponent(
      L"RNSScreenStackHeaderSubview",
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