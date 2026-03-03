#include "pch.h"
#include "ScreenStackHeaderConfig.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
using namespace winrt::Microsoft::ReactNative;

void RegisterScreenStackHeaderConfig(
    const IReactPackageBuilderFabric &fabricBuilder) noexcept {
  fabricBuilder.AddViewComponent(
      L"RNSScreenStackHeaderConfig",
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