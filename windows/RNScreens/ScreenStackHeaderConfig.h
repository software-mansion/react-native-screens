#pragma once

namespace winrt::RNScreens::implementation {
class ScreenStackHeaderConfig
    : public winrt::Windows::UI::Xaml::Controls::StackPanelT<
          ScreenStackHeaderConfig> {
 public:
  ScreenStackHeaderConfig(
      winrt::Microsoft::ReactNative::IReactContext reactContext);

  void addView(winrt::Windows::UI::Xaml::UIElement element);
  void removeAllChildren();
  void removeChildAt(int64_t index);
  void replaceChild(
      winrt::Windows::UI::Xaml::UIElement oldChild,
      winrt::Windows::UI::Xaml::UIElement newChild);

  winrt::Windows::Foundation::Collections::IVector<Windows::UI::Xaml::UIElement>
      m_children;
 private:
  winrt::Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNScreens::implementation
