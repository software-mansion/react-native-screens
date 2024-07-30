/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* @generated by codegen project: GeneratePropsJavaInterface.js
*/

package com.facebook.react.viewmanagers;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReadableMap;

public interface RNSScreenManagerInterface<T extends View> {
  void setSheetAllowedDetents(T view, @Nullable String value);
  void setSheetLargestUndimmedDetent(T view, @Nullable String value);
  void setSheetGrabberVisible(T view, boolean value);
  void setSheetCornerRadius(T view, float value);
  void setSheetExpandsWhenScrolledToEdge(T view, boolean value);
  void setCustomAnimationOnSwipe(T view, boolean value);
  void setFullScreenSwipeEnabled(T view, boolean value);
  void setFullScreenSwipeShadowEnabled(T view, boolean value);
  void setHomeIndicatorHidden(T view, boolean value);
  void setPreventNativeDismiss(T view, boolean value);
  void setGestureEnabled(T view, boolean value);
  void setStatusBarColor(T view, @Nullable Integer value);
  void setStatusBarHidden(T view, boolean value);
  void setScreenOrientation(T view, @Nullable String value);
  void setStatusBarAnimation(T view, @Nullable String value);
  void setStatusBarStyle(T view, @Nullable String value);
  void setStatusBarTranslucent(T view, boolean value);
  void setGestureResponseDistance(T view, @Nullable ReadableMap value);
  void setStackPresentation(T view, @Nullable String value);
  void setStackAnimation(T view, @Nullable String value);
  void setTransitionDuration(T view, int value);
  void setReplaceAnimation(T view, @Nullable String value);
  void setSwipeDirection(T view, @Nullable String value);
  void setHideKeyboardOnSwipe(T view, boolean value);
  void setActivityState(T view, float value);
  void setNavigationBarColor(T view, @Nullable Integer value);
  void setNavigationBarTranslucent(T view, boolean value);
  void setNavigationBarHidden(T view, boolean value);
  void setNativeBackButtonDismissalEnabled(T view, boolean value);
}
