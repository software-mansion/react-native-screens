package com.swmansion.rnscreens;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import java.util.ArrayList;
import java.util.List;

public class ScreenFragment extends Fragment {

  public enum ScreenLifecycleEvent {
    Appear,
    WillAppear,
    Disappear,
    WillDisappear,
  }

  protected Screen mScreenView;
  private final List<ScreenContainer> mChildScreenContainers = new ArrayList<>();
  private boolean shouldUpdateOnResume = false;

  public ScreenFragment() {
    throw new IllegalStateException(
        "Screen fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity.");
  }

  @SuppressLint("ValidFragment")
  public ScreenFragment(Screen screenView) {
    super();
    mScreenView = screenView;
  }

  protected static View recycleView(View view) {
    // screen fragments reuse view instances instead of creating new ones. In order to reuse a given
    // view it needs to be detached from the view hierarchy to allow the fragment to attach it back.
    ViewParent parent = view.getParent();
    if (parent != null) {
      ((ViewGroup) parent).endViewTransition(view);
      ((ViewGroup) parent).removeView(view);
    }

    // view detached from fragment manager get their visibility changed to GONE after their state is
    // dumped. Since we don't restore the state but want to reuse the view we need to change
    // visibility back to VISIBLE in order for the fragment manager to animate in the view.
    view.setVisibility(View.VISIBLE);
    return view;
  }

  @Override
  public void onResume() {
    super.onResume();
    if (shouldUpdateOnResume) {
      shouldUpdateOnResume = false;
      ScreenWindowTraits.trySetWindowTraits(getScreen(), tryGetActivity(), tryGetContext());
    }
  }

  @Override
  public View onCreateView(
      LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
    FrameLayout wrapper = new FrameLayout(getContext());
    FrameLayout.LayoutParams params =
        new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
    mScreenView.setLayoutParams(params);
    wrapper.addView(recycleView(mScreenView));
    return wrapper;
  }

  public Screen getScreen() {
    return mScreenView;
  }

  public void onContainerUpdate() {
    updateWindowTraits();
  }

  private void updateWindowTraits() {
    Activity activity = getActivity();
    if (activity == null) {
      shouldUpdateOnResume = true;
      return;
    }
    ScreenWindowTraits.trySetWindowTraits(getScreen(), activity, tryGetContext());
  }

  protected @Nullable Activity tryGetActivity() {
    if (getActivity() != null) {
      return getActivity();
    }
    Context context = getScreen().getContext();
    if (context instanceof ReactContext && ((ReactContext) context).getCurrentActivity() != null) {
      return ((ReactContext) context).getCurrentActivity();
    }

    ViewParent parent = getScreen().getContainer();
    while (parent != null) {
      if (parent instanceof Screen) {
        ScreenFragment fragment = ((Screen) parent).getFragment();
        if (fragment != null && fragment.getActivity() != null) {
          return fragment.getActivity();
        }
      }
      parent = parent.getParent();
    }
    return null;
  }

  protected @Nullable ReactContext tryGetContext() {
    if (getContext() instanceof ReactContext) {
      return ((ReactContext) getContext());
    }
    if (getScreen().getContext() instanceof ReactContext) {
      return ((ReactContext) getScreen().getContext());
    }

    ViewParent parent = getScreen().getContainer();
    while (parent != null) {
      if (parent instanceof Screen) {
        if (((Screen) parent).getContext() instanceof ReactContext) {
          return (ReactContext) ((Screen) parent).getContext();
        }
      }
      parent = parent.getParent();
    }
    return null;
  }

  public List<ScreenContainer> getChildScreenContainers() {
    return mChildScreenContainers;
  }

  protected void dispatchOnWillAppear() {
    dispatchEvent(ScreenLifecycleEvent.WillAppear, this);
  }

  protected void dispatchOnAppear() {
    dispatchEvent(ScreenLifecycleEvent.Appear, this);
  }

  protected void dispatchOnWillDisappear() {
    dispatchEvent(ScreenLifecycleEvent.WillDisappear, this);
  }

  protected void dispatchOnDisappear() {
    dispatchEvent(ScreenLifecycleEvent.Disappear, this);
  }

  private void dispatchEvent(ScreenLifecycleEvent event, ScreenFragment fragment) {
    Screen screen = fragment.getScreen();
    Event lifecycleEvent;
    switch (event) {
      case WillAppear:
        lifecycleEvent = new ScreenWillAppearEvent(screen.getId());
        break;
      case Appear:
        lifecycleEvent = new ScreenAppearEvent(screen.getId());
        break;
      case WillDisappear:
        lifecycleEvent = new ScreenWillDisappearEvent(screen.getId());
        break;
      case Disappear:
        lifecycleEvent = new ScreenDisappearEvent(screen.getId());
        break;
      default:
        throw new IllegalStateException("Tried to dispatch unknown event: " + event.toString());
    }
    ((ReactContext) screen.getContext())
        .getNativeModule(UIManagerModule.class)
        .getEventDispatcher()
        .dispatchEvent(lifecycleEvent);

    fragment.dispatchEventInChildContainers(event);
  }

  private void dispatchEventInChildContainers(ScreenLifecycleEvent event) {
    for (ScreenContainer sc : mChildScreenContainers) {
      if (sc.getScreenCount() > 0) {
        Screen topScreen = sc.getTopScreen();
        if (topScreen != null
            && topScreen.getFragment() != null
            && (topScreen.getStackAnimation() != Screen.StackAnimation.NONE || isRemoving())) {
          // we do not dispatch events in child when it has `none` animation
          // and we are going forward since then they will be dispatched in child via
          // `onCreateAnimation` of ScreenStackFragment
          dispatchEvent(event, topScreen.getFragment());
        }
      }
    }
  }

  public void registerChildScreenContainer(ScreenContainer screenContainer) {
    mChildScreenContainers.add(screenContainer);
  }

  public void unregisterChildScreenContainer(ScreenContainer screenContainer) {
    mChildScreenContainers.remove(screenContainer);
  }

  public void onViewAnimationStart() {
    // onViewAnimationStart is triggered from View#onAnimationStart method of the fragment's root
    // view. We override Screen#onAnimationStart and an appropriate method of the StackFragment's
    // root view in order to achieve this.
    if (isResumed()) {
      // Android dispatches the animation start event for the fragment that is being added first
      // however we want the one being dismissed first to match iOS. It also makes more sense from
      // a navigation point of view to have the disappear event first.
      // Since there are no explicit relationships between the fragment being added / removed the
      // practical way to fix this is delaying dispatching the appear events at the end of the
      // frame.
      UiThreadUtil.runOnUiThread(
          new Runnable() {
            @Override
            public void run() {
              dispatchOnWillAppear();
            }
          });
    } else {
      dispatchOnWillDisappear();
    }
  }

  public void onViewAnimationEnd() {
    // onViewAnimationEnd is triggered from View#onAnimationEnd method of the fragment's root view.
    // We override Screen#onAnimationEnd and an appropriate method of the StackFragment's root view
    // in order to achieve this.
    if (isResumed()) {
      // See the comment in onViewAnimationStart for why this event is delayed.
      UiThreadUtil.runOnUiThread(
          new Runnable() {
            @Override
            public void run() {
              dispatchOnAppear();
            }
          });
    } else {
      dispatchOnDisappear();
    }
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    ScreenContainer container = mScreenView.getContainer();
    if (container == null || !container.hasScreen(this)) {
      // we only send dismissed even when the screen has been removed from its container
      ((ReactContext) mScreenView.getContext())
          .getNativeModule(UIManagerModule.class)
          .getEventDispatcher()
          .dispatchEvent(new ScreenDismissedEvent(mScreenView.getId()));
    }
    mChildScreenContainers.clear();
  }
}
