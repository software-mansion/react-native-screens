package com.swmansion.rnscreens;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.widget.LinearLayout;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.fragment.app.Fragment;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.uimanager.PixelUtil;
import com.google.android.material.appbar.AppBarLayout;

public class ScreenStackFragment extends ScreenFragment {

  private AppBarLayout mAppBarLayout;
  private Toolbar mToolbar;
  private boolean mShadowHidden;
  private boolean mIsTranslucent;

  @SuppressLint("ValidFragment")
  public ScreenStackFragment(Screen screenView) {
    super(screenView);
  }

  public ScreenStackFragment() {
    throw new IllegalStateException(
        "ScreenStack fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity.");
  }

  public void removeToolbar() {
    if (mAppBarLayout != null && mToolbar != null && mToolbar.getParent() == mAppBarLayout) {
      mAppBarLayout.removeView(mToolbar);
    }
    mToolbar = null;
  }

  public void setToolbar(Toolbar toolbar) {
    if (mAppBarLayout != null) {
      mAppBarLayout.addView(toolbar);
    }
    mToolbar = toolbar;
    AppBarLayout.LayoutParams params =
        new AppBarLayout.LayoutParams(
            AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT);
    params.setScrollFlags(0);
    mToolbar.setLayoutParams(params);
  }

  public void setToolbarShadowHidden(boolean hidden) {
    if (mShadowHidden != hidden) {
      mAppBarLayout.setTargetElevation(hidden ? 0 : PixelUtil.toPixelFromDIP(4));
      mShadowHidden = hidden;
    }
  }

  public void setToolbarTranslucent(boolean translucent) {
    if (mIsTranslucent != translucent) {
      ViewGroup.LayoutParams params = mScreenView.getLayoutParams();
      ((CoordinatorLayout.LayoutParams) params)
          .setBehavior(translucent ? null : new AppBarLayout.ScrollingViewBehavior());
      mIsTranslucent = translucent;
    }
  }

  @Override
  public void onContainerUpdate() {
    ScreenStackHeaderConfig headerConfig = getScreen().getHeaderConfig();
    if (headerConfig != null) {
      headerConfig.onUpdate();
    }
  }

  @Override
  public void onViewAnimationEnd() {
    super.onViewAnimationEnd();
    notifyViewAppearTransitionEnd();
  }

  @Nullable
  @Override
  public Animation onCreateAnimation(int transit, final boolean enter, int nextAnim) {
    // this means that the fragment will appear without transition, in this case
    // onViewAnimationStart and onViewAnimationEnd won't be called and we need to notify
    // stack directly from here.
    // When using the Toolbar back button this is called an extra time with transit = 0 but in
    // this case we don't want to notify. The way I found to detect is case is check isHidden.
    if (transit == 0
        && !isHidden()
        && getScreen().getStackAnimation() == Screen.StackAnimation.NONE) {
      if (enter) {
        // Android dispatches the animation start event for the fragment that is being added first
        // however we want the one being dismissed first to match iOS. It also makes more sense
        // from  a navigation point of view to have the disappear event first.
        // Since there are no explicit relationships between the fragment being added / removed
        // the practical way to fix this is delaying dispatching the appear events at the end of
        // the frame.
        UiThreadUtil.runOnUiThread(
            new Runnable() {
              @Override
              public void run() {
                dispatchOnWillAppear();
                dispatchOnAppear();
              }
            });
      } else {
        dispatchOnWillDisappear();
        dispatchOnDisappear();
        notifyViewAppearTransitionEnd();
      }
    }

    return null;
  }

  private void notifyViewAppearTransitionEnd() {
    ViewParent screenStack = getView() != null ? getView().getParent() : null;
    if (screenStack instanceof ScreenStack) {
      ((ScreenStack) screenStack).onViewAppearTransitionEnd();
    }
  }

  @Override
  public View onCreateView(
      LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
    CoordinatorLayout view = new NotifyingCoordinatorLayout(getContext(), this);
    CoordinatorLayout.LayoutParams params =
        new CoordinatorLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
    params.setBehavior(mIsTranslucent ? null : new AppBarLayout.ScrollingViewBehavior());
    mScreenView.setLayoutParams(params);
    view.addView(recycleView(mScreenView));

    mAppBarLayout = new AppBarLayout(getContext());
    // By default AppBarLayout will have a background color set but since we cover the whole layout
    // with toolbar (that can be semi-transparent) the bar layout background color does not pay a
    // role. On top of that it breaks screens animations when alfa offscreen compositing is off
    // (which is the default)
    mAppBarLayout.setBackgroundColor(Color.TRANSPARENT);
    mAppBarLayout.setLayoutParams(
        new AppBarLayout.LayoutParams(
            AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT));
    view.addView(mAppBarLayout);

    if (mShadowHidden) {
      mAppBarLayout.setTargetElevation(0);
    }

    if (mToolbar != null) {
      mAppBarLayout.addView(recycleView(mToolbar));
    }

    return view;
  }

  public boolean isDismissable() {
    return mScreenView.isGestureEnabled();
  }

  public boolean canNavigateBack() {
    ScreenContainer container = mScreenView.getContainer();
    if (container instanceof ScreenStack) {
      if (((ScreenStack) container).getRootScreen() == getScreen()) {
        // this screen is the root of the container, if it is nested we can check parent container
        // if it is also a root or not
        Fragment parentFragment = getParentFragment();
        if (parentFragment instanceof ScreenStackFragment) {
          return ((ScreenStackFragment) parentFragment).canNavigateBack();
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      throw new IllegalStateException("ScreenStackFragment added into a non-stack container");
    }
  }

  public void dismiss() {
    ScreenContainer container = mScreenView.getContainer();
    if (container instanceof ScreenStack) {
      ((ScreenStack) container).dismiss(this);
    } else {
      throw new IllegalStateException("ScreenStackFragment added into a non-stack container");
    }
  }

  private static class NotifyingCoordinatorLayout extends CoordinatorLayout {

    private final ScreenFragment mFragment;
    private final Animation.AnimationListener mAnimationListener =
        new Animation.AnimationListener() {
          @Override
          public void onAnimationStart(Animation animation) {
            mFragment.onViewAnimationStart();
          }

          @Override
          public void onAnimationEnd(Animation animation) {
            mFragment.onViewAnimationEnd();
          }

          @Override
          public void onAnimationRepeat(Animation animation) {}
        };

    public NotifyingCoordinatorLayout(@NonNull Context context, ScreenFragment fragment) {
      super(context);
      mFragment = fragment;
    }

    @Override
    public void startAnimation(Animation animation) {
      // For some reason View##onAnimationEnd doesn't get called for
      // exit transitions so we explicitly attach animation listener.
      // We also have some animations that are an AnimationSet, so we don't wrap them
      // in another set since it causes some visual glitches when going forward.
      // We also set the listener only when going forward, since when going back,
      // there is already a listener for dismiss action added, which would be overridden
      // and also this is not necessary when going back since the lifecycle methods
      // are correctly dispatched then.
      if (animation instanceof AnimationSet && !mFragment.isRemoving()) {
        animation.setAnimationListener(mAnimationListener);
        super.startAnimation(animation);
      } else {
        AnimationSet set = new AnimationSet(true);
        set.addAnimation(animation);
        set.setAnimationListener(mAnimationListener);
        super.startAnimation(set);
      }
    }
  }
}
