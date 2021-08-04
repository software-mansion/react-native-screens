package com.swmansion.rnscreens;

import android.view.View;
import android.view.ViewParent;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nullable;

public class LifecycleHelper {

  private final Map<View, Lifecycle> mViewToLifecycleMap = new HashMap<>();
  private final View.OnLayoutChangeListener mRegisterOnLayoutChange =
      new View.OnLayoutChangeListener() {
        @Override
        public void onLayoutChange(
            View view, int i, int i1, int i2, int i3, int i4, int i5, int i6, int i7) {
          registerViewWithLifecycleOwner(view);
          view.removeOnLayoutChangeListener(this);
        }
      };

  public static @Nullable Fragment findNearestScreenFragmentAncestor(View view) {
    ViewParent parent = view.getParent();
    while (parent != null && !(parent instanceof Screen)) {
      parent = parent.getParent();
    }
    if (parent != null) {
      return ((Screen) parent).getFragment();
    }
    return null;
  }

  private void registerViewWithLifecycleOwner(View view) {
    Fragment parent = findNearestScreenFragmentAncestor(view);
    if (parent != null && view instanceof LifecycleObserver) {
      Lifecycle lifecycle = parent.getLifecycle();
      lifecycle.addObserver((LifecycleObserver) view);
      mViewToLifecycleMap.put(view, lifecycle);
    }
  }

  public <T extends View & LifecycleObserver> void register(T view) {
    // we need to wait until view is mounted in the hierarchy as this method is called only at the
    // moment of the view creation. In order to register lifecycle observer we need to find ancestor
    // of type Screen and this can only happen when the view is properly attached. We rely on
    // Android's onLayout callback being triggered when the view gets added to the hierarchy and
    // only then we attempt to locate lifecycle owner ancestor.
    view.addOnLayoutChangeListener(mRegisterOnLayoutChange);
  }

  public <T extends View & LifecycleObserver> void unregister(T view) {
    Lifecycle lifecycle = mViewToLifecycleMap.get(view);
    if (lifecycle != null) {
      lifecycle.removeObserver(view);
    }
  }
}
