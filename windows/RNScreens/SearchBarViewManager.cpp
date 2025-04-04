#include "pch.h"
#include "SearchBarViewManager.h"
#include "SearchBar.h"
#include "JSValueXaml.h"
#include "NativeModules.h"

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
winrt::hstring SearchBarViewManager::Name() noexcept {
  return L"RNSSearchBar";
}

winrt::FrameworkElement SearchBarViewManager::CreateView() noexcept {
  return winrt::make<winrt::RNScreens::implementation::SearchBar>(m_reactContext);
}

// IViewManagerRequiresNativeLayout
bool SearchBarViewManager::RequiresNativeLayout() {
  return false;
}

// IViewManagerWithNativeProperties
IMapView<hstring, ViewManagerPropertyType>
SearchBarViewManager::NativeProps() noexcept {
  auto nativeProps =
      winrt::single_threaded_map<hstring, ViewManagerPropertyType>();
  return nativeProps.GetView();
}

void SearchBarViewManager::UpdateProperties(
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

// IViewManagerWithCommands
IVectorView<hstring> SearchBarViewManager::Commands() noexcept {
  auto commands = winrt::single_threaded_vector<hstring>();
  return commands.GetView();
}

void SearchBarViewManager::DispatchCommand(
    FrameworkElement const &view,
    winrt::hstring const &commandId,
    winrt::IJSValueReader const &commandArgsReader) noexcept {
  (void)view;
  (void)commandId;
  (void)commandArgsReader;
}


// IViewManagerWithExportedEventTypeConstants
ConstantProviderDelegate SearchBarViewManager::
    ExportedCustomBubblingEventTypeConstants() noexcept {
  return nullptr;
}

ConstantProviderDelegate SearchBarViewManager::
    ExportedCustomDirectEventTypeConstants() noexcept {
  return nullptr;
}

// IViewManagerWithReactContext
winrt::IReactContext SearchBarViewManager::ReactContext() noexcept {
  return m_reactContext;
}

void SearchBarViewManager::ReactContext(IReactContext reactContext) noexcept {
  m_reactContext = reactContext;
}

} // namespace winrt::RNScreens::implementation