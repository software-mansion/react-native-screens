package com.swmansion.rnscreens;

import android.content.Context;

import androidx.fragment.app.FragmentTransaction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class ScreenStack extends ScreenContainer {

  private final ArrayList<Screen> mStack = new ArrayList<>();
  private final Set<Screen> mDismissed = new HashSet<>();

  private Screen mTopScreen = null;

  public ScreenStack(Context context) {
    super(context);
  }

  public void dismiss(Screen screen) {
    mDismissed.add(screen);
    onUpdate();
  }

  public Screen getTopScreen() {
    for (int i = getScreenCount() - 1; i >= 0; i--) {
      Screen screen = getScreenAt(i);
      if (!mDismissed.contains(screen)) {
        return screen;
      }
    }
    throw new IllegalStateException("Stack is empty");
  }

  public Screen getRootScreen() {
    for (int i = 0, size = getScreenCount(); i < size; i++) {
      Screen screen = getScreenAt(i);
      if (!mDismissed.contains(screen)) {
        return screen;
      }
    }
    throw new IllegalStateException("Stack has no root screen set");
  }

  @Override
  protected void removeScreenAt(int index) {
    Screen toBeRemoved = getScreenAt(index);
    mDismissed.remove(toBeRemoved);
    super.removeScreenAt(index);
  }

  @Override
  protected void onUpdate() {
    // remove all screens previously on stack
    for (Screen screen : mStack) {
      if (!mScreens.contains(screen) || mDismissed.contains(screen)) {
        getOrCreateTransaction().remove(screen.getFragment());
      }
    }
    Screen newTop = getTopScreen();

    // add all new views that weren't on stack except for the top view, then detach them so they
    // can't be seen
    for (Screen screen : mScreens) {
      if (!screen.equals(newTop) && !mStack.contains(screen) && !mDismissed.contains(screen)) {
        getOrCreateTransaction().add(getId(), screen.getFragment()).detach(screen.getFragment());
      }
    }

    if (!mStack.contains(newTop)) {
      // if new top screen wasn't on stack we do "open animation" (or no animation if it is the first screen)
      getOrCreateTransaction().add(getId(), newTop.getFragment());
      if (mTopScreen != null) {
        // there was some other screen attached before
        getOrCreateTransaction().setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN);
      }
    } else if (mTopScreen != null && !mTopScreen.equals(newTop)) {
      // otherwise if we are performing top screen change we do "back animation"
      getOrCreateTransaction()
              .attach(mTopScreen.getFragment())
              .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_CLOSE);
    }

    mTopScreen = newTop;

    mStack.clear();
    mStack.addAll(mScreens);

    tryCommitTransaction();
  }
}
