#pragma once

namespace winrt::RNScreens::implementation {
class SearchBar
    : public winrt::Windows::UI::Xaml::Controls::StackPanelT<
          SearchBar> {
 public:
  SearchBar(
      winrt::Microsoft::ReactNative::IReactContext reactContext);

 private:
  winrt::Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNScreens::implementation
