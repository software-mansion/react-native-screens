package com.swmansion.rnscreens;

import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Build;
import android.view.View;
import android.view.ViewParent;
import android.view.WindowInsets;
import android.view.WindowManager;

import androidx.annotation.Nullable;
import androidx.core.view.ViewCompat;

import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;

public class ScreenWindowTraits {
  private static boolean mDidSetOrientation = false;
  private static boolean mDidSetStatusBarAppearance = false;
  private static Integer mDefaultStatusBarColor = null;

  protected static void applyDidSetOrientation() {
    mDidSetOrientation = true;
  }

  public static boolean didSetOrientation() {
    return mDidSetOrientation;
  }

  protected static void applyDidSetStatusBarAppearance() {
    mDidSetStatusBarAppearance = true;
  }

  public static boolean didSetStatusBarAppearance() {
    return mDidSetStatusBarAppearance;
  }

  protected static void setOrientation(Screen screen, final Activity activity) {
    if (activity == null) {
      return;
    }

    final Integer orientation;

    if (screen != null && screen.getScreenOrientation() != null) {
      orientation = screen.getScreenOrientation();
    } else {
      orientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED;
    }

    activity.setRequestedOrientation(orientation);
  }

  protected static void setColor(Screen screenForColor, Screen ScreenForAnimated, final Activity activity, ReactContext context) {
    if (activity == null || context == null || Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
      return;
    }

    if (mDefaultStatusBarColor == null) {
      mDefaultStatusBarColor = activity.getWindow().getStatusBarColor();
    }

    final Integer color;
    final boolean animated;

    if (screenForColor != null && screenForColor.getStatusBarColor() != null) {
      color = screenForColor.getStatusBarColor();
    } else {
      color = mDefaultStatusBarColor;
    }

    if (ScreenForAnimated != null && ScreenForAnimated.isStatusBarAnimated() != null) {
      animated = ScreenForAnimated.isStatusBarAnimated();
    } else {
      animated = false;
    }

    UiThreadUtil.runOnUiThread(
            new GuardedRunnable(context) {
              @TargetApi(Build.VERSION_CODES.LOLLIPOP)
              @Override
              public void runGuarded() {
                activity
                        .getWindow()
                        .addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
                int curColor = activity.getWindow().getStatusBarColor();
                ValueAnimator colorAnimation =
                        ValueAnimator.ofObject(new ArgbEvaluator(), curColor, color);
                colorAnimation.addUpdateListener(
                        new ValueAnimator.AnimatorUpdateListener() {
                          @Override
                          public void onAnimationUpdate(ValueAnimator animator) {
                            activity.getWindow().setStatusBarColor((Integer) animator.getAnimatedValue());
                          }
                        });

                if (animated) {
                  colorAnimation.setDuration(300).setStartDelay(0);
                } else {
                  colorAnimation.setDuration(0).setStartDelay(300);
                }
                colorAnimation.start();
              }
            });
  }

  protected static void setStyle(Screen screen, final Activity activity, ReactContext context) {
    if (activity == null || context == null) {
      return;
    }

    final String style;

    if (screen != null && screen.getStatusBarStyle() != null) {
      style = screen.getStatusBarStyle();
    } else {
      style = "light";
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      UiThreadUtil.runOnUiThread(
              new Runnable() {
                @TargetApi(Build.VERSION_CODES.M)
                @Override
                public void run() {
                  View decorView = activity.getWindow().getDecorView();
                  int systemUiVisibilityFlags = decorView.getSystemUiVisibility();
                  if ("dark".equals(style)) {
                    systemUiVisibilityFlags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                  } else {
                    systemUiVisibilityFlags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                  }
                  decorView.setSystemUiVisibility(systemUiVisibilityFlags);
                }
              });
    }
  }

  protected static void setTranslucent(Screen screen, final Activity activity, ReactContext context) {
    if (activity == null || context == null) {
      return;
    }

    final boolean translucent;

    if (screen != null && screen.isStatusBarTranslucent() != null) {
      translucent = screen.isStatusBarTranslucent();
    } else {
      translucent = true;
    }

    UiThreadUtil.runOnUiThread(
            new GuardedRunnable(context) {
              @TargetApi(Build.VERSION_CODES.LOLLIPOP)
              @Override
              public void runGuarded() {
                // If the status bar is translucent hook into the window insets calculations
                // and consume all the top insets so no padding will be added under the status bar.
                View decorView = activity.getWindow().getDecorView();
                if (translucent) {
                  decorView.setOnApplyWindowInsetsListener(
                          new View.OnApplyWindowInsetsListener() {
                            @Override
                            public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                              WindowInsets defaultInsets = v.onApplyWindowInsets(insets);
                              return defaultInsets.replaceSystemWindowInsets(
                                      defaultInsets.getSystemWindowInsetLeft(),
                                      0,
                                      defaultInsets.getSystemWindowInsetRight(),
                                      defaultInsets.getSystemWindowInsetBottom());
                            }
                          });
                } else {
                  decorView.setOnApplyWindowInsetsListener(null);
                }

                ViewCompat.requestApplyInsets(decorView);
              }
            });
  }

  protected static void setHidden(Screen screen, final Activity activity) {
    if (activity == null) {
      return;
    }

    final boolean hidden;

    if (screen != null && screen.isStatusBarHidden() != null) {
      hidden = screen.isStatusBarHidden();
    } else {
      hidden = false;
    }

    UiThreadUtil.runOnUiThread(
            new Runnable() {
              @Override
              public void run() {
                if (hidden) {
                  activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
                  activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
                } else {
                  activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
                  activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
                }
              }
            });
  }

  protected static Screen findScreenForTrait(Screen screen, Screen.WindowTraits trait) {
    if (!hasChildScreenWithTraitSet(screen, trait)) {
      if (checkTraitForScreen(screen, trait)) {
        return screen;
      } else {
        // if this screen has no trait set and there is no child with trait set, we look for a parent that has the trait set
        return findParentWithTraitSet(screen, trait);
      }
    }
    return null;
  }

  private static @Nullable Screen findParentWithTraitSet(Screen screen, Screen.WindowTraits trait) {
    ViewParent parent = screen.getContainer();
    while (parent != null) {
      if (parent instanceof Screen) {
        if (checkTraitForScreen((Screen) parent, trait)) {
          return (Screen) parent;
        }
      }
      parent = parent.getParent();
    }
    return null;
  }

  protected static boolean hasChildScreenWithTraitSet(Screen screen, Screen.WindowTraits trait) {
    if (screen == null || screen.getFragment() == null) {
      return false;
    }
    for (ScreenContainer sc : screen.getFragment().getChildScreenContainers()) {
      // we check only the top screen for the trait
      Screen topScreen = sc.getTopScreen();
      if (topScreen != null && checkTraitForScreen(topScreen, trait)) {
        return true;
      }
      if (hasChildScreenWithTraitSet(topScreen, trait)) {
        return true;
      }
    }
    return false;
  }

  private static boolean checkTraitForScreen(Screen screen, Screen.WindowTraits trait) {
    switch (trait) {
      case ORIENTATION:
        return screen.getScreenOrientation() != null;
      case COLOR:
        return screen.getStatusBarColor() != null;
      case STYLE:
        return screen.getStatusBarStyle() != null;
      case TRANSLUCENT:
        return screen.isStatusBarTranslucent() != null;
      case HIDDEN:
        return screen.isStatusBarHidden() != null;
      case ANIMATED:
        return screen.isStatusBarAnimated() != null;
      default:
        throw new IllegalArgumentException("Wrong trait passed: " + trait);
    }
  }

}
