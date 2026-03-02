#pragma once
#include "pch.h"

namespace winrt::RNScreens::implementation {

// Minimal IComponentProps implementation for Fabric components whose native
// Windows props are not yet implemented.
//
// Satisfies the SetCreateProps contract so the framework does not crash when
// delivering base ViewProps (layout, style, etc.) to stub components.
// The SetProp override intentionally ignores all custom props until a full
// implementation is written per component.
//
// TODO: Replace with a component-specific props struct for each stub once
//       native implementations of HeaderConfig, HeaderSubview, and SearchBar
//       are developed.
//
// NOTE: REACT_STRUCT is intentionally absent. That macro is only required when
//       SetProp delegates to ReadProp for field dispatch. BaseProps::SetProp is
//       a deliberate no-op, so no reflection metadata needs to be generated.
struct BaseProps
    : winrt::implements<BaseProps, winrt::Microsoft::ReactNative::IComponentProps> {
  BaseProps(
      winrt::Microsoft::ReactNative::ViewProps /*props*/,
      winrt::Microsoft::ReactNative::IComponentProps const& /*cloneFrom*/) noexcept {}

  void SetProp(
      uint32_t /*hash*/,
      winrt::hstring /*propName*/,
      winrt::Microsoft::ReactNative::IJSValueReader /*value*/) noexcept {}
};

} // namespace winrt::RNScreens::implementation
