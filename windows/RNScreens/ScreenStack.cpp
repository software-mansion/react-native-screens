#include "pch.h"
#include "ScreenStack.h"

namespace winrt::RNScreens::implementation {
using namespace winrt::Microsoft::ReactNative;

// ---------------------------------------------------------------------------
// ScreenStackEventEmitter
// ---------------------------------------------------------------------------
//
// NOTE: onFinishTransitioning is not currently dispatched because native push/
// pop transitions are not implemented on Windows. The method and its
// infrastructure are retained so that wiring it up only requires calling
// onFinishTransitioning() at the appropriate point in a future transition
// implementation — no other scaffolding changes are needed.

struct ScreenStackEventEmitter {
  explicit ScreenStackEventEmitter(const EventEmitter &emitter) noexcept
    : m_emitter(emitter) {
    assert(
        emitter != nullptr &&
        "ScreenStackEventEmitter constructed with a null EventEmitter handle");
  }

  void onFinishTransitioning() const noexcept {
    if (!m_emitter)
      return;
    m_emitter.DispatchEvent(
        L"topFinishTransitioning",
        [](const IJSValueWriter &writer) noexcept {
          writer.WriteObjectBegin();
          writer.WriteObjectEnd();
        });
  }

private:
  EventEmitter m_emitter{nullptr};
};

// ---------------------------------------------------------------------------
// ScreenStackUserData
// ---------------------------------------------------------------------------

struct ScreenStackUserData
    : implements<ScreenStackUserData, IInspectable> {
  void UpdateEventEmitter(const EventEmitter &emitter) noexcept {
    m_eventEmitter.emplace(emitter);
  }

  // NOTE: SetMountChildComponentViewHandler / SetUnmountChildComponentViewHandler
  // are intentionally not registered. In the old Paper implementation, a XAML
  // ContentControl was manually updated to show the top-of-stack child. In
  // Fabric, JS controls which screens are in the component tree and the
  // reconciler renders them in declaration order — no native child-management
  // logic is required here.
  //
  // If activityState-driven z-ordering or explicit transition management is
  // implemented in the future, child tracking should be added here via
  // SetMountChildComponentViewHandler, with the vector encapsulated behind
  // accessor methods rather than exposed as a public field.

private:
  std::optional<ScreenStackEventEmitter> m_eventEmitter;
};

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

void RegisterScreenStack(
    const IReactPackageBuilderFabric &fabricBuilder) noexcept {
  fabricBuilder.AddViewComponent(
      L"RNSScreenStack",
      [](const IReactViewComponentBuilder &builder) noexcept {
        builder.SetComponentViewInitializer(
            [](const ComponentView &view) noexcept {
              view.UserData(*winrt::make_self<ScreenStackUserData>());
            });

        builder.SetUpdateEventEmitterHandler(
            [](
            const ComponentView &view,
            const EventEmitter &emitter) noexcept {
              winrt::get_self<ScreenStackUserData>(view.UserData())
                  ->UpdateEventEmitter(emitter);
            });
      });
}
} // namespace winrt::RNScreens::implementation