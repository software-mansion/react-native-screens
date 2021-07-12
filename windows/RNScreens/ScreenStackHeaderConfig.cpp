#include "pch.h"
#include "NativeModules.h"
#include "JSValueXaml.h"
#include "ScreenStackHeaderConfig.h"

namespace winrt {
    using namespace Microsoft::ReactNative;
    using namespace Windows::Foundation;
    using namespace Windows::Foundation::Collections;
    using namespace Windows::UI;
    using namespace Windows::UI::Xaml;
    using namespace Windows::UI::Xaml::Controls;
}

namespace winrt::RNScreens::implementation {
    ScreenStackHeaderConfig::ScreenStackHeaderConfig(winrt::Microsoft::ReactNative::IReactContext reactContext)
        : m_reactContext(reactContext) {

    }
}
