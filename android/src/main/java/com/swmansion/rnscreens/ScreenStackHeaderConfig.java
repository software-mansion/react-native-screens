package com.swmansion.rnscreens;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.TextView;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.views.text.ReactFontManager;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.appbar.CollapsingToolbarLayout;

public class ScreenStackHeaderConfig extends ViewGroup {

  private final ScreenStackHeaderSubview mConfigSubviews[] = new ScreenStackHeaderSubview[3];
  private int mSubviewsCount = 0;
  private boolean mCollapsable;
  private String mTitle;
  private int mTitleColor;
  private String mTitleFontFamily;
  private float mTitleFontSize;
  private boolean mLargeTitle;
  private String mLargeTitleFontFamily;
  private float mLargeTitleFontSize;
  private int mBackgroundColor;
  private boolean mIsHidden;
  private boolean mGestureEnabled = true;
  private boolean mIsBackButtonHidden;
  private boolean mIsShadowHidden;
  private int mTintColor;
  private final Toolbar mToolbar;
  private final CollapsingToolbarLayout mCollapsingToolbarLayout;

  private boolean mIsAttachedToWindow = false;

  private OnClickListener mBackClickListener = new OnClickListener() {
    @Override
    public void onClick(View view) {
      getScreenStack().dismiss(getScreenFragment());
    }
  };

  public ScreenStackHeaderConfig(Context context) {
    super(context);
    setVisibility(View.GONE);

    mToolbar = new Toolbar(context);
    CollapsingToolbarLayout.LayoutParams toolbarLayoutParams = new CollapsingToolbarLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, getToolbarHeight());
    toolbarLayoutParams.setCollapseMode(CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN);
    mToolbar.setLayoutParams(toolbarLayoutParams);

    mCollapsingToolbarLayout = new CollapsingToolbarLayout(getContext());
    mCollapsingToolbarLayout.setFitsSystemWindows(true);
    mCollapsingToolbarLayout.setExpandedTitleMarginStart((int) PixelUtil.toPixelFromDIP(16));
    mCollapsingToolbarLayout.setExpandedTitleMarginEnd((int) PixelUtil.toPixelFromDIP(16));
    mCollapsingToolbarLayout.addView(mToolbar);

    // set primary color as background by default
    TypedValue tv = new TypedValue();
    if (context.getTheme().resolveAttribute(android.R.attr.colorPrimary, tv, true)) {
      mCollapsingToolbarLayout.setBackgroundColor(tv.data);
      mCollapsingToolbarLayout.setStatusBarScrimColor(tv.data);
    }
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int r, int b) {
    // no-op
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    mIsAttachedToWindow = true;
    onUpdate();
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    mIsAttachedToWindow = false;
  }

  private int getToolbarHeight() {
    TypedValue tv = new TypedValue();
    if (getContext().getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true)) {
      return TypedValue.complexToDimensionPixelSize(tv.data, getResources().getDisplayMetrics());
    }
    return (int) PixelUtil.toPixelFromDIP(56);
  }

  private Screen getScreen() {
    ViewParent screen = getParent();
    if (screen instanceof Screen) {
      return (Screen) screen;
    }
    return null;
  }

  private ScreenStack getScreenStack() {
    Screen screen = getScreen();
    if (screen  != null) {
      ScreenContainer container = screen.getContainer();
      if (container instanceof ScreenStack) {
        return (ScreenStack) container;
      }
    }
    return null;
  }

  private ScreenStackFragment getScreenFragment() {
    ViewParent screen = getParent();
    if (screen instanceof Screen) {
      Fragment fragment = ((Screen) screen).getFragment();
      if (fragment instanceof ScreenStackFragment) {
        return (ScreenStackFragment) fragment;
      }
    }
    return null;
  }

  public boolean isDismissable() {
    return mGestureEnabled;
  }

  public void onUpdate() {
    Screen parent = (Screen) getParent();
    final ScreenStack stack = getScreenStack();
    boolean isRoot = stack == null ? true : stack.getRootScreen() == parent;
    boolean isTop = stack == null ? true : stack.getTopScreen() == parent;

    if (!mIsAttachedToWindow || !isTop) {
      return;
    }

    if (mIsHidden) {
      if (mCollapsingToolbarLayout.getParent() != null) {
        getScreenFragment().removeToolbar();
      }
      return;
    }

    if (mCollapsingToolbarLayout.getParent() == null) {
      getScreenFragment().setToolbar(mCollapsingToolbarLayout);
    }

    AppCompatActivity activity = (AppCompatActivity) getScreenFragment().getActivity();
    activity.setSupportActionBar(mToolbar);
    ActionBar actionBar = activity.getSupportActionBar();

    // hide back button
    actionBar.setDisplayHomeAsUpEnabled(isRoot ? false : !mIsBackButtonHidden);

    // when setSupportActionBar is called a toolbar wrapper gets initialized that overwrites
    // navigation click listener. The default behavior set in the wrapper is to call into
    // menu options handlers, but we prefer the back handling logic to stay here instead.
    mToolbar.setNavigationOnClickListener(mBackClickListener);


    AppBarLayout.LayoutParams collapsingLayoutParams = new AppBarLayout.LayoutParams(
        AppBarLayout.LayoutParams.MATCH_PARENT,
        mLargeTitle ? (int) PixelUtil.toPixelFromDIP(156) : AppBarLayout.LayoutParams.WRAP_CONTENT);

    int scrollFlags = AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL | AppBarLayout.LayoutParams.SCROLL_FLAG_SNAP;
    if (mCollapsable) {
      scrollFlags |= AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS;
      scrollFlags |= AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS_COLLAPSED;
    } else {
      scrollFlags |= AppBarLayout.LayoutParams.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED;
    }
    collapsingLayoutParams.setScrollFlags(scrollFlags);
    mCollapsingToolbarLayout.setLayoutParams(collapsingLayoutParams);

    // shadow
    getScreenFragment().setToolbarShadowHidden(mIsShadowHidden);

    // title
    actionBar.setTitle(mTitle);
    mCollapsingToolbarLayout.setTitle(mTitle);
    mCollapsingToolbarLayout.setTitleEnabled(mLargeTitle);

    TextView titleTextView = getTitleTextView();
    if (mTitleColor != 0) {
      mToolbar.setTitleTextColor(mTitleColor);
      mCollapsingToolbarLayout.setCollapsedTitleTextColor(mTitleColor);
      mCollapsingToolbarLayout.setExpandedTitleColor(mTitleColor);
    }
    if (titleTextView != null) {
      if (mTitleFontFamily != null) {
        Typeface titleTypeface = ReactFontManager.getInstance().getTypeface(
            mTitleFontFamily, 0, getContext().getAssets());
        titleTextView.setTypeface(titleTypeface);
        mCollapsingToolbarLayout.setCollapsedTitleTypeface(titleTypeface);
      }
      if (mLargeTitleFontFamily != null) {
        Typeface titleTypeface = ReactFontManager.getInstance().getTypeface(
            mLargeTitleFontFamily, 0, getContext().getAssets());
        mCollapsingToolbarLayout.setExpandedTitleTypeface(titleTypeface);
      }
      if (mTitleFontSize > 0) {
        titleTextView.setTextSize(mTitleFontSize);
      }
      if (mLargeTitleFontSize > 0) {
        // TODO: Figure out if it is possible to change font size.
      }
    }

    // background
    if (mBackgroundColor != 0) {
      mCollapsingToolbarLayout.setBackgroundColor(mBackgroundColor);
      mCollapsingToolbarLayout.setStatusBarScrimColor(mBackgroundColor);
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

  private void maybeUpdate() {
    if (getParent() != null) {
      onUpdate();
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
    maybeUpdate();
  }

  public void addConfigSubview(ScreenStackHeaderSubview child, int index) {
    if (mConfigSubviews[index] == null) {
      mSubviewsCount++;
    }
    mConfigSubviews[index] = child;
    maybeUpdate();
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

  public void setCollapsable(boolean collapsable) {
    mCollapsable = collapsable;
  }

  public void setTitle(String title) {
    mTitle = title;
  }

  public void setTitleFontFamily(String titleFontFamily) {
    mTitleFontFamily = titleFontFamily;
  }

  public void setTitleFontSize(float titleFontSize) {
    mTitleFontSize = titleFontSize;
  }

  public void setLargeTitle(Boolean largeTitle) {
    mLargeTitle = largeTitle;
  }

  public void setLargeTitleFontFamily(String titleFontFamily) {
    mLargeTitleFontFamily = titleFontFamily;
  }

  public void setLargeTitleFontSize(float titleFontSize) {
    mLargeTitleFontSize = titleFontSize;
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

  public void setGestureEnabled(boolean gestureEnabled) {
    mGestureEnabled = gestureEnabled;
  }

  public void setHideBackButton(boolean hideBackButton) {
    mIsBackButtonHidden = hideBackButton;
  }

  public void setHidden(boolean hidden) {
    mIsHidden = hidden;
  }
}
