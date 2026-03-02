#include "pch.h"
#include "Screen.h"
#include "NativeModules.h"

namespace winrt::RNScreens::implementation {

using namespace winrt::Microsoft::ReactNative;

// ---------------------------------------------------------------------------
// ScreenProps
// ---------------------------------------------------------------------------
//
// Only props from ScreenNativeComponent.ts that are applicable to Windows are
// declared here. Props that are iOS/Android-specific (statusBar*, sheetXxx,
// screenOrientation, etc.) are intentionally absent and will be silently
// ignored by the framework.
//
// TODO: Implement activityState — the float prop JS uses to signal which screen
//       is active in a stack. Required for correct multi-screen z-ordering.
// TODO: Apply stackAnimation / replaceAnimation when native transitions are added.

REACT_STRUCT(ScreenProps)
struct ScreenProps
    : winrt::implements<ScreenProps, IComponentProps> {
  ScreenProps(
      ViewProps /*props*/,
      IComponentProps const& cloneFrom) noexcept {
    if (cloneFrom) {
      auto const* src = winrt::get_self<ScreenProps>(cloneFrom);
      stackAnimation    = src->stackAnimation;
      stackPresentation = src->stackPresentation;
      gestureEnabled    = src->gestureEnabled;
      replaceAnimation  = src->replaceAnimation;
    }
  }

  void SetProp(
      uint32_t hash,
      winrt::hstring propName,
      IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }

  REACT_FIELD(stackAnimation)
  std::string stackAnimation{"default"};

  REACT_FIELD(stackPresentation)
  std::string stackPresentation{"push"};

  REACT_FIELD(gestureEnabled)
  std::optional<bool> gestureEnabled{};

  REACT_FIELD(replaceAnimation)
  std::string replaceAnimation{"pop"};
};

// ---------------------------------------------------------------------------
// ScreenEventEmitter
// ---------------------------------------------------------------------------
//
// Wraps the Fabric EventEmitter to provide named dispatch methods.
//
// Timing note — WillAppear / WillDisappear:
//   Fabric provides no pre-mount or pre-unmount hook. Both WillAppear and
//   Appear are therefore dispatched from the same Mounted callback, and both
//   WillDisappear and Disappear from the same Unmounted callback. They are
//   co-incident on Windows. The old XAML implementation fired WillDisappear
//   and Disappear from the same Unloaded handler (also co-incident), so
//   Disappear parity is preserved. WillAppear was previously fired from the
//   earlier XAML Loading event (one frame ahead), which has no Fabric
//   equivalent; this is a known timing approximation.

struct ScreenEventEmitter {
  explicit ScreenEventEmitter(EventEmitter const& emitter) noexcept
      : m_emitter(emitter) {
    assert(emitter != nullptr &&
           "ScreenEventEmitter constructed with a null EventEmitter handle");
  }

  void onWillAppear()    const noexcept { Dispatch(L"topWillAppear"); }
  void onAppear()        const noexcept { Dispatch(L"topAppear"); }
  void onWillDisappear() const noexcept { Dispatch(L"topWillDisappear"); }
  void onDisappear()     const noexcept { Dispatch(L"topDisappear"); }

 private:
  void Dispatch(winrt::hstring const& eventName) const noexcept {
    if (!m_emitter) return;
    m_emitter.DispatchEvent(
        eventName,
        [](IJSValueWriter const& writer) noexcept {
          writer.WriteObjectBegin();
          writer.WriteObjectEnd();
        });
  }

  EventEmitter m_emitter{nullptr};
};

// ---------------------------------------------------------------------------
// ScreenUserData
// ---------------------------------------------------------------------------

struct ScreenUserData
    : winrt::implements<ScreenUserData, winrt::Windows::Foundation::IInspectable> {
  // Subscribe to Fabric ComponentView lifecycle events.
  //
  // Thread safety: all Fabric lifecycle callbacks are dispatched on the UI
  // thread. m_eventEmitter is only written from UpdateEventEmitter (also UI
  // thread) and read from the Mounted/Unmounted lambdas below — no explicit
  // synchronization is required.
  //
  // Lifetime safety: the revoker members (m_mountedRevoker,
  // m_unmountedRevoker) are RAII handles. Their destructors revoke the event
  // subscriptions before 'this' is destroyed, making a dangling [this] capture
  // impossible.
  void Initialize(ComponentView const& view) noexcept {
    m_mountedRevoker = view.Mounted(
        winrt::auto_revoke,
        [this](auto&&, auto&&) noexcept {
          if (m_eventEmitter) {
            m_eventEmitter->onWillAppear();
            m_eventEmitter->onAppear();
          }
        });

    m_unmountedRevoker = view.Unmounted(
        winrt::auto_revoke,
        [this](auto&&, auto&&) noexcept {
          if (m_eventEmitter) {
            m_eventEmitter->onWillDisappear();
            m_eventEmitter->onDisappear();
          }
        });
  }

  // Called when JS props change. Currently a no-op: ScreenProps fields
  // (stackAnimation, stackPresentation, etc.) are not yet applied to any
  // native visual on Windows.
  // TODO: Apply props when native navigation / activityState is implemented.
  void UpdateProps(
      ComponentView const& /*view*/,
      IComponentProps const& /*newProps*/,
      IComponentProps const& /*oldProps*/) noexcept {}

  void UpdateEventEmitter(EventEmitter const& emitter) noexcept {
    m_eventEmitter.emplace(emitter);
  }

 private:
  std::optional<ScreenEventEmitter>        m_eventEmitter;
  ComponentView::Mounted_revoker           m_mountedRevoker;
  ComponentView::Unmounted_revoker         m_unmountedRevoker;
};

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

void RegisterScreenLike(
    IReactPackageBuilderFabric const& fabricBuilder,
    winrt::hstring const& componentName) noexcept {
  fabricBuilder.AddViewComponent(
      componentName,
      [](IReactViewComponentBuilder const& builder) noexcept {
        builder.SetComponentViewInitializer(
            [](ComponentView const& view) noexcept {
              auto ud = winrt::make_self<ScreenUserData>();
              ud->Initialize(view);
              view.UserData(*ud);
            });

        builder.SetCreateProps(
            [](ViewProps props, IComponentProps const& cloneFrom) noexcept
            -> IComponentProps {
              return winrt::make<ScreenProps>(props, cloneFrom);
            });

        builder.SetUpdatePropsHandler(
            [](ComponentView const& view,
               IComponentProps const& newProps,
               IComponentProps const& oldProps) noexcept {
              winrt::get_self<ScreenUserData>(view.UserData())
                  ->UpdateProps(view, newProps, oldProps);
            });

        builder.SetUpdateEventEmitterHandler(
            [](ComponentView const& view, EventEmitter const& emitter) noexcept {
              winrt::get_self<ScreenUserData>(view.UserData())
                  ->UpdateEventEmitter(emitter);
            });
      });
}

void RegisterRNSScreen(IReactPackageBuilderFabric const& fabricBuilder) noexcept {
  RegisterScreenLike(fabricBuilder, L"RNSScreen");
}

} // namespace winrt::RNScreens::implementation
