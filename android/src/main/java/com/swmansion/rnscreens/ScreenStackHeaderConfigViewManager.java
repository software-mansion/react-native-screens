package com.swmansion.rnscreens;

import android.view.View;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = ScreenStackHeaderConfigViewManager.REACT_CLASS)
public class ScreenStackHeaderConfigViewManager extends ViewGroupManager<ScreenStackHeaderConfig> {

  protected static final String REACT_CLASS = "RNSScreenStackHeaderConfig";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected ScreenStackHeaderConfig createViewInstance(ThemedReactContext reactContext) {
    return new ScreenStackHeaderConfig(reactContext);
  }

  @Override
  public void addView(ScreenStackHeaderConfig parent, View child, int index) {
    parent.addConfigSubview(child, index);
  }

  @Override
  public void removeViewAt(ScreenStackHeaderConfig parent, int index) {
    parent.removeConfigSubview(index);
  }

  @Override
  public int getChildCount(ScreenStackHeaderConfig parent) {
    return parent.getConfigSubviewsCount();
  }

  @Override
  public View getChildAt(ScreenStackHeaderConfig parent, int index) {
    return parent.getConfigSubview(index);
  }

  @ReactProp(name = "title")
  public void setTitle(ScreenStackHeaderConfig config, String title) {
    config.setTitle(title);
  }

  @ReactProp(name = "hidden")
  public void setHidden(ScreenStackHeaderConfig config, boolean hidden) {
    config.setHidden(hidden);
  }

//  RCT_EXPORT_VIEW_PROPERTY(title, NSString)
//  RCT_EXPORT_VIEW_PROPERTY(titleFontFamily, NSString)
//  RCT_EXPORT_VIEW_PROPERTY(titleFontSize, NSNumber)
//  RCT_EXPORT_VIEW_PROPERTY(titleColor, UIColor)
//  RCT_EXPORT_VIEW_PROPERTY(backTitle, NSString)
//  RCT_EXPORT_VIEW_PROPERTY(backTitleFontFamily, NSString)
//  RCT_EXPORT_VIEW_PROPERTY(backTitleFontSize, NSString)
//  RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
//  RCT_EXPORT_VIEW_PROPERTY(color, UIColor)
//  RCT_EXPORT_VIEW_PROPERTY(largeTitle, BOOL)
//  RCT_EXPORT_VIEW_PROPERTY(hideBackButton, BOOL)
//  RCT_EXPORT_VIEW_PROPERTY(hideShadow, BOOL)
//  // `hidden` is an UIView property, we need to use different name internally
//  RCT_REMAP_VIEW_PROPERTY(hidden, hide, BOOL)
//  RCT_EXPORT_VIEW_PROPERTY(translucent, BOOL)
//  RCT_EXPORT_VIEW_PROPERTY(gestureEnabled, BOOL)
}
