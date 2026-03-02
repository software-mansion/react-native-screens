#pragma once
#include "Screen.h"

namespace winrt::RNScreens::implementation {
class ScreenStack
    : public winrt::Microsoft::UI::Xaml::Controls::ContentControlT<ScreenStack> {
 public:
  ScreenStack(winrt::Microsoft::ReactNative::IReactContext reactContext);
  void addScreen(Screen &screen, int64_t index);
  void removeAllChildren();
  void removeChildAt(int64_t index);
  void replaceChild(
      winrt::Microsoft::UI::Xaml::UIElement oldChild,
      winrt::Microsoft::UI::Xaml::UIElement newChild);

  winrt::Windows::Foundation::Collections::IVector<Microsoft::UI::Xaml::UIElement>
      m_children;

 private:
  void onChildModified(int64_t index);
  winrt::Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNScreens::implementation
