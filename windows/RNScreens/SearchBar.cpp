#include "pch.h"
#include "SearchBar.h"
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
SearchBar::SearchBar(
    winrt::Microsoft::ReactNative::IReactContext reactContext)
    : m_reactContext(reactContext) {}
} // namespace winrt::RNScreens::implementation
