package com.swmansion.rnscreens;

import android.content.Context;
import android.graphics.Typeface;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.views.text.ReactFontManager;

public class ScreenStackHeaderConfig extends ViewGroup {

  private static final float TOOLBAR_ELEVATION = PixelUtil.toPixelFromDIP(4);

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
    mToolbar.setTitle(null);
    mToolbar.setBackgroundColor(getResources().getColor(android.R.color.darker_gray));
    mToolbar.setElevation(TOOLBAR_ELEVATION);

    View v = new View(context);
    v.setBackgroundColor(getResources().getColor(R.color.catalyst_redbox_background));

    Toolbar.LayoutParams params = new Toolbar.LayoutParams(80, 80);
    params.gravity = Gravity.LEFT;
    v.setLayoutParams(params);


    mToolbar.addView(v);

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
      // FIXME: the order of subviews is a subject to change as view manager can order
      // to insert new views or delete some of the old ones, we need to make sure that
      // view manager ignores toolbar view (not included in view count for example)
      parent.addView(mToolbar);
    }

    AppCompatActivity activity = (AppCompatActivity) parent.getFragment().getActivity();
    activity.setSupportActionBar(mToolbar);
//    activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
//    activity.getSupportActionBar().setHomeButtonEnabled(true);
//    activity.getSupportActionBar().setDisplayShowTitleEnabled(true);
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

  private TextView getTitleTextView() {
    if (mToolbar.getTitle() == null) {
      mToolbar.setTitle(" "); // set some title in order for toolbar to create title textview
    }
    for (int i = 0, size = mToolbar.getChildCount(); i < size; i++) {
      View view = mToolbar.getChildAt(i);
      if (view instanceof TextView) {
        TextView tv = (TextView) view;
        if (tv.getText().equals(mToolbar.getTitle())) {
          return tv;
        }
      }
    }
    return null;
  }

  public void setTitle(String title) {
    mToolbar.setTitle(title);
  }

  public void setTitleFontFamily(String titleFontFamily) {
    TextView tv = getTitleTextView();
    if (tv != null) {
      ReactFontManager.getInstance().getTypeface(titleFontFamily, 0, getContext().getAssets());
    }
  }

  public void setTitleFontSize(int titleFontSize) {
    TextView tv = getTitleTextView();
    if (tv != null) {
      tv.setTextSize(titleFontSize);
    }
  }

  public void setTitleColor(int color) {
    mToolbar.setTitleTextColor(color);
  }

  public void setHideShadow(boolean hideShadow) {
    mToolbar.setElevation(hideShadow ? 0 : TOOLBAR_ELEVATION);
  }

  public void setHidden(boolean hidden) {
    mIsHidden = hidden;
  }
}
