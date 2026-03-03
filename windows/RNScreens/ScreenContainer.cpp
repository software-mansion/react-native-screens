#include "pch.h"
#include "ScreenContainer.h"
#include "BaseProps.h"

namespace winrt::RNScreens::implementation {
using namespace winrt::Microsoft::ReactNative;

void RegisterRNSScreenContainer(
    const IReactPackageBuilderFabric &fabricBuilder) noexcept {
  fabricBuilder.AddViewComponent(
      L"RNSScreenContainer",
      [](const IReactViewComponentBuilder &builder) noexcept {
        // SetCreateProps is required: without it the framework has no handler
        // for base ViewProps (layout, style) and will crash on prop delivery.
        // BaseProps is used because ScreenContainerNativeComponent.ts defines
        // no custom props beyond ViewProps.
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