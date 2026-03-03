#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {
// Placeholder IComponentProps for Fabric components that have no custom native
// props on Windows yet. Satisfies the SetCreateProps contract so the framework
// can deliver base ViewProps (layout, style) without crashing.
//
// REACT_STRUCT is omitted - that macro generates ReadProp dispatch metadata,
// which is only needed when SetProp delegates to ReadProp. Here SetProp is a
// deliberate no-op, so the metadata would be dead weight.
//
// TODO: replace with a component-specific props struct for each stub as native
// implementations are developed.
struct BaseProps
    : implements<BaseProps, Microsoft::ReactNative::IComponentProps> {
  BaseProps(
      Microsoft::ReactNative::ViewProps /*props*/,
      const Microsoft::ReactNative::IComponentProps & /*cloneFrom*/) noexcept {
  }

  void SetProp(
      uint32_t /*hash*/,
      hstring /*propName*/,
      Microsoft::ReactNative::IJSValueReader /*value*/) noexcept {
  }
};

// Registers a Fabric component that requires no per-instance state, custom
// props, events, or visual overrides. Satisfies two required registration
// contracts:
//
//   SetCreateProps - required so the framework can construct a props object
//     when base ViewProps (layout, style) are delivered. Without it, the
//     framework crashes on the first prop update.
//
//   SetViewComponentViewInitializer - required even when no per-instance
//     initialization is needed; the framework asserts on mount without it.
//
// To graduate a component from stub to real implementation, replace the
// RegisterStubComponent call in its .cpp with a full AddViewComponent block
// using a concrete props struct and whatever subset of
// SetUpdatePropsHandler / SetUpdateEventEmitterHandler / SetCreateVisualHandler
// the component needs. See Screen.cpp for the established pattern.
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
