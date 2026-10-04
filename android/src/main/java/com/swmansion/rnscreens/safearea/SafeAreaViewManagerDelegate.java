package com.swmansion.rnscreens.safearea;

import androidx.annotation.Nullable;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.viewmanagers.RNSSafeAreaViewManagerDelegate;

/** Forwards props that are implemented by {@code ReactViewManager} but omitted by codegen. */
final class SafeAreaViewManagerDelegate
    extends RNSSafeAreaViewManagerDelegate<ReactViewGroup, SafeAreaViewManager> {
  SafeAreaViewManagerDelegate(SafeAreaViewManager viewManager) {
    super(viewManager);
  }

  @Override
  public void setProperty(ReactViewGroup view, String propName, @Nullable Object value) {
    if (ViewProps.POINTER_EVENTS.equals(propName)) {
      mViewManager.setPointerEvents(view, (String) value);
    } else {
      super.setProperty(view, propName, value);
    }
  }
}
