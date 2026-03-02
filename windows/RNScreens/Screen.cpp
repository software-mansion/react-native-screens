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
ActivityState ToActivityState(std::optional<float> const &value) noexcept {
  if (!value.has_value())
    return ActivityState::Unset;

  if (const auto v = static_cast<int32_t>(value.value()); v >= 0 && v <= 2)
    return static_cast<ActivityState>(v);

  return ActivityState::Unset;
}
} // namespace

// ---------------------------------------------------------------------------
// ScreenProps
// ---------------------------------------------------------------------------

REACT_STRUCT(ScreenProps)

struct ScreenProps : winrt::implements<ScreenProps, IComponentProps> {
  ScreenProps(ViewProps /*props*/, IComponentProps const &cloneFrom) noexcept {
    if (cloneFrom) {
      auto const *src = winrt::get_self<ScreenProps>(cloneFrom);
      stackAnimation = src->stackAnimation;
      stackPresentation = src->stackPresentation;
      gestureEnabled = src->gestureEnabled;
      replaceAnimation = src->replaceAnimation;
      activityState = src->activityState;
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

  REACT_FIELD(activityState)
  std::optional<float> activityState{};
};

// ---------------------------------------------------------------------------
// ScreenEventEmitter
// ---------------------------------------------------------------------------

struct ScreenEventEmitter {
  explicit ScreenEventEmitter(EventEmitter const &emitter) noexcept
    : m_emitter(emitter) {
    assert(
        emitter != nullptr &&
        "ScreenEventEmitter constructed with a null EventEmitter handle");
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
  void Dispatch(winrt::hstring const &eventName) const noexcept {
    if (!m_emitter)
      return;
    m_emitter.DispatchEvent(
        eventName,
        [](IJSValueWriter const &writer) noexcept {
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
    : winrt::implements<ScreenUserData,
                        winrt::Windows::Foundation::IInspectable> {
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
  void Initialize(ComponentView const &view) noexcept {
    m_mountedRevoker = view.Mounted(
        winrt::auto_revoke,
        [this](auto &&, auto &&) noexcept {
          if (m_eventEmitter) {
            m_eventEmitter->onWillAppear();
            m_eventEmitter->onAppear();
          }
        });

    m_unmountedRevoker = view.Unmounted(
        winrt::auto_revoke,
        [this](auto &&, auto &&) noexcept {
          if (m_eventEmitter) {
            m_eventEmitter->onWillDisappear();
            m_eventEmitter->onDisappear();
          }
        });
  }

  void UpdateProps(
      ComponentView const & /*view*/,
      IComponentProps const &newProps,
      IComponentProps const & /*oldProps*/) noexcept {
    auto const *next = winrt::get_self<ScreenProps>(newProps);
    const auto newState = ToActivityState(next->activityState);
    if (newState == m_activityState)
      return;
    m_activityState = newState;
    ApplyVisibility();
  }

  void UpdateEventEmitter(EventEmitter const &emitter) noexcept {
    m_eventEmitter.emplace(emitter);
  }

  void SetVisual(
      winrt::Microsoft::UI::Composition::ContainerVisual const &visual)
    noexcept {
    assert(!m_visual && "Visual already assigned");
    m_visual = visual;
    ApplyVisibility();
  }

private:
  // Applies the current m_activityState to the DComp visual. Called from both
  // UpdateProps (state change) and SetVisual (late visual creation reconciliation).
  void ApplyVisibility() const noexcept {
    if (m_visual) {
      // Only Inactive (0) hides the screen; Unset, Transitioning, and Active
      // all keep it visible. The setter is unconditional — DComp ignores
      // redundant no-op sets, and the m_activityState guard upstream already
      // prevents calls when state has not changed.
      m_visual.IsVisible(m_activityState != ActivityState::Inactive);
    }
  }

  std::optional<ScreenEventEmitter> m_eventEmitter;
  ComponentView::Mounted_revoker m_mountedRevoker;
  ComponentView::Unmounted_revoker m_unmountedRevoker;
  winrt::Microsoft::UI::Composition::ContainerVisual m_visual{nullptr};
  ActivityState m_activityState{ActivityState::Unset};
};

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

void RegisterScreenLike(
    IReactPackageBuilderFabric const &fabricBuilder,
    winrt::hstring const &componentName) noexcept {
  namespace Comp = winrt::Microsoft::ReactNative::Composition;
  fabricBuilder.AddViewComponent(
      componentName,
      [](IReactViewComponentBuilder const &builder) noexcept {
        builder.SetComponentViewInitializer(
            [](ComponentView const &view) noexcept {
              auto ud = winrt::make_self<ScreenUserData>();
              ud->Initialize(view);
              view.UserData(*ud);
            });

        builder.SetCreateProps(
            [](
            ViewProps props,
            IComponentProps const &cloneFrom) noexcept
          -> IComponentProps {
              return winrt::make<ScreenProps>(props, cloneFrom);
            });

        builder.SetUpdatePropsHandler(
            [](
            ComponentView const &view,
            IComponentProps const &newProps,
            IComponentProps const &oldProps) noexcept {
              winrt::get_self<ScreenUserData>(view.UserData())
                  ->UpdateProps(view, newProps, oldProps);
            });

        builder.SetUpdateEventEmitterHandler(
            [](
            ComponentView const &view,
            EventEmitter const &emitter) noexcept {
              winrt::get_self<ScreenUserData>(view.UserData())
                  ->UpdateEventEmitter(emitter);
            });

        // Capture the root ContainerVisual so UpdateProps can toggle IsVisible
        // when activityState changes. SetComponentViewInitializer is expected
        // to run before SetCreateVisualHandler; SetVisual asserts that invariant.
        if (const auto compBuilder = builder.try_as<
          Comp::IReactCompositionViewComponentBuilder>()) {
          compBuilder.SetCreateVisualHandler(
              [](
              ComponentView const &view) noexcept ->
            winrt::Microsoft::UI::Composition::Visual {
                const auto compView = view.try_as<Comp::IComponentView>();
                assert(
                    compView &&
                    "ComponentView must implement IComponentView on a Composition builder");
                auto visual = compView.Compositor().CreateContainerVisual();
                winrt::get_self<ScreenUserData>(view.UserData())->SetVisual(
                    visual);
                return visual;
              });
        }
      });
}

void RegisterRNSScreen(
    IReactPackageBuilderFabric const &fabricBuilder) noexcept {
  RegisterScreenLike(fabricBuilder, L"RNSScreen");
}
} // namespace winrt::RNScreens::implementation