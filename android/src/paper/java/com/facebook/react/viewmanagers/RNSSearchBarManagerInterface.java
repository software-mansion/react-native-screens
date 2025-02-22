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


public interface RNSSearchBarManagerInterface<T extends View>  {
  void setHideWhenScrolling(T view, boolean value);
  void setAutoCapitalize(T view, @Nullable String value);
  void setPlaceholder(T view, @Nullable String value);
  void setPlacement(T view, @Nullable String value);
  void setObscureBackground(T view, boolean value);
  void setHideNavigationBar(T view, boolean value);
  void setCancelButtonText(T view, @Nullable String value);
  void setBarTintColor(T view, @Nullable Integer value);
  void setTintColor(T view, @Nullable Integer value);
  void setTextColor(T view, @Nullable Integer value);
  void setDisableBackButtonOverride(T view, boolean value);
  void setInputType(T view, @Nullable String value);
  void setHintTextColor(T view, @Nullable Integer value);
  void setHeaderIconColor(T view, @Nullable Integer value);
  void setShouldShowHintSearchIcon(T view, boolean value);
  void blur(T view);
  void focus(T view);
  void clearText(T view);
  void toggleCancelButton(T view, boolean flag);
  void setText(T view, String text);
  void cancelSearch(T view);
}
