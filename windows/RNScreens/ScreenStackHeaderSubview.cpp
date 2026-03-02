#include "pch.h"
#include "ScreenStackHeaderSubview.h"
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
ScreenStackHeaderSubview::ScreenStackHeaderSubview(
    winrt::Microsoft::ReactNative::IReactContext reactContext)
    : m_reactContext(reactContext),
      m_children(
               {winrt::single_threaded_vector<Microsoft::UI::Xaml::UIElement>()}) {}

void ScreenStackHeaderSubview::addView(winrt::Microsoft::UI::Xaml::UIElement element) {
  Children().Append(element);
}

void ScreenStackHeaderSubview::removeAllChildren() {
  Children().Clear();
}

void ScreenStackHeaderSubview::removeChildAt(int64_t index) {
  Children().RemoveAt(static_cast<uint32_t>(index));
}

void ScreenStackHeaderSubview::replaceChild(
    winrt::Microsoft::UI::Xaml::UIElement oldChild,
    winrt::Microsoft::UI::Xaml::UIElement newChild) {
  uint32_t index;
  if (!Children().IndexOf(oldChild, index))
    return;

  Children().SetAt(index, newChild);
}
} // namespace winrt::RNScreens::implementation
