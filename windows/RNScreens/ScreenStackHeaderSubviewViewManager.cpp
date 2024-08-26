#include "pch.h"
#include "ScreenStackHeaderSubviewViewManager.h"
#include "JSValueXaml.h"
#include "NativeModules.h"
#include "ScreenStackHeaderSubview.h"

namespace winrt {
using namespace Microsoft::ReactNative;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::UI;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
} // namespace winrt

namespace winrt::RNScreens::implementation {
// IViewManager
winrt::hstring ScreenStackHeaderSubviewViewManager::Name() noexcept {
  return L"RNSScreenStackHeaderSubview";
}

winrt::FrameworkElement
ScreenStackHeaderSubviewViewManager::CreateView() noexcept {
  return winrt::make<ScreenStackHeaderSubview>(m_reactContext);
}

// IViewManagerRequiresNativeLayout
bool ScreenStackHeaderSubviewViewManager::RequiresNativeLayout() {
  return true;
}

// IViewManagerWithReactContext
winrt::IReactContext
ScreenStackHeaderSubviewViewManager::ReactContext() noexcept {
  return m_reactContext;
}

void ScreenStackHeaderSubviewViewManager::ReactContext(
    IReactContext reactContext) noexcept {
  m_reactContext = reactContext;
}

// IViewManagerWithNativeProperties
IMapView<hstring, ViewManagerPropertyType>
ScreenStackHeaderSubviewViewManager::NativeProps() noexcept {
  auto nativeProps =
      winrt::single_threaded_map<hstring, ViewManagerPropertyType>();
  return nativeProps.GetView();
}

void ScreenStackHeaderSubviewViewManager::UpdateProperties(
    FrameworkElement const &view,
    IJSValueReader const &propertyMapReader) noexcept {
  (void)view;
  const JSValueObject &propertyMap = JSValue::ReadObjectFrom(propertyMapReader);
  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;
    (void)propertyName;
    (void)propertyValue;
  }
}

// IViewManagerWithExportedEventTypeConstants
ConstantProviderDelegate ScreenStackHeaderSubviewViewManager::
    ExportedCustomBubblingEventTypeConstants() noexcept {
  return nullptr;
}

ConstantProviderDelegate ScreenStackHeaderSubviewViewManager::
    ExportedCustomDirectEventTypeConstants() noexcept {
  return nullptr;
}

// IViewManagerWithCommands
IVectorView<hstring> ScreenStackHeaderSubviewViewManager::Commands() noexcept {
  auto commands = winrt::single_threaded_vector<hstring>();
  return commands.GetView();
}

void ScreenStackHeaderSubviewViewManager::DispatchCommand(
    FrameworkElement const &view,
    winrt::hstring const &commandId,
    winrt::IJSValueReader const &commandArgsReader) noexcept {
  (void)view;
  (void)commandId;
  (void)commandArgsReader;
}
} // namespace winrt::RNScreens::implementation
