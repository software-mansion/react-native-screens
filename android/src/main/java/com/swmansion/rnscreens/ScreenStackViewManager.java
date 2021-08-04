package com.swmansion.rnscreens;

import android.view.View;
import android.view.ViewGroup;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

@ReactModule(name = ScreenStackViewManager.REACT_CLASS)
public class ScreenStackViewManager extends ViewGroupManager<ScreenStack> {

  protected static final String REACT_CLASS = "RNSScreenStack";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected ScreenStack createViewInstance(ThemedReactContext reactContext) {
    return new ScreenStack(reactContext);
  }

  @Override
  public void addView(ScreenStack parent, View child, int index) {
    if (!(child instanceof Screen)) {
      throw new IllegalArgumentException("Attempt attach child that is not of type RNScreen");
    }
    parent.addScreen((Screen) child, index);
  }

  @Override
  public void removeViewAt(ScreenStack parent, int index) {
    prepareOutTransition(parent.getScreenAt(index));
    parent.removeScreenAt(index);
  }

  private void prepareOutTransition(Screen screen) {
    startTransitionRecursive(screen);
  }

  private void startTransitionRecursive(ViewGroup parent) {
    for (int i = 0, size = parent.getChildCount(); i < size; i++) {
      View child = parent.getChildAt(i);
      parent.startViewTransition(child);
      if (child instanceof ScreenStackHeaderConfig) {
        // we want to start transition on children of the toolbar too,
        // which is not a child of ScreenStackHeaderConfig
        startTransitionRecursive(((ScreenStackHeaderConfig) child).getToolbar());
      }
      if (child instanceof ViewGroup) {
        startTransitionRecursive((ViewGroup) child);
      }
    }
  }

  @Override
  public int getChildCount(ScreenStack parent) {
    return parent.getScreenCount();
  }

  @Override
  public View getChildAt(ScreenStack parent, int index) {
    return parent.getScreenAt(index);
  }

  @Override
  public boolean needsCustomLayoutForChildren() {
    return true;
  }
}
