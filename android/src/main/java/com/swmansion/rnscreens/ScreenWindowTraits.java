package com.swmansion.rnscreens;

import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.annotation.TargetApi;
import android.app.Activity;
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

  protected static void setOrientation(Screen screen, final Activity activity) {
    if (screen == null || activity == null) {
      return;
    }
    activity.setRequestedOrientation(screen.getScreenOrientation());
  }

  protected static void setColor(Screen screen, final Activity activity, ReactContext context) {
    if (screen == null || activity == null || context == null) {
      return;
    }

    final double colorDouble = screen.getStatusBarColor();
    final boolean animated = screen.isStatusBarAnimated();

    final int color = (int) colorDouble;

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
    if (screen == null || activity == null || context == null) {
      return;
    }

    final String style = screen.getStatusBarStyle();

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
    if (screen == null || activity == null || context == null) {
      return;
    }

    final boolean translucent = screen.isStatusBarTranslucent();

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
    if (screen == null || activity == null) {
      return;
    }

    final boolean hidden = screen.isStatusBarHidden();

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

  protected static Screen findScreenForTrait(Screen screen, String trait) {
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

  private static @Nullable Screen findParentWithTraitSet(Screen screen, String trait) {
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

  protected static boolean hasChildScreenWithTraitSet(Screen screen, String trait) {
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

  private static boolean checkTraitForScreen(Screen screen, String trait) {
    switch (trait) {
      case "orientation":
        return screen.getScreenOrientation() != null;
      case "color":
        return screen.getStatusBarColor() != null;
      case "style":
        return screen.getStatusBarStyle() != null;
      case "translucent":
        return screen.isStatusBarTranslucent() != null;
      case "hidden":
        return screen.isStatusBarHidden() != null;
      default:
        throw new IllegalArgumentException("Wrong trait passed: " + trait);
    }
  }

}
