#include "pch.h"
#include "ScreenStackHeaderConfigViewManager.h"
#include "JSValueXaml.h"
#include "NativeModules.h"
#include "ScreenStackHeaderConfig.h"

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
winrt::hstring ScreenStackHeaderConfigViewManager::Name() noexcept {
  return L"RNSScreenStackHeaderConfig";
}

winrt::FrameworkElement
ScreenStackHeaderConfigViewManager::CreateView() noexcept {
  return winrt::make<ScreenStackHeaderConfig>(m_reactContext);
}

// IViewManagerRequiresNativeLayout
bool ScreenStackHeaderConfigViewManager::RequiresNativeLayout() {
  return false;
}

// IViewManagerWithChildren
void ScreenStackHeaderConfigViewManager::AddView(
    FrameworkElement parent,
    UIElement child,
    int64_t index) {
  auto screenStackHeaderConfig = parent.as<ScreenStackHeaderConfig>();
  if (!screenStackHeaderConfig)
    return;

  screenStackHeaderConfig->addView(child);
}

void ScreenStackHeaderConfigViewManager::RemoveAllChildren(FrameworkElement parent) {
  auto screenStackHeaderConfig = parent.as<ScreenStackHeaderConfig>();
  if (!screenStackHeaderConfig)
    return;

  screenStackHeaderConfig->removeAllChildren();
}

void ScreenStackHeaderConfigViewManager::RemoveChildAt(
    FrameworkElement parent,
    int64_t index) {
  auto screenStackHeaderConfig = parent.as<ScreenStackHeaderConfig>();
  if (!screenStackHeaderConfig)
    return;

  screenStackHeaderConfig->removeChildAt(index);
}

void ScreenStackHeaderConfigViewManager::ReplaceChild(
    FrameworkElement parent,
    UIElement oldChild,
    UIElement newChild) {
  auto screenStackHeaderConfig = parent.as<ScreenStackHeaderConfig>();
  if (!screenStackHeaderConfig)
    return;

  screenStackHeaderConfig->replaceChild(oldChild, newChild);
}

// IViewManagerWithReactContext
winrt::IReactContext
ScreenStackHeaderConfigViewManager::ReactContext() noexcept {
  return m_reactContext;
}

void ScreenStackHeaderConfigViewManager::ReactContext(
    IReactContext reactContext) noexcept {
  m_reactContext = reactContext;
}

// IViewManagerWithNativeProperties
IMapView<hstring, ViewManagerPropertyType>
ScreenStackHeaderConfigViewManager::NativeProps() noexcept {
  auto nativeProps =
      winrt::single_threaded_map<hstring, ViewManagerPropertyType>();
  return nativeProps.GetView();
}

void ScreenStackHeaderConfigViewManager::UpdateProperties(
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
ConstantProviderDelegate ScreenStackHeaderConfigViewManager::
    ExportedCustomBubblingEventTypeConstants() noexcept {
  return nullptr;
}

ConstantProviderDelegate ScreenStackHeaderConfigViewManager::
    ExportedCustomDirectEventTypeConstants() noexcept {
  return nullptr;
}

// IViewManagerWithCommands
IVectorView<hstring> ScreenStackHeaderConfigViewManager::Commands() noexcept {
  auto commands = winrt::single_threaded_vector<hstring>();
  return commands.GetView();
}

void ScreenStackHeaderConfigViewManager::DispatchCommand(
    FrameworkElement const &view,
    winrt::hstring const &commandId,
    winrt::IJSValueReader const &commandArgsReader) noexcept {
  (void)view;
  (void)commandId;
  (void)commandArgsReader;
}
} // namespace winrt::RNScreens::implementation
