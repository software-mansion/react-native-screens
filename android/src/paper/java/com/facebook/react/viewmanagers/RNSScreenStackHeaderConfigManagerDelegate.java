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
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.BaseViewManagerDelegate;
import com.facebook.react.uimanager.LayoutShadowNode;

public class RNSScreenStackHeaderConfigManagerDelegate<T extends View, U extends BaseViewManager<T, ? extends LayoutShadowNode> & RNSScreenStackHeaderConfigManagerInterface<T>> extends BaseViewManagerDelegate<T, U> {
  public RNSScreenStackHeaderConfigManagerDelegate(U viewManager) {
    super(viewManager);
  }
  @Override
  public void setProperty(T view, String propName, @Nullable Object value) {
    switch (propName) {
      case "backgroundColor":
        mViewManager.setBackgroundColor(view, ColorPropConverter.getColor(value, view.getContext()));
        break;
      case "backTitle":
        mViewManager.setBackTitle(view, value == null ? null : (String) value);
        break;
      case "backTitleFontFamily":
        mViewManager.setBackTitleFontFamily(view, value == null ? null : (String) value);
        break;
      case "backTitleFontSize":
        mViewManager.setBackTitleFontSize(view, value == null ? 0 : ((Double) value).intValue());
        break;
      case "backTitleVisible":
        mViewManager.setBackTitleVisible(view, value == null ? true : (boolean) value);
        break;
      case "color":
        mViewManager.setColor(view, ColorPropConverter.getColor(value, view.getContext()));
        break;
      case "direction":
        mViewManager.setDirection(view, (String) value);
        break;
      case "hidden":
        mViewManager.setHidden(view, value == null ? false : (boolean) value);
        break;
      case "hideShadow":
        mViewManager.setHideShadow(view, value == null ? false : (boolean) value);
        break;
      case "largeTitle":
        mViewManager.setLargeTitle(view, value == null ? false : (boolean) value);
        break;
      case "largeTitleFontFamily":
        mViewManager.setLargeTitleFontFamily(view, value == null ? null : (String) value);
        break;
      case "largeTitleFontSize":
        mViewManager.setLargeTitleFontSize(view, value == null ? 0 : ((Double) value).intValue());
        break;
      case "largeTitleFontWeight":
        mViewManager.setLargeTitleFontWeight(view, value == null ? null : (String) value);
        break;
      case "largeTitleBackgroundColor":
        mViewManager.setLargeTitleBackgroundColor(view, ColorPropConverter.getColor(value, view.getContext()));
        break;
      case "largeTitleHideShadow":
        mViewManager.setLargeTitleHideShadow(view, value == null ? false : (boolean) value);
        break;
      case "largeTitleColor":
        mViewManager.setLargeTitleColor(view, ColorPropConverter.getColor(value, view.getContext()));
        break;
      case "translucent":
        mViewManager.setTranslucent(view, value == null ? false : (boolean) value);
        break;
      case "title":
        mViewManager.setTitle(view, value == null ? null : (String) value);
        break;
      case "titleFontFamily":
        mViewManager.setTitleFontFamily(view, value == null ? null : (String) value);
        break;
      case "titleFontSize":
        mViewManager.setTitleFontSize(view, value == null ? 0 : ((Double) value).intValue());
        break;
      case "titleFontWeight":
        mViewManager.setTitleFontWeight(view, value == null ? null : (String) value);
        break;
      case "titleColor":
        mViewManager.setTitleColor(view, ColorPropConverter.getColor(value, view.getContext()));
        break;
      case "disableBackButtonMenu":
        mViewManager.setDisableBackButtonMenu(view, value == null ? false : (boolean) value);
        break;
      case "backButtonDisplayMode":
        mViewManager.setBackButtonDisplayMode(view, (String) value);
        break;
      case "hideBackButton":
        mViewManager.setHideBackButton(view, value == null ? false : (boolean) value);
        break;
      case "backButtonInCustomView":
        mViewManager.setBackButtonInCustomView(view, value == null ? false : (boolean) value);
        break;
      case "blurEffect":
        mViewManager.setBlurEffect(view, (String) value);
        break;
      case "topInsetEnabled":
        mViewManager.setTopInsetEnabled(view, value == null ? false : (boolean) value);
        break;
      default:
        super.setProperty(view, propName, value);
    }
  }
}
