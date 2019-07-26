package com.swmansion.rnscreens;

import android.content.Context;
import android.content.ContextWrapper;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.view.ViewGroup;
import android.view.ViewParent;

import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.ChoreographerCompat;
import com.facebook.react.modules.core.ReactChoreographer;

import java.util.ArrayList;

public class ScreenStack extends ViewGroup {

  private final ArrayList<Screen> mScreens = new ArrayList<>();
  private final ArrayList<Screen> mStack = new ArrayList<>();

  private @Nullable FragmentTransaction mCurrentTransaction;
  private Screen mTopScreen = null;
  private boolean mNeedUpdate;
  private boolean mIsAttached;

  private ChoreographerCompat.FrameCallback mFrameCallback = new ChoreographerCompat.FrameCallback() {
    @Override
    public void doFrame(long frameTimeNanos) {
      updateIfNeeded();
    }
  };

  public ScreenStack(Context context) {
    super(context);
  }

  @Override
  protected void onLayout(boolean b, int i, int i1, int i2, int i3) {
    // no-op
  }

  protected void markUpdated() {
    if (!mNeedUpdate) {
      mNeedUpdate = true;
      // enqueue callback of NATIVE_ANIMATED_MODULE type as all view operations are executed in
      // DISPATCH_UI type and we want the callback to be called right after in the same frame.
      ReactChoreographer.getInstance().postFrameCallback(
              ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE,
              mFrameCallback);
    }
  }

  protected void notifyChildUpdate() {
    markUpdated();
  }

  protected void addScreen(Screen screen, int index) {
    mScreens.add(index, screen);
    markUpdated();
  }

  protected void removeScreenAt(int index) {
    mScreens.remove(index);
    markUpdated();
  }

  protected int getScreenCount() {
    return mScreens.size();
  }

  protected Screen getScreenAt(int index) {
    return mScreens.get(index);
  }

  private FragmentActivity findRootFragmentActivity() {
    ViewParent parent = this;
    while (!(parent instanceof ReactRootView) && parent.getParent() != null) {
      parent = parent.getParent();
    }
    // we expect top level view to be of type ReactRootView, this isn't really necessary but in order
    // to find root view we test if parent is null. This could potentially happen also when the view
    // is detached from the hierarchy and that test would not correctly indicate the root view. So
    // in order to make sure we indeed reached the root we test if it is of a correct type. This
    // allows us to provide a more descriptive error message for the aforementioned case.
    if (!(parent instanceof ReactRootView)) {
      throw new IllegalStateException("ScreenContainer is not attached under ReactRootView");
    }
    // ReactRootView is expected to be initialized with the main React Activity as a context but
    // in case of Expo the activity is wrapped in ContextWrapper and we need to unwrap it
    Context context = ((ReactRootView) parent).getContext();
    while (!(context instanceof FragmentActivity) && context instanceof ContextWrapper) {
      context = ((ContextWrapper) context).getBaseContext();
    }
    if (!(context instanceof FragmentActivity)) {
      throw new IllegalStateException(
              "In order to use RNScreens components your app's activity need to extend ReactFragmentActivity or ReactCompatActivity");
    }
    return (FragmentActivity) context;
  }

  private FragmentTransaction getOrCreateTransaction() {
    if (mCurrentTransaction == null) {
      mCurrentTransaction = findRootFragmentActivity().getSupportFragmentManager().beginTransaction();
      mCurrentTransaction.setReorderingAllowed(true);
    }
    return mCurrentTransaction;
  }

  private void tryCommitTransaction() {
    if (mCurrentTransaction != null) {
      mCurrentTransaction.commitAllowingStateLoss();
      mCurrentTransaction = null;
    }
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    mIsAttached = true;
    updateIfNeeded();
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    mIsAttached = false;
  }

  private void updateIfNeeded() {
    if (!mNeedUpdate || !mIsAttached) {
      return;
    }
    mNeedUpdate = false;

    Screen newTop = null;
    if (mScreens.size() > 0) {
      newTop = mScreens.get(mScreens.size() - 1);
    }

    if (mTopScreen == null || !mTopScreen.equals(newTop)) {

      if (mTopScreen != null && mStack != null && mStack.contains(newTop)) {
        // new top screen has already been added to stack, we do "back" animation
        getOrCreateTransaction()
                .replace(getId(), newTop.getFragment())
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_CLOSE);
      } else {
        getOrCreateTransaction()
                .replace(getId(), newTop.getFragment())
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN);
      }

      mTopScreen = newTop;
      mStack.clear();
      mStack.addAll(mScreens);
    }

    tryCommitTransaction();
  }
}
