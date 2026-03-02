#pragma once

namespace winrt::RNScreens::implementation {
class ScreenStackHeaderConfig
    : public winrt::Microsoft::UI::Xaml::Controls::StackPanelT<
          ScreenStackHeaderConfig> {
 public:
  ScreenStackHeaderConfig(
      winrt::Microsoft::ReactNative::IReactContext reactContext);

  void addView(winrt::Microsoft::UI::Xaml::UIElement element);
  void removeAllChildren();
  void removeChildAt(int64_t index);
  void replaceChild(
      winrt::Microsoft::UI::Xaml::UIElement oldChild,
      winrt::Microsoft::UI::Xaml::UIElement newChild);

  winrt::Windows::Foundation::Collections::IVector<Microsoft::UI::Xaml::UIElement>
      m_children;
 private:
  winrt::Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNScreens::implementation
