package com.swmansion.rnscreens;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;

import java.util.ArrayList;
import java.util.List;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class ScreenFragment extends Fragment {

  public enum ScreenLifecycleEvent {
    Appear,
    WillAppear,
    Disappear,
    WillDisappear,
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
    // dumped. Since we don't restore the state but want to reuse the view we need to change visibility
    // back to VISIBLE in order for the fragment manager to animate in the view.
    view.setVisibility(View.VISIBLE);
    return view;
  }

  protected Screen mScreenView;
  private boolean mIsSendingProgress;
  private Screen mAboveScreen;
  private float mProgress;
  private short mCoalescingKey;
  private List<ScreenContainer> mChildScreenContainers = new ArrayList<>();

  public ScreenFragment() {
    throw new IllegalStateException("Screen fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity.");
  }

  @SuppressLint("ValidFragment")
  public ScreenFragment(Screen screenView) {
    super();
    mScreenView = screenView;
  }

  @Override
  public View onCreateView(LayoutInflater inflater,
                           @Nullable ViewGroup container,
                           @Nullable Bundle savedInstanceState) {
    FrameLayout wrapper = new FrameLayout(getContext());
    FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
    mScreenView.setLayoutParams(params);
    wrapper.addView(recycleView(mScreenView));
    return wrapper;
  }

  public Screen getScreen() {
    return mScreenView;
  }

  public void onContainerUpdate() {
    if (!hasChildScreenWithConfig(getScreen())) {
      // if there is no child with config, we look for a parent with config to set the orientation
      ScreenStackHeaderConfig config = findHeaderConfig();
      if (config != null && config.getScreenFragment().getActivity() != null) {
        config.getScreenFragment().getActivity().setRequestedOrientation(config.getScreenOrientation());
      }
    }
  }

  private @Nullable ScreenStackHeaderConfig findHeaderConfig() {
    ViewParent parent = getScreen().getContainer();
    while (parent != null) {
      if (parent instanceof Screen) {
        ScreenStackHeaderConfig headerConfig = ((Screen) parent).getHeaderConfig();
        if (headerConfig != null) {
          return headerConfig;
        }
      }
      parent = parent.getParent();
    }
    return null;
  }

  protected boolean hasChildScreenWithConfig(Screen screen) {
    if (screen == null) {
      return false;
    }
    for (ScreenContainer sc : screen.getFragment().getChildScreenContainers()) {
      // we check only the top screen for header config
      Screen topScreen = sc.getTopScreen();
      ScreenStackHeaderConfig headerConfig = topScreen != null ? topScreen.getHeaderConfig(): null;
      if (headerConfig != null) {
        return true;
      }
      if (hasChildScreenWithConfig(topScreen)) {
        return true;
      }
    }
    return false;
  }

  public List<ScreenContainer> getChildScreenContainers() {
    return mChildScreenContainers;
  }

  protected void dispatchOnWillAppear() {
    ((ReactContext) mScreenView.getContext())
        .getNativeModule(UIManagerModule.class)
        .getEventDispatcher()
        .dispatchEvent(new ScreenWillAppearEvent(mScreenView.getId()));

    dispatchEventInChildContainers(ScreenLifecycleEvent.WillAppear);
  
    if (mAboveScreen == null && getScreen() != null &&
            getScreen().getStackPresentation() == Screen.StackPresentation.TRANSPARENT_MODAL
            && getScreen().getContainer() != null && getScreen().getContainer().getScreenCount() > 1) {
      mAboveScreen = getScreen().getContainer().getScreenAt(getScreen().getContainer().getScreenCount() - 2);
    }

    dispatchTransitionProgress(0.0f, false, true);
  }

  protected void dispatchOnAppear() {
    ((ReactContext) mScreenView.getContext())
            .getNativeModule(UIManagerModule.class)
            .getEventDispatcher()
            .dispatchEvent(new ScreenAppearEvent(mScreenView.getId()));

    dispatchEventInChildContainers(ScreenLifecycleEvent.Appear);

    dispatchTransitionProgress(1.0f, false, true);
  }

  protected void dispatchOnWillDisappear() {
    ((ReactContext) mScreenView.getContext())
        .getNativeModule(UIManagerModule.class)
        .getEventDispatcher()
        .dispatchEvent(new ScreenWillDisappearEvent(mScreenView.getId()));

    dispatchEventInChildContainers(ScreenLifecycleEvent.WillDisappear);

    dispatchTransitionProgress(0.0f, true, true);
  }

  protected void dispatchOnDisappear() {
    ((ReactContext) mScreenView.getContext())
        .getNativeModule(UIManagerModule.class)
        .getEventDispatcher()
        .dispatchEvent(new ScreenDisappearEvent(mScreenView.getId()));

    dispatchEventInChildContainers(ScreenLifecycleEvent.Disappear);

    dispatchTransitionProgress(1.0f, true, true);
  }

  public void incrementCoalescingKey() {
    mCoalescingKey++;
  }

  protected void dispatchTransitionProgress(float alpha, boolean closing, boolean shouldIncrementCoalescingKey) {
    if (shouldIncrementCoalescingKey) {
      incrementCoalescingKey();
    }
    sendTransitionProgressEvent(alpha, closing);

    if (mAboveScreen != null && mAboveScreen.getFragment() != null && !mAboveScreen.getFragment().isSendingProgress()) {
      if (shouldIncrementCoalescingKey) {
        mAboveScreen.getFragment().incrementCoalescingKey();
      }
      // if we are in transparentModal presentation, only one screen is sending progress
      mAboveScreen.getFragment().sendTransitionProgressEvent(alpha, !closing);
    }
  }

  protected void sendTransitionProgressEvent(float alpha, boolean closing) {
    if (mProgress != alpha || alpha == 0.0f || alpha == 1.0f) {
      mProgress = Math.max(0.0f, Math.min(1.0f, alpha));
      ((ReactContext) mScreenView.getContext())
              .getNativeModule(UIManagerModule.class)
              .getEventDispatcher()
              .dispatchEvent(new ScreenTransitionProgressEvent(mScreenView.getId(), mProgress, closing, mCoalescingKey));
    }
  }

  private void dispatchEventInChildContainers(ScreenLifecycleEvent event) {
    for (ScreenContainer sc : mChildScreenContainers) {
      if (sc.getScreenCount() > 0) {
        Screen topScreen = sc.getTopScreen();
        if (topScreen != null && topScreen.getFragment() != null) {
          dispatchEvent(event, topScreen.getFragment());
        }
      }
    }
  }

  private void dispatchEvent(ScreenLifecycleEvent event, ScreenFragment fragment) {
    switch (event) {
      case Appear:
        fragment.dispatchOnAppear();
        break;
      case WillAppear:
        fragment.dispatchOnWillAppear();
        break;
      case Disappear:
        fragment.dispatchOnDisappear();
        break;
      case WillDisappear:
        fragment.dispatchOnWillDisappear();
        break;
      default:
        break;
    }
  }

  public void registerChildScreenContainer(ScreenContainer screenContainer) {
    mChildScreenContainers.add(screenContainer);
  }

  public void unregisterChildScreenContainer(ScreenContainer screenContainer) {
    mChildScreenContainers.remove(screenContainer);
  }

  public void onViewAnimationStart() {
    // onViewAnimationStart is triggered from View#onAnimationStart method of the fragment's root view.
    // We override Screen#onAnimationStart and an appropriate method of the StackFragment's root view
    // in order to achieve this.
    if (isResumed()) {
      dispatchOnWillAppear();
    } else {
      dispatchOnWillDisappear();
    }
  }

  public void onViewAnimationEnd() {
    // onViewAnimationEnd is triggered from View#onAnimationEnd method of the fragment's root view.
    // We override Screen#onAnimationEnd and an appropriate method of the StackFragment's root view
    // in order to achieve this.
    if (isResumed()) {
      dispatchOnAppear();
    } else {
      dispatchOnDisappear();
    }
  }

  public boolean isSendingProgress() {
    return mIsSendingProgress;
  }

  public void setIsSendingProgress(boolean isSendingProgress) {
    mIsSendingProgress = isSendingProgress;
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
