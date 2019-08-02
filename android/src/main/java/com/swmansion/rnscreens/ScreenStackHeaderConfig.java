package com.swmansion.rnscreens;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.TextView;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.views.text.ReactFontManager;

public class ScreenStackHeaderConfig extends ViewGroup {

  private static final float TOOLBAR_ELEVATION = PixelUtil.toPixelFromDIP(4);

  private static final class ToolbarWithLayoutLoop extends Toolbar {

    private final Runnable mLayoutRunnable = new Runnable() {
      @Override
      public void run() {
        mLayoutEnqueued = false;
        measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
      }
    };
    private boolean mLayoutEnqueued = false;

    public ToolbarWithLayoutLoop(Context context) {
      super(context);
    }

    @Override
    public void requestLayout() {
      super.requestLayout();

      if (!mLayoutEnqueued) {
        mLayoutEnqueued = true;
        post(mLayoutRunnable);
      }
    }
  }

  private final ScreenStackHeaderSubview mConfigSubviews[] = new ScreenStackHeaderSubview[3];
  private int mSubviewsCount = 0;
  private String mTitle;
  private int mTitleColor;
  private String mTitleFontFamily;
  private int mTitleFontSize;
  private int mBackgroundColor;
  private boolean mIsHidden;
  private boolean mIsBackButtonHidden;
  private boolean mIsShadowHidden;
  private int mTintColor;
  private int mWidth;
  private int mHeight;
  private final Toolbar mToolbar;

  public ScreenStackHeaderConfig(Context context) {
    super(context);
    setVisibility(View.GONE);

    mToolbar = new ToolbarWithLayoutLoop(context);

    // set primary color as background by default
    TypedValue tv = new TypedValue();
    if (context.getTheme().resolveAttribute(android.R.attr.colorPrimary, tv, true)) {
      mToolbar.setBackgroundColor(tv.data);
    }

    mWidth = 0;
    mHeight = 0;

    if (context.getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true)) {
      mHeight = TypedValue.complexToDimensionPixelSize(tv.data, getResources().getDisplayMetrics());
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
    update();
  }

  private boolean isStackRootScreen() {
    ViewParent screen = getParent();
    if (screen instanceof Screen) {
      ViewParent stack = ((Screen) screen).getFragment().getView().getParent();
      if (stack instanceof ScreenStack) {
        return ((ScreenStack) stack).getScreenCount() == 1;
      }
    }
    // something is broken with the view hierarchy, lets just treat this as it was a root
    return true;
  }

  private void update() {
    Screen parent = (Screen) getParent();
    if (mIsHidden) {
      if (mToolbar.getParent() != null) {
        parent.removeView(mToolbar);
      }
      return;
    }

    if (mToolbar.getParent() == null) {
      parent.addView(mToolbar);
    }

    AppCompatActivity activity = (AppCompatActivity) parent.getFragment().getActivity();
    activity.setSupportActionBar(mToolbar);
    ActionBar actionBar = activity.getSupportActionBar();

    // hide back button
    actionBar.setDisplayHomeAsUpEnabled(isStackRootScreen() ? false : !mIsBackButtonHidden);

    // shadow
    actionBar.setElevation(mIsShadowHidden ? 0 : TOOLBAR_ELEVATION);

    // title
    actionBar.setTitle(mTitle);
    TextView titleTextView = getTitleTextView();
    if (mTitleColor != 0) {
      mToolbar.setTitleTextColor(mTitleColor);
    }
    if (titleTextView != null) {
      if (mTitleFontFamily != null) {
        titleTextView.setTypeface(ReactFontManager.getInstance().getTypeface(
                mTitleFontFamily, 0, getContext().getAssets()));
      }
      if (mTitleFontSize > 0) {
        titleTextView.setTextSize(mTitleFontSize);
      }
    }

    // background
    if (mBackgroundColor != 0) {
      mToolbar.setBackgroundColor(mBackgroundColor);
    }

    // color
    if (mTintColor != 0) {
      Drawable navigationIcon = mToolbar.getNavigationIcon();
      if (navigationIcon != null) {
        navigationIcon.setColorFilter(mTintColor, PorterDuff.Mode.SRC_ATOP);
      }
    }

    // subviews
    for (int i = 0; i < mSubviewsCount; i++) {
      ScreenStackHeaderSubview view = mConfigSubviews[i];
      ScreenStackHeaderSubview.Type type = view.getType();

      Toolbar.LayoutParams params =
              new Toolbar.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.MATCH_PARENT);

      switch (type) {
        case LEFT:
          // when there is a left item we need to disable navigation icon
          // we also hide title as there is no other way to display left side items
          mToolbar.setNavigationIcon(null);
          mToolbar.setTitle(null);
          params.gravity = Gravity.LEFT;
          break;
        case RIGHT:
          params.gravity = Gravity.RIGHT;
          break;
        case TITLE:
          params.width = LayoutParams.MATCH_PARENT;
          mToolbar.setTitle(null);
        case CENTER:
          params.gravity = Gravity.CENTER_HORIZONTAL;
          break;
      }

      view.setLayoutParams(params);
      if (view.getParent() == null) {
        mToolbar.addView(view);
      }
    }
  }

  public ScreenStackHeaderSubview getConfigSubview(int index) {
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

  public void addConfigSubview(ScreenStackHeaderSubview child, int index) {
    if (mConfigSubviews[index] == null) {
      mSubviewsCount++;
    }
    mConfigSubviews[index] = child;
  }

  private TextView getTitleTextView() {
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
    mTitle = title;
  }

  public void setTitleFontFamily(String titleFontFamily) {
    mTitleFontFamily = titleFontFamily;
  }

  public void setTitleFontSize(int titleFontSize) {
    mTitleFontSize = titleFontSize;
  }

  public void setTitleColor(int color) {
    mTitleColor = color;
  }

  public void setTintColor(int color) {
    mTintColor = color;
  }

  public void setBackgroundColor(int color) {
    mBackgroundColor = color;
  }

  public void setHideShadow(boolean hideShadow) {
    mIsShadowHidden = hideShadow;
  }

  public void setHideBackButton(boolean hideBackButton) {
    mIsBackButtonHidden = hideBackButton;
  }

  public void setHidden(boolean hidden) {
    mIsHidden = hidden;
  }
}
