package com.swmansion.rnscreens;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.graphics.Paint;
import android.os.Build;
import android.os.Parcelable;
import android.util.SparseArray;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.Interpolator;
import android.view.animation.PathInterpolator;
import android.view.animation.RotateAnimation;
import android.view.animation.ScaleAnimation;
import android.view.animation.TranslateAnimation;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebView;
import android.widget.TextView;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerModule;

public class Screen extends ViewGroup {

  private static final OnAttachStateChangeListener sShowSoftKeyboardOnAttach =
      new OnAttachStateChangeListener() {

        @Override
        public void onViewAttachedToWindow(View view) {
          InputMethodManager inputMethodManager =
              (InputMethodManager) view.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
          inputMethodManager.showSoftInput(view, 0);
          view.removeOnAttachStateChangeListener(sShowSoftKeyboardOnAttach);
        }

        @Override
        public void onViewDetachedFromWindow(View view) {}
      };
  private @Nullable ScreenFragment mFragment;
  private @Nullable ScreenContainer mContainer;
  private ActivityState mActivityState;
  private boolean mTransitioning;
  private StackPresentation mStackPresentation = StackPresentation.PUSH;
  private ReplaceAnimation mReplaceAnimation = ReplaceAnimation.POP;
  private StackAnimation mStackAnimation = StackAnimation.DEFAULT;
  private boolean mGestureEnabled = true;
  private Integer mScreenOrientation;
  private String mStatusBarStyle;
  private Boolean mStatusBarHidden;
  private Boolean mStatusBarTranslucent;
  private Integer mStatusBarColor;
  private Boolean mStatusBarAnimated;
  private AnimationSet mCustomEnteringAnimations;
  private AnimationSet mCustomExitingAnimations;

  public Screen(ReactContext context) {
    super(context);
    // we set layout params as WindowManager.LayoutParams to workaround the issue with TextInputs
    // not displaying modal menus (e.g., copy/paste or selection). The missing menus are due to the
    // fact that TextView implementation is expected to be attached to window when layout happens.
    // Then, at the moment of layout it checks whether window type is in a reasonable range to tell
    // whether it should enable selection controlls (see Editor.java#prepareCursorControllers).
    // With screens, however, the text input component can be laid out before it is attached, in
    // that case TextView tries to get window type property from the oldest existing parent, which
    // in this case is a Screen class, as it is the root of the screen that is about to be attached.
    // Setting params this way is not the most elegant way to solve this problem but workarounds it
    // for the time being
    setLayoutParams(new WindowManager.LayoutParams(WindowManager.LayoutParams.TYPE_APPLICATION));
  }

  @Override
  protected void onAnimationStart() {
    super.onAnimationStart();
    if (mFragment != null) {
      mFragment.onViewAnimationStart();
    }
  }

  @Override
  protected void onAnimationEnd() {
    super.onAnimationEnd();
    if (mFragment != null) {
      mFragment.onViewAnimationEnd();
    }
  }

  @Override
  protected void dispatchSaveInstanceState(SparseArray<Parcelable> container) {
    // do nothing, react native will keep the view hierarchy so no need to serialize/deserialize
    // view's states. The side effect of restoring is that TextInput components would trigger
    // set-text events which may confuse text input handling.
  }

  @Override
  protected void dispatchRestoreInstanceState(SparseArray<Parcelable> container) {
    // ignore restoring instance state too as we are not saving anything anyways.
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int r, int b) {
    if (changed) {
      final int width = r - l;
      final int height = b - t;
      final ReactContext reactContext = (ReactContext) getContext();
      reactContext.runOnNativeModulesQueueThread(
          new GuardedRunnable(reactContext) {
            @Override
            public void runGuarded() {
              reactContext
                  .getNativeModule(UIManagerModule.class)
                  .updateNodeSize(getId(), width, height);
            }
          });
    }
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    // This method implements a workaround for RN's autoFocus functionality. Because of the way
    // autoFocus is implemented it sometimes gets triggered before native text view is mounted. As
    // a result Android ignores calls for opening soft keyboard and here we trigger it manually
    // again after the screen is attached.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      View view = getFocusedChild();
      if (view != null) {
        while (view instanceof ViewGroup) {
          view = ((ViewGroup) view).getFocusedChild();
        }
        if (view instanceof TextView) {
          TextView textView = (TextView) view;
          if (textView.getShowSoftInputOnFocus()) {
            textView.addOnAttachStateChangeListener(sShowSoftKeyboardOnAttach);
          }
        }
      }
    }
  }

  protected ScreenStackHeaderConfig getHeaderConfig() {
    View child = getChildAt(0);
    if (child instanceof ScreenStackHeaderConfig) {
      return (ScreenStackHeaderConfig) child;
    }
    return null;
  }

  /**
   * While transitioning this property allows to optimize rendering behavior on Android and provide
   * a correct blending options for the animated screen. It is turned on automatically by the
   * container when transitioning is detected and turned off immediately after
   */
  public void setTransitioning(boolean transitioning) {
    if (mTransitioning == transitioning) {
      return;
    }
    mTransitioning = transitioning;
    boolean isWebViewInScreen = hasWebView(this);
    if (isWebViewInScreen && getLayerType() != View.LAYER_TYPE_HARDWARE) {
      return;
    }
    super.setLayerType(
        transitioning && !isWebViewInScreen ? View.LAYER_TYPE_HARDWARE : View.LAYER_TYPE_NONE,
        null);
  }

  private boolean hasWebView(ViewGroup viewGroup) {
    for (int i = 0; i < viewGroup.getChildCount(); i++) {
      View child = viewGroup.getChildAt(i);
      if (child instanceof WebView) {
        return true;
      } else if (child instanceof ViewGroup) {
        if (hasWebView((ViewGroup) child)) {
          return true;
        }
      }
    }
    return false;
  }

  public StackAnimation getStackAnimation() {
    return mStackAnimation;
  }

  public void setStackAnimation(StackAnimation stackAnimation) {
    mStackAnimation = stackAnimation;
  }

  public ReplaceAnimation getReplaceAnimation() {
    return mReplaceAnimation;
  }

  public void setReplaceAnimation(ReplaceAnimation replaceAnimation) {
    mReplaceAnimation = replaceAnimation;
  }

  public StackPresentation getStackPresentation() {
    return mStackPresentation;
  }

  public void setStackPresentation(StackPresentation stackPresentation) {
    mStackPresentation = stackPresentation;
  }

  @Override
  public void setLayerType(int layerType, @Nullable Paint paint) {
    // ignore - layer type is controlled by `transitioning` prop
  }

  protected @Nullable ScreenFragment getFragment() {
    return mFragment;
  }

  protected void setFragment(ScreenFragment fragment) {
    mFragment = fragment;
  }

  protected @Nullable ScreenContainer getContainer() {
    return mContainer;
  }

  protected void setContainer(@Nullable ScreenContainer container) {
    mContainer = container;
  }

  public ActivityState getActivityState() {
    return mActivityState;
  }

  public void setActivityState(ActivityState activityState) {
    if (activityState == mActivityState) {
      return;
    }
    mActivityState = activityState;
    if (mContainer != null) {
      mContainer.notifyChildUpdate();
    }
  }

  public boolean isGestureEnabled() {
    return mGestureEnabled;
  }

  public void setGestureEnabled(boolean gestureEnabled) {
    mGestureEnabled = gestureEnabled;
  }

  public Integer getScreenOrientation() {
    return mScreenOrientation;
  }

  public void setScreenOrientation(String screenOrientation) {
    if (screenOrientation == null) {
      mScreenOrientation = null;
      return;
    }

    ScreenWindowTraits.applyDidSetOrientation();

    switch (screenOrientation) {
      case "all":
        mScreenOrientation = ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR;
        break;
      case "portrait":
        mScreenOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT;
        break;
      case "portrait_up":
        mScreenOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
        break;
      case "portrait_down":
        mScreenOrientation = ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT;
        break;
      case "landscape":
        mScreenOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE;
        break;
      case "landscape_left":
        mScreenOrientation = ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE;
        break;
      case "landscape_right":
        mScreenOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
        break;
      default:
        mScreenOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED;
        break;
    }

    if (getFragment() != null) {
      ScreenWindowTraits.setOrientation(this, getFragment().tryGetActivity());
    }
  }

  public String getStatusBarStyle() {
    return mStatusBarStyle;
  }

  public void setStatusBarStyle(String statusBarStyle) {
    if (statusBarStyle != null) {
      ScreenWindowTraits.applyDidSetStatusBarAppearance();
    }

    mStatusBarStyle = statusBarStyle;
    if (getFragment() != null) {
      ScreenWindowTraits.setStyle(
          this, getFragment().tryGetActivity(), getFragment().tryGetContext());
    }
  }

  public void setStatusBarHidden(Boolean statusBarHidden) {
    if (statusBarHidden != null) {
      ScreenWindowTraits.applyDidSetStatusBarAppearance();
    }

    mStatusBarHidden = statusBarHidden;
    if (getFragment() != null) {
      ScreenWindowTraits.setHidden(this, getFragment().tryGetActivity());
    }
  }

  public Boolean isStatusBarHidden() {
    return mStatusBarHidden;
  }

  public void setStatusBarTranslucent(Boolean statusBarTranslucent) {
    if (statusBarTranslucent != null) {
      ScreenWindowTraits.applyDidSetStatusBarAppearance();
    }

    mStatusBarTranslucent = statusBarTranslucent;
    if (getFragment() != null) {
      ScreenWindowTraits.setTranslucent(
          this, getFragment().tryGetActivity(), getFragment().tryGetContext());
    }
  }

  public Boolean isStatusBarTranslucent() {
    return mStatusBarTranslucent;
  }

  public Integer getStatusBarColor() {
    return mStatusBarColor;
  }

  public void setStatusBarColor(Integer statusBarColor) {
    if (statusBarColor != null) {
      ScreenWindowTraits.applyDidSetStatusBarAppearance();
    }

    mStatusBarColor = statusBarColor;
    if (getFragment() != null) {
      ScreenWindowTraits.setColor(
          this, getFragment().tryGetActivity(), getFragment().tryGetContext());
    }
  }

  public Boolean isStatusBarAnimated() {
    return mStatusBarAnimated;
  }

  public void setStatusBarAnimated(Boolean statusBarAnimated) {
    mStatusBarAnimated = statusBarAnimated;
  }

  public void setAnimationSpec(ReadableMap animationSpec) {
    ReadableMap enteringSpec = animationSpec.getMap("entering");
    ReadableMap exitingSpec = animationSpec.getMap("exiting");

    AnimationSet emptySet = null;
    if (enteringSpec == null || exitingSpec == null) {
      emptySet = new AnimationSet(true);
      emptySet.setDuration(400); // medium animation duration
    }

    mCustomEnteringAnimations =
        enteringSpec == null ? emptySet : addAnimationsFromSpec(enteringSpec, true);
    mCustomExitingAnimations =
        exitingSpec == null ? emptySet : addAnimationsFromSpec(exitingSpec, false);
  }

  private AnimationSet addAnimationsFromSpec(ReadableMap animationSpec, boolean entering) {
    AnimationSet animationSet = new AnimationSet(false);

    int defaultDuration = 400;
    if (animationSpec.hasKey("duration")) {
      defaultDuration = animationSpec.getInt("duration");
    }

    Interpolator defaultInterpolator = new PathInterpolator(0.42f, 0.0f, 0.58f, 1.0f);
    if (animationSpec.hasKey("interpolator")) {
      defaultInterpolator = interpolatorForName(animationSpec.getString("interpolator"));
    }

    ReadableMap alphaSpec = animationSpec.getMap("alpha");
    if (alphaSpec != null) {
      float alpha = (float) alphaSpec.getDouble("value");
      AlphaAnimation alphaAnimation;
      if (entering) {
        alphaAnimation = new AlphaAnimation(alpha, 1f);
      } else {
        alphaAnimation = new AlphaAnimation(1f, alpha);
      }
      setCommonOptions(alphaAnimation, defaultDuration, defaultInterpolator, alphaSpec);
      animationSet.addAnimation(alphaAnimation);
    }

    float pivotX = 0f;
    float pivotY = 0f;

    ReadableMap pivotSpec = animationSpec.getMap("pivot");
    if (pivotSpec != null) {
      pivotX = PixelUtil.toPixelFromDIP(pivotSpec.getDouble("x"));
      pivotY = PixelUtil.toPixelFromDIP(pivotSpec.getDouble("y"));
    }

    ReadableMap rotateSpec = animationSpec.getMap("rotate");
    if (rotateSpec != null) {
      float degrees = (float) rotateSpec.getDouble("degrees");
      RotateAnimation rotateAnimation;
      if (entering) {
        rotateAnimation = new RotateAnimation(degrees, 0f, pivotX, pivotY);
      } else {
        rotateAnimation = new RotateAnimation(0f, degrees, pivotX, pivotY);
      }
      setCommonOptions(rotateAnimation, defaultDuration, defaultInterpolator, rotateSpec);
      animationSet.addAnimation(rotateAnimation);
    }

    ReadableMap scaleSpec = animationSpec.getMap("scale");
    if (scaleSpec != null) {
      float x = (float) scaleSpec.getDouble("x");
      float y = (float) scaleSpec.getDouble("y");
      ScaleAnimation scaleAnimation;
      if (entering) {
        scaleAnimation = new ScaleAnimation(x, 1f, y, 1f, pivotX, pivotY);
      } else {
        scaleAnimation = new ScaleAnimation(1f, x, 1f, y, pivotX, pivotY);
      }
      setCommonOptions(scaleAnimation, defaultDuration, defaultInterpolator, scaleSpec);
      animationSet.addAnimation(scaleAnimation);
    }

    ReadableMap translateSpec = animationSpec.getMap("translate");
    if (translateSpec != null) {
      float x = (float) translateSpec.getDouble("x");
      float y = (float) translateSpec.getDouble("y");
      TranslateAnimation translateAnimation;
      if (entering) {
        translateAnimation = new TranslateAnimation(x, 0, y, 0);
      } else {
        translateAnimation = new TranslateAnimation(0, x, 0, y);
      }
      setCommonOptions(translateAnimation, defaultDuration, defaultInterpolator, translateSpec);
      animationSet.addAnimation(translateAnimation);
    }

    return animationSet;
  }

  void setCommonOptions(
      Animation animation,
      int defaultDuration,
      Interpolator defaultInterpolator,
      ReadableMap animationSpec) {
    if (animationSpec.hasKey("duration")) {
      animation.setDuration(animationSpec.getInt("duration"));
    } else {
      animation.setDuration(defaultDuration);
    }
    if (animationSpec.hasKey("interpolator")) {
      Interpolator interpolator = interpolatorForName(animationSpec.getString("interpolator"));
      animation.setInterpolator(interpolator);
    } else {
      animation.setInterpolator(defaultInterpolator);
    }
  }

  private static Interpolator interpolatorForName(String name) {
    // Values taken from
    // https://stackoverflow.com/a/19081554/13006595
    if ("easeIn".equals(name)) {
      return new PathInterpolator(0.42f, 0.0f, 1.0f, 1.0f);
    } else if ("easeOut".equals(name)) {
      return new PathInterpolator(0.0f, 0.0f, 0.58f, 1.0f);
    } else if ("easeInOut".equals(name)) {
      return new PathInterpolator(0.42f, 0.0f, 0.58f, 1.0f);
    } else if ("linear".equals(name)) {
      return new PathInterpolator(0.0f, 0.0f, 1.0f, 1.0f);
    }
    return new PathInterpolator(0.42f, 0.0f, 0.58f, 1.0f);
  }

  public @Nullable AnimationSet getCustomEnteringAnimations() {
    return mCustomEnteringAnimations;
  }

  public @Nullable AnimationSet getCustomExitingAnimations() {
    return mCustomExitingAnimations;
  }

  public enum StackPresentation {
    PUSH,
    MODAL,
    TRANSPARENT_MODAL
  }

  public enum StackAnimation {
    DEFAULT,
    NONE,
    FADE,
    SLIDE_FROM_BOTTOM,
    SLIDE_FROM_RIGHT,
    SLIDE_FROM_LEFT,
    FADE_FROM_BOTTOM,
    CUSTOM,
  }

  public enum ReplaceAnimation {
    PUSH,
    POP
  }

  public enum ActivityState {
    INACTIVE,
    TRANSITIONING_OR_BELOW_TOP,
    ON_TOP
  }

  public enum WindowTraits {
    ORIENTATION,
    COLOR,
    STYLE,
    TRANSLUCENT,
    HIDDEN,
    ANIMATED
  }
}
