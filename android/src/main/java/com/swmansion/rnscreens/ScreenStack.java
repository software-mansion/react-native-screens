package com.swmansion.rnscreens;

import android.content.Context;
import androidx.fragment.app.Fragment;
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

  public void goBack() {
    Screen topScreen = getTopScreen();
    mDismissed.add(topScreen);
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

  public static final class FakerFragment extends Fragment {

  }

  @Override
  protected void onUpdate() {
    Screen newTop = getTopScreen();

    if (mTopScreen == null || !mTopScreen.equals(newTop)) {

//      findRootFragmentActivity().getSupportFragmentManager().popBackStackImmediate(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);

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

//    getOrCreateTransaction()
  }
}
