package com.swmansion.rnscreens;

import android.content.Context;
import android.content.ContextWrapper;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.inputmethod.InputMethodManager;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.ChoreographerCompat;
import com.facebook.react.modules.core.ReactChoreographer;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class ScreenContainer<T extends ScreenFragment> extends ViewGroup {

  protected final ArrayList<T> mScreenFragments = new ArrayList<>();

  protected @Nullable FragmentManager mFragmentManager;
  private @Nullable FragmentTransaction mCurrentTransaction;
  private @Nullable FragmentTransaction mProcessingTransaction;
  private boolean mNeedUpdate;
  private boolean mIsAttached;
  private final ChoreographerCompat.FrameCallback mFrameCallback =
      new ChoreographerCompat.FrameCallback() {
        @Override
        public void doFrame(long frameTimeNanos) {
          updateIfNeeded();
        }
      };
  private boolean mLayoutEnqueued = false;
  private final ChoreographerCompat.FrameCallback mLayoutCallback =
      new ChoreographerCompat.FrameCallback() {
        @Override
        public void doFrame(long frameTimeNanos) {
          mLayoutEnqueued = false;
          measure(
              MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
              MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
          layout(getLeft(), getTop(), getRight(), getBottom());
        }
      };
  private @Nullable ScreenFragment mParentScreenFragment = null;

  public ScreenContainer(Context context) {
    super(context);
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int r, int b) {
    for (int i = 0, size = getChildCount(); i < size; i++) {
      getChildAt(i).layout(0, 0, getWidth(), getHeight());
    }
  }

  @Override
  public void removeView(View view) {
    // The below block is a workaround for an issue with keyboard handling within fragments. Despite
    // Android handles input focus on the fragments that leave the screen, the keyboard stays open
    // in a number of cases. The issue can be best reproduced on Android 5 devices, before some
    // changes in Android's InputMethodManager have been introduced (specifically around dismissing
    // the keyboard in onDetachedFromWindow). However, we also noticed the keyboard issue happen
    // intermittently on recent versions of Android as well. The issue hasn't been previously
    // noticed as in React Native <= 0.61 there was a logic that'd trigger keyboard dismiss upon a
    // blur event (the blur even gets dispatched properly, the keyboard just stays open despite
    // that) – note the change in RN core here:
    // https://github.com/facebook/react-native/commit/e9b4928311513d3cbbd9d875827694eab6cfa932
    // The workaround is to force-hide keyboard when the screen that has focus is dismissed (we
    // detect that in removeView as super.removeView causes the input view to un focus while keeping
    // the keyboard open).
    if (view == getFocusedChild()) {
      ((InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE))
          .hideSoftInputFromWindow(getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
    }
    super.removeView(view);
  }

  @Override
  public void requestLayout() {
    super.requestLayout();

    if (!mLayoutEnqueued && mLayoutCallback != null) {
      mLayoutEnqueued = true;
      // we use NATIVE_ANIMATED_MODULE choreographer queue because it allows us to catch the current
      // looper loop instead of enqueueing the update in the next loop causing a one frame delay.
      ReactChoreographer.getInstance()
          .postFrameCallback(
              ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE, mLayoutCallback);
    }
  }

  public boolean isNested() {
    return mParentScreenFragment != null;
  }

  protected void markUpdated() {
    if (!mNeedUpdate) {
      mNeedUpdate = true;
      // enqueue callback of NATIVE_ANIMATED_MODULE type as all view operations are executed in
      // DISPATCH_UI type and we want the callback to be called right after in the same frame.
      ReactChoreographer.getInstance()
          .postFrameCallback(
              ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE, mFrameCallback);
    }
  }

  protected void notifyChildUpdate() {
    markUpdated();
  }

  protected T adapt(Screen screen) {
    return (T) new ScreenFragment(screen);
  }

  protected void addScreen(Screen screen, int index) {
    T fragment = adapt(screen);
    screen.setFragment(fragment);
    mScreenFragments.add(index, fragment);
    screen.setContainer(this);
    markUpdated();
  }

  protected void removeScreenAt(int index) {
    mScreenFragments.get(index).getScreen().setContainer(null);
    mScreenFragments.remove(index);
    markUpdated();
  }

  protected void removeAllScreens() {
    for (ScreenFragment screenFragment : mScreenFragments) {
      screenFragment.getScreen().setContainer(null);
    }
    mScreenFragments.clear();
    markUpdated();
  }

  protected int getScreenCount() {
    return mScreenFragments.size();
  }

  protected Screen getScreenAt(int index) {
    return mScreenFragments.get(index).getScreen();
  }

  public @Nullable Screen getTopScreen() {
    for (ScreenFragment screenFragment : mScreenFragments) {
      if (getActivityState(screenFragment) == Screen.ActivityState.ON_TOP) {
        return screenFragment.getScreen();
      }
    }
    return null;
  }

  private void setFragmentManager(FragmentManager fm) {
    mFragmentManager = fm;
    updateIfNeeded();
  }

  private void setupFragmentManager() {
    ViewParent parent = this;
    // We traverse view hierarchy up until we find screen parent or a root view
    while (!(parent instanceof ReactRootView || parent instanceof Screen)
        && parent.getParent() != null) {
      parent = parent.getParent();
    }
    // If parent is of type Screen it means we are inside a nested fragment structure.
    // Otherwise we expect to connect directly with root view and get root fragment manager
    if (parent instanceof Screen) {
      ScreenFragment screenFragment = ((Screen) parent).getFragment();
      mParentScreenFragment = screenFragment;
      mParentScreenFragment.registerChildScreenContainer(this);
      setFragmentManager(screenFragment.getChildFragmentManager());
      return;
    }

    // we expect top level view to be of type ReactRootView, this isn't really necessary but in
    // order to find root view we test if parent is null. This could potentially happen also when
    // the view is detached from the hierarchy and that test would not correctly indicate the root
    // view. So in order to make sure we indeed reached the root we test if it is of a correct type.
    // This allows us to provide a more descriptive error message for the aforementioned case.
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
    setFragmentManager(((FragmentActivity) context).getSupportFragmentManager());
  }

  protected FragmentTransaction getOrCreateTransaction() {
    if (mCurrentTransaction == null) {
      mCurrentTransaction = mFragmentManager.beginTransaction();
      mCurrentTransaction.setReorderingAllowed(true);
    }
    return mCurrentTransaction;
  }

  protected void tryCommitTransaction() {
    if (mCurrentTransaction != null) {
      final FragmentTransaction transaction = mCurrentTransaction;
      mProcessingTransaction = transaction;
      mProcessingTransaction.runOnCommit(
          new Runnable() {
            @Override
            public void run() {
              if (mProcessingTransaction == transaction) {
                // we need to take into account that commit is initiated with some other transaction
                // while the previous one is still processing. In this case mProcessingTransaction
                // gets overwritten and we don't want to set it to null until the second transaction
                // is finished.
                mProcessingTransaction = null;
              }
            }
          });
      mCurrentTransaction.commitAllowingStateLoss();

      mCurrentTransaction = null;
    }
  }

  private void attachScreen(ScreenFragment screenFragment) {
    getOrCreateTransaction().add(getId(), screenFragment);
  }

  private void moveToFront(ScreenFragment screenFragment) {
    FragmentTransaction transaction = getOrCreateTransaction();
    transaction.remove(screenFragment);
    transaction.add(getId(), screenFragment);
  }

  private void detachScreen(ScreenFragment screenFragment) {
    getOrCreateTransaction().remove(screenFragment);
  }

  protected Screen.ActivityState getActivityState(ScreenFragment screenFragment) {
    return screenFragment.getScreen().getActivityState();
  }

  protected boolean hasScreen(ScreenFragment screenFragment) {
    return mScreenFragments.contains(screenFragment);
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    mIsAttached = true;
    mNeedUpdate = true;
    setupFragmentManager();
  }

  /** Removes fragments from fragment manager that are attached to this container */
  private void removeMyFragments() {
    FragmentTransaction transaction = mFragmentManager.beginTransaction();
    boolean hasFragments = false;

    for (Fragment fragment : mFragmentManager.getFragments()) {
      if (fragment instanceof ScreenFragment
          && ((ScreenFragment) fragment).mScreenView.getContainer() == this) {
        transaction.remove(fragment);
        hasFragments = true;
      }
    }
    if (hasFragments) {
      transaction.commitNowAllowingStateLoss();
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    // if there are pending transactions and this view is about to get detached we need to perform
    // them here as otherwise fragment manager will crash because it won't be able to find container
    // view. We also need to make sure all the fragments attached to the given container are removed
    // from fragment manager as in some cases fragment manager may be reused and in such case it'd
    // attempt to reattach previously registered fragments that are not removed
    if (mFragmentManager != null && !mFragmentManager.isDestroyed()) {
      removeMyFragments();
      mFragmentManager.executePendingTransactions();
    }

    if (mParentScreenFragment != null) {
      mParentScreenFragment.unregisterChildScreenContainer(this);
      mParentScreenFragment = null;
    }

    super.onDetachedFromWindow();
    mIsAttached = false;
    // When fragment container view is detached we force all its children to be removed.
    // It is because children screens are controlled by their fragments, which can often have a
    // delayed lifecycle (due to transitions). As a result due to ongoing transitions the fragment
    // may choose not to remove the view despite the parent container being completely detached
    // from the view hierarchy until the transition is over. In such a case when the container gets
    // re-attached while tre transition is ongoing, the child view would still be there and we'd
    // attempt to re-attach it to with a misconfigured fragment. This would result in a crash. To
    // avoid it we clear all the children here as we attach all the child fragments when the
    // container is reattached anyways. We don't use `removeAllViews` since it does not check if the
    // children are not already detached, which may lead to calling `onDetachedFromWindow` on them
    // twice.
    // We also get the size earlier, because we will be removing child views in `for` loop.
    int size = getChildCount();
    for (int i = size - 1; i >= 0; i--) {
      removeViewAt(i);
    }
  }

  @Override
  protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    for (int i = 0, size = getChildCount(); i < size; i++) {
      getChildAt(i).measure(widthMeasureSpec, heightMeasureSpec);
    }
  }

  private void updateIfNeeded() {
    if (!mNeedUpdate || !mIsAttached || mFragmentManager == null) {
      return;
    }
    mNeedUpdate = false;
    onUpdate();
  }

  private final void onUpdate() {
    // We double check if fragment manager have any pending transactions to run.
    // In performUpdate we often check whether some fragments are added to
    // manager to avoid adding them for the second time (which result in crash).
    // By design performUpdate should be called at most once per frame, so this
    // should never happen, but in case there are some pending transaction we
    // need to flush them here such that Fragment#isAdded checks reflect the
    // reality and that we don't have enqueued fragment add commands that will
    // execute shortly and cause "Fragment already added" crash.
    try {
        mFragmentManager.executePendingTransactions();
    } catch (Exception e){
        Log.e("ScreenContainer", "Error while executePendingTransactions with " + e.toString());
    }

    performUpdate();
    notifyContainerUpdate();
  }

  protected void performUpdate() {
    // detach screens that are no longer active
    Set<Fragment> orphaned = new HashSet<>(mFragmentManager.getFragments());
    for (ScreenFragment screenFragment : mScreenFragments) {
      if (getActivityState(screenFragment) == Screen.ActivityState.INACTIVE
          && screenFragment.isAdded()) {
        detachScreen(screenFragment);
      }
      orphaned.remove(screenFragment);
    }
    if (!orphaned.isEmpty()) {
      Object[] orphanedAry = orphaned.toArray();
      for (int i = 0; i < orphanedAry.length; i++) {
        if (orphanedAry[i] instanceof ScreenFragment) {
          if (((ScreenFragment) orphanedAry[i]).getScreen().getContainer() == null) {
            detachScreen((ScreenFragment) orphanedAry[i]);
          }
        }
      }
    }

    boolean transitioning = true;

    Screen topScreen = getTopScreen();
    if (topScreen != null) {
      // if there is an "onTop" screen it means the transition has ended
      transitioning = false;
    }

    // attach newly activated screens
    boolean addedBefore = false;
    for (ScreenFragment screenFragment : mScreenFragments) {
      Screen.ActivityState activityState = getActivityState(screenFragment);
      if (activityState != Screen.ActivityState.INACTIVE && !screenFragment.isAdded()) {
        addedBefore = true;
        attachScreen(screenFragment);
      } else if (activityState != Screen.ActivityState.INACTIVE && addedBefore) {
        moveToFront(screenFragment);
      }
      screenFragment.getScreen().setTransitioning(transitioning);
    }

    tryCommitTransaction();
  }

  protected void notifyContainerUpdate() {
    Screen topScreen = getTopScreen();
    if (topScreen != null) {
      topScreen.getFragment().onContainerUpdate();
    }
  }
}
