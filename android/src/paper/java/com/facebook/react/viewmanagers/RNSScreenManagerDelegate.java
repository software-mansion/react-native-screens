/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* @generated by codegen project: GeneratePropsJavaDelegate.js
*/

package com.facebook.react.viewmanagers;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ColorPropConverter;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.BaseViewManagerDelegate;
import com.facebook.react.uimanager.BaseViewManagerInterface;

public class RNSScreenManagerDelegate<T extends View, U extends BaseViewManagerInterface<T> & RNSScreenManagerInterface<T>> extends BaseViewManagerDelegate<T, U> {
  public RNSScreenManagerDelegate(U viewManager) {
    super(viewManager);
  }
  @Override
  public void setProperty(T view, String propName, @Nullable Object value) {
    switch (propName) {
      case "sheetAllowedDetents":
        mViewManager.setSheetAllowedDetents(view, (ReadableArray) value);
        break;
      case "sheetLargestUndimmedDetent":
        mViewManager.setSheetLargestUndimmedDetent(view, value == null ? -1 : ((Double) value).intValue());
        break;
      case "sheetGrabberVisible":
        mViewManager.setSheetGrabberVisible(view, value == null ? false : (boolean) value);
        break;
      case "sheetCornerRadius":
        mViewManager.setSheetCornerRadius(view, value == null ? -1f : ((Double) value).floatValue());
        break;
      case "sheetExpandsWhenScrolledToEdge":
        mViewManager.setSheetExpandsWhenScrolledToEdge(view, value == null ? false : (boolean) value);
        break;
      case "sheetInitialDetent":
        mViewManager.setSheetInitialDetent(view, value == null ? 0 : ((Double) value).intValue());
        break;
      case "sheetElevation":
        mViewManager.setSheetElevation(view, value == null ? 24 : ((Double) value).intValue());
        break;
      case "customAnimationOnSwipe":
        mViewManager.setCustomAnimationOnSwipe(view, value == null ? false : (boolean) value);
        break;
      case "fullScreenSwipeEnabled":
        mViewManager.setFullScreenSwipeEnabled(view, value == null ? false : (boolean) value);
        break;
      case "homeIndicatorHidden":
        mViewManager.setHomeIndicatorHidden(view, value == null ? false : (boolean) value);
        break;
      case "preventNativeDismiss":
        mViewManager.setPreventNativeDismiss(view, value == null ? false : (boolean) value);
        break;
      case "gestureEnabled":
        mViewManager.setGestureEnabled(view, value == null ? true : (boolean) value);
        break;
      case "statusBarColor":
        mViewManager.setStatusBarColor(view, ColorPropConverter.getColor(value, view.getContext()));
        break;
      case "statusBarHidden":
        mViewManager.setStatusBarHidden(view, value == null ? false : (boolean) value);
        break;
      case "screenOrientation":
        mViewManager.setScreenOrientation(view, value == null ? null : (String) value);
        break;
      case "statusBarAnimation":
        mViewManager.setStatusBarAnimation(view, value == null ? null : (String) value);
        break;
      case "statusBarStyle":
        mViewManager.setStatusBarStyle(view, value == null ? null : (String) value);
        break;
      case "statusBarTranslucent":
        mViewManager.setStatusBarTranslucent(view, value == null ? false : (boolean) value);
        break;
      case "gestureResponseDistance":
        mViewManager.setGestureResponseDistance(view, (ReadableMap) value);
        break;
      case "stackPresentation":
        mViewManager.setStackPresentation(view, (String) value);
        break;
      case "stackAnimation":
        mViewManager.setStackAnimation(view, (String) value);
        break;
      case "transitionDuration":
        mViewManager.setTransitionDuration(view, value == null ? 350 : ((Double) value).intValue());
        break;
      case "replaceAnimation":
        mViewManager.setReplaceAnimation(view, (String) value);
        break;
      case "swipeDirection":
        mViewManager.setSwipeDirection(view, (String) value);
        break;
      case "hideKeyboardOnSwipe":
        mViewManager.setHideKeyboardOnSwipe(view, value == null ? false : (boolean) value);
        break;
      case "activityState":
        mViewManager.setActivityState(view, value == null ? -1f : ((Double) value).floatValue());
        break;
      case "navigationBarColor":
        mViewManager.setNavigationBarColor(view, ColorPropConverter.getColor(value, view.getContext()));
        break;
      case "navigationBarTranslucent":
        mViewManager.setNavigationBarTranslucent(view, value == null ? false : (boolean) value);
        break;
      case "navigationBarHidden":
        mViewManager.setNavigationBarHidden(view, value == null ? false : (boolean) value);
        break;
      case "nativeBackButtonDismissalEnabled":
        mViewManager.setNativeBackButtonDismissalEnabled(view, value == null ? false : (boolean) value);
        break;
      default:
        super.setProperty(view, propName, value);
    }
  }
}
