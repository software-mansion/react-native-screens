#include "pch.h"
#include "ScreenStackHeaderConfig.h"
#include "JSValueXaml.h"
#include "NativeModules.h"

namespace winrt {
using namespace Microsoft::ReactNative;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Microsoft::UI;
using namespace Microsoft::UI::Xaml;
using namespace Microsoft::UI::Xaml::Controls;
} // namespace winrt

namespace winrt::RNScreens::implementation {
ScreenStackHeaderConfig::ScreenStackHeaderConfig(
    winrt::Microsoft::ReactNative::IReactContext reactContext)
    : m_reactContext(reactContext),
     m_children(
                    {winrt::single_threaded_vector<Microsoft::UI::Xaml::UIElement>()}) {}

void ScreenStackHeaderConfig::addView(winrt::Microsoft::UI::Xaml::UIElement element) {
  Children().Append(element);
}

void ScreenStackHeaderConfig::removeAllChildren() {
  Children().Clear();
}

void ScreenStackHeaderConfig::removeChildAt(int64_t index) {
  Children().RemoveAt(static_cast<uint32_t>(index));
}

void ScreenStackHeaderConfig::replaceChild(
    winrt::Microsoft::UI::Xaml::UIElement oldChild,
    winrt::Microsoft::UI::Xaml::UIElement newChild) {
  uint32_t index;
  if (!Children().IndexOf(oldChild, index))
    return;

  Children().SetAt(index, newChild);
}
} // namespace winrt::RNScreens::implementation
