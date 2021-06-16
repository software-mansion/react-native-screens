package com.swmansion.rnscreens;

import android.view.View;
import android.view.ViewParent;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class ScreenStackHeaderSubview extends ReactViewGroup {

  private int mReactWidth, mReactHeight;
  private Type mType = Type.RIGHT;

  public ScreenStackHeaderSubview(ReactContext context) {
    super(context);
  }

  @Override
  protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    if (MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY
        && MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY) {
      // dimensions provided by react
      mReactWidth = MeasureSpec.getSize(widthMeasureSpec);
      mReactHeight = MeasureSpec.getSize(heightMeasureSpec);
      ViewParent parent = getParent();
      if (parent != null) {
        forceLayout();
        ((View) parent).requestLayout();
      }
    }
    setMeasuredDimension(mReactWidth, mReactHeight);
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    // no-op
  }

  public Type getType() {
    return mType;
  }

  public void setType(Type type) {
    mType = type;
  }

  public enum Type {
    LEFT,
    CENTER,
    RIGHT,
    BACK
  }
}
