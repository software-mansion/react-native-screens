package com.swmansion.rnscreens;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;

public class ScreenStackHeaderSubview extends ReactViewGroup {

  public enum Type {
    LEFT,
    CENTER,
    TITLE,
    RIGHT
  }

  private int mReactWidth, mReactHeight;

  @Override
  protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    if (MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY &&
            MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY) {
      // dimensions provided by react
      mReactWidth = MeasureSpec.getSize(widthMeasureSpec);
      mReactHeight = MeasureSpec.getSize(heightMeasureSpec);
    }
    setMeasuredDimension(mReactWidth, mReactHeight);
  }

  private Type mType = Type.RIGHT;

  public ScreenStackHeaderSubview(Context context) {
    super(context);
  }

  public void setType(Type type) {
    mType = type;
  }

  public Type getType() {
    return mType;
  }
}
