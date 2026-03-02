#include "pch.h"
#include "ModalScreenViewManager.h"
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
// IViewManager
winrt::hstring ModalScreenViewManager::Name() noexcept {
  return L"RNSModalScreen";
}


} // namespace winrt::RNScreens::implementation
