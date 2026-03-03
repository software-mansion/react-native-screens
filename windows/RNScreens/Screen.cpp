#include "pch.h"
#include "Screen.h"
#include "NativeModules.h"

namespace winrt::RNScreens::implementation {
using namespace winrt::Microsoft::ReactNative;

enum class ActivityState : int8_t {
  Unset = -1,
  Inactive = 0,
  Transitioning = 1,
  Active = 2,
};

namespace {
// activityState arrives from JS as an integer in {-1, 0, 1, 2}, all exactly
// representable as IEEE 754 float, so the cast to int8_t is lossless. -1 is
// the JS-side "not yet assigned" sentinel; any value outside [0, 2] maps to
// Unset rather than producing an out-of-range enum value.
ActivityState ToActivityState(const std::optional<float> &value) noexcept {
  if (!value.has_value())
    return ActivityState::Unset;

  if (const auto v = static_cast<int8_t>(value.value()); v >= 0 && v <= 2)
    return static_cast<ActivityState>(v);

  return ActivityState::Unset;
}
} // namespace

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
  // The framework supplies a null EventEmitter between view creation and the
  // first UpdateEventEmitter call; guard before every dispatch.
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

struct ScreenUserData : implements<ScreenUserData, IInspectable> {
  // Thread safety: Fabric dispatches all lifecycle callbacks on the UI thread;
  // m_eventEmitter is written only from UpdateEventEmitter (also UI thread) and
  // read only from the Mounted/Unmounted lambdas, so no synchronisation is
  // needed.
  //
  // Lifetime: revokers are RAII handles whose destructors call Revoke() before
  // ScreenUserData is destroyed, so the [this] captures below cannot dangle.
  void Initialize(const ComponentView &view) noexcept {
    m_mountedRevoker = view.Mounted(
        auto_revoke,
        [this](auto &&, auto &&) noexcept {
          // No native transition animation on Windows, so WillAppear and Appear
          // fire together. If native animations are added, split into
          // begin-transition / end-transition callbacks.
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
  // Called from both UpdateProps (activityState change) and SetVisual (late
  // visual assignment); whichever fires second applies the definitive state.
  void ApplyVisibility() const noexcept {
    if (m_visual) {
      // Only Inactive hides the screen. Unset, Transitioning, and Active are
      // all visible; the navigator sets Inactive on off-stack screens to
      // prevent them compositing into the scene.
      m_visual.IsVisible(m_activityState != ActivityState::Inactive);
    }
  }

  std::optional<ScreenEventEmitter> m_eventEmitter;
  ComponentView::Mounted_revoker m_mountedRevoker;
  ComponentView::Unmounted_revoker m_unmountedRevoker;
  Microsoft::UI::Composition::ContainerVisual m_visual{nullptr};
  ActivityState m_activityState{ActivityState::Unset};
};

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

        // SetViewComponentViewInitializer guarantees a Composition::ViewComponentView,
        // so the QI cannot fail in practice. try_as is not a safe alternative:
        // the framework calls InsertAt(visual, 0) without a null check, so a
        // null return crashes there instead.
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
