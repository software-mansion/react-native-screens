#include "pch.h"
#include "Screen.h"
#include "NativeModules.h"

namespace winrt::RNScreens::implementation {
using namespace winrt::Microsoft::ReactNative;

// ---------------------------------------------------------------------------
// Enums & Utilities
// ---------------------------------------------------------------------------

enum class ActivityState : int8_t {
  Unset = -1,
  Inactive = 0,
  Transitioning = 1,
  Active = 2,
};

namespace {
// Converts the JS activityState float prop to the typed enum.
// activityState is always set from integer literals in JS (-1, 0, 1, 2), all
// of which are exactly representable as IEEE 754 float, so a direct cast is
// safe. Out-of-range values are clamped to Unset rather than producing an
// invalid enum value.
ActivityState ToActivityState(const std::optional<float> &value) noexcept {
  if (!value.has_value())
    return ActivityState::Unset;

  if (const auto v = static_cast<int8_t>(value.value()); v >= 0 && v <= 2)
    return static_cast<ActivityState>(v);

  return ActivityState::Unset;
}
} // namespace

// ---------------------------------------------------------------------------
// ScreenProps
// ---------------------------------------------------------------------------

REACT_STRUCT(ScreenProps)

struct ScreenProps : implements<ScreenProps, IComponentProps> {
  ScreenProps(ViewProps /*props*/, const IComponentProps &cloneFrom) noexcept {
    if (cloneFrom) {
      const auto *src = winrt::get_self<ScreenProps>(cloneFrom);
      stackAnimation = src->stackAnimation;
      stackPresentation = src->stackPresentation;
      gestureEnabled = src->gestureEnabled;
      replaceAnimation = src->replaceAnimation;
      activityState = src->activityState;
    }
  }

  void SetProp(
      uint32_t hash,
      hstring propName,
      IJSValueReader value) noexcept {
    ReadProp(hash, propName, value, *this);
  }

  REACT_FIELD(stackAnimation)
  std::string stackAnimation{"default"};

  REACT_FIELD(stackPresentation)
  std::string stackPresentation{"push"};

  REACT_FIELD(gestureEnabled)
  std::optional<bool> gestureEnabled{};

  REACT_FIELD(replaceAnimation)
  std::string replaceAnimation{"pop"};

  REACT_FIELD(activityState)
  std::optional<float> activityState{};
};

// ---------------------------------------------------------------------------
// ScreenEventEmitter
// ---------------------------------------------------------------------------

struct ScreenEventEmitter {
  explicit ScreenEventEmitter(const EventEmitter &emitter) noexcept
    : m_emitter(emitter) {
  }

  void onWillAppear() const noexcept {
    Dispatch(L"topWillAppear");
  }

  void onAppear() const noexcept {
    Dispatch(L"topAppear");
  }

  void onWillDisappear() const noexcept {
    Dispatch(L"topWillDisappear");
  }

  void onDisappear() const noexcept {
    Dispatch(L"topDisappear");
  }

private:
  void Dispatch(const hstring &eventName) const noexcept {
    if (!m_emitter)
      return;
    m_emitter.DispatchEvent(
        eventName,
        [](const IJSValueWriter &writer) noexcept {
          writer.WriteObjectBegin();
          writer.WriteObjectEnd();
        });
  }

  EventEmitter m_emitter{nullptr};
};

// ---------------------------------------------------------------------------
// ScreenUserData
// ---------------------------------------------------------------------------

struct ScreenUserData : implements<ScreenUserData, IInspectable> {
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
  void Initialize(const ComponentView &view) noexcept {
    m_mountedRevoker = view.Mounted(
        auto_revoke,
        [this](auto &&, auto &&) noexcept {
          if (m_eventEmitter) {
            m_eventEmitter->onWillAppear();
            m_eventEmitter->onAppear();
          }
        });

    m_unmountedRevoker = view.Unmounted(
        auto_revoke,
        [this](auto &&, auto &&) noexcept {
          if (m_eventEmitter) {
            m_eventEmitter->onWillDisappear();
            m_eventEmitter->onDisappear();
          }
        });
  }

  void UpdateProps(
      const ComponentView & /*view*/,
      const IComponentProps &newProps,
      const IComponentProps & /*oldProps*/) noexcept {
    const auto *next = winrt::get_self<ScreenProps>(newProps);
    const auto newState = ToActivityState(next->activityState);
    if (newState == m_activityState)
      return;
    m_activityState = newState;
    ApplyVisibility();
  }

  void UpdateEventEmitter(const EventEmitter &emitter) noexcept {
    m_eventEmitter.emplace(emitter);
  }

  void SetVisual(
      const Microsoft::UI::Composition::ContainerVisual &visual) noexcept {
    m_visual = visual;
    ApplyVisibility();
  }

private:
  // Applies the current m_activityState to the DComp visual. Called from both
  // UpdateProps (state change) and SetVisual (late visual creation
  // reconciliation) to handle whichever arrives first.
  void ApplyVisibility() const noexcept {
    if (m_visual) {
      // Only Inactive (0) hides the screen; Unset, Transitioning, and Active
      // all keep it visible. The setter is unconditional — DComp ignores
      // redundant no-op sets, and the m_activityState guard upstream already
      // prevents calls when the state has not changed.
      m_visual.IsVisible(m_activityState != ActivityState::Inactive);
    }
  }

  std::optional<ScreenEventEmitter> m_eventEmitter;
  ComponentView::Mounted_revoker m_mountedRevoker;
  ComponentView::Unmounted_revoker m_unmountedRevoker;
  Microsoft::UI::Composition::ContainerVisual m_visual{nullptr};
  ActivityState m_activityState{ActivityState::Unset};
};

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

void RegisterScreenLike(
    const IReactPackageBuilderFabric &fabricBuilder,
    const hstring &componentName) noexcept {
  namespace Comp = Composition;
  fabricBuilder.AddViewComponent(
      componentName,
      [](const IReactViewComponentBuilder &builder) noexcept {
        const auto compBuilder =
            builder.as<Comp::IReactCompositionViewComponentBuilder>();

        compBuilder.SetViewComponentViewInitializer(
            [](const ComponentView &view) noexcept {
              auto ud = winrt::make_self<ScreenUserData>();
              ud->Initialize(view);
              view.UserData(*ud);
            });

        builder.SetCreateProps(
            [](
            ViewProps props,
            const IComponentProps &cloneFrom) noexcept -> IComponentProps {
              return winrt::make<ScreenProps>(props, cloneFrom);
            });

        builder.SetUpdatePropsHandler(
            [](
            const ComponentView &view,
            const IComponentProps &newProps,
            const IComponentProps &oldProps) noexcept {
              winrt::get_self<ScreenUserData>(view.UserData())
                  ->UpdateProps(view, newProps, oldProps);
            });

        builder.SetUpdateEventEmitterHandler(
            [](
            const ComponentView &view,
            const EventEmitter &emitter) noexcept {
              winrt::get_self<ScreenUserData>(view.UserData())
                  ->UpdateEventEmitter(emitter);
            });

        // SetViewComponentViewInitializer guarantees the view is a
        // Composition::ViewComponentView, so as<> is unconditional.
        compBuilder.SetCreateVisualHandler(
            [](
            const ComponentView &view) noexcept
          -> Microsoft::UI::Composition::Visual {
              auto visual = view.as<Comp::ComponentView>()
                                .Compositor()
                                .CreateSpriteVisual();
              winrt::get_self<ScreenUserData>(view.UserData())
                  ->SetVisual(visual);
              return visual;
            });
      });
}

void RegisterScreen(
    const IReactPackageBuilderFabric &fabricBuilder) noexcept {
  RegisterScreenLike(fabricBuilder, L"RNSScreen");
}
} // namespace winrt::RNScreens::implementation