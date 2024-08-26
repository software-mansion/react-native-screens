#pragma once

namespace winrt::RNScreens::implementation {
class ScreenStackHeaderSubview
    : public winrt::Windows::UI::Xaml::Controls::StackPanelT<
          ScreenStackHeaderSubview> {
 public:
  ScreenStackHeaderSubview(
      winrt::Microsoft::ReactNative::IReactContext m_reactContext);

 private:
  winrt::Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNScreens::implementation
