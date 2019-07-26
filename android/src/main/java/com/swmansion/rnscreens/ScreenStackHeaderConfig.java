package com.swmansion.rnscreens;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.PixelUtil;

public class ScreenStackHeaderConfig extends ViewGroup {

  private static final class ToolbarWithLayoutLoop extends Toolbar {

    public ToolbarWithLayoutLoop(Context context) {
      super(context);
    }

    private final Runnable mLayoutRunnable = new Runnable() {
      @Override
      public void run() {
        measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
      }
    };

    @Override
    public void requestLayout() {
      super.requestLayout();

      // The toolbar relies on a measure + layout pass happening after it calls requestLayout().
      // Without this, certain calls (e.g. setLogo) only take effect after a second invalidation.
      post(mLayoutRunnable);
    }
  }

  private final View mConfigSubviews[] = new View[3];
  private int mSubviewsCount = 0;
  private boolean mIsHidden;
  private int mWidth;
  private int mHeight;
  private final Toolbar mToolbar;

  public ScreenStackHeaderConfig(Context context) {
    super(context);
    mToolbar = new ToolbarWithLayoutLoop(context);
    mToolbar.setTitle("Lol");
    mToolbar.setBackgroundColor(getResources().getColor(android.R.color.darker_gray));
    mToolbar.setElevation(PixelUtil.toPixelFromDIP(4));

    mWidth = 0;
    mHeight = 0;

    TypedValue tv = new TypedValue();
    if (context.getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true))
    {
      mHeight = TypedValue.complexToDimensionPixelSize(tv.data,getResources().getDisplayMetrics());
    }


  }

  private void updateToolbarLayout() {
    mToolbar.measure(
            View.MeasureSpec.makeMeasureSpec(mWidth, View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(mHeight, View.MeasureSpec.EXACTLY));
    mToolbar.layout(0, 0, mWidth, mHeight);
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int r, int b) {
    if (mWidth != (r - l)) {
      mWidth = (r - l);
      updateToolbarLayout();
    }
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    Screen parent = (Screen) getParent();
    if (mToolbar.getParent() == null) {
      parent.addView(mToolbar);
    }

    AppCompatActivity activity = (AppCompatActivity) parent.getFragment().getActivity();
    activity.setSupportActionBar(mToolbar);
    activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    activity.getSupportActionBar().setHomeButtonEnabled(true);
    activity.getSupportActionBar().setDisplayShowTitleEnabled(true);
  }

  public View getConfigSubview(int index) {
    return mConfigSubviews[index];
  }

  public int getConfigSubviewsCount() {
    return mSubviewsCount;
  }

  public void removeConfigSubview(int index) {
    if (mConfigSubviews[index] != null) {
      mSubviewsCount--;
    }
    mConfigSubviews[index] = null;
  }

  public void addConfigSubview(View child, int index) {
    if (mConfigSubviews[index] == null) {
      mSubviewsCount++;
    }
    mConfigSubviews[index] = child;
  }

  public void setTitle(String title) {
    mToolbar.setTitle(title);
  }

  public void setHidden(boolean hidden) {
    mIsHidden = hidden;
  }
}
