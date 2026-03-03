#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
struct BaseProps
    : implements<BaseProps, Microsoft::ReactNative::IComponentProps> {
  BaseProps(
      Microsoft::ReactNative::ViewProps /*props*/,
      const Microsoft::ReactNative::IComponentProps & /*cloneFrom*/) noexcept {
  }

  static void SetProp(
      uint32_t /*hash*/,
      hstring /*propName*/,
      Microsoft::ReactNative::IJSValueReader /*value*/) noexcept {
  }
};

inline void RegisterStubComponent(
    const Microsoft::ReactNative::IReactPackageBuilderFabric &fabricBuilder,
    const hstring &componentName) noexcept {
  using namespace Microsoft::ReactNative;
  fabricBuilder.AddViewComponent(
      componentName,
      [](const IReactViewComponentBuilder &builder) noexcept {
        builder.SetCreateProps(
            [](
            ViewProps props,
            const IComponentProps &cloneFrom) noexcept -> IComponentProps {
              return winrt::make<BaseProps>(props, cloneFrom);
            });
        builder
            .as<Composition::IReactCompositionViewComponentBuilder>()
            .SetViewComponentViewInitializer(
                [](const ComponentView &) noexcept {
                });
      });
}
} // namespace winrt::RNScreens::implementation
