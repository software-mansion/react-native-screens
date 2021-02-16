package com.swmansion.rnscreens;

import android.text.InputType;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

@ReactModule(name = SearchBarManager.REACT_CLASS)
public class SearchBarManager extends ViewGroupManager<SearchBar> {

  protected static final String REACT_CLASS = "RNSSearchBar";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @ReactProp(name = "placeholder")
  public void setPlaceholder(SearchBar view, String placeholder) {
    view.searchView.setQueryHint(placeholder);
  }

  @ReactProp(name = "text")
  public void setText(SearchBar view, String text) {
    view.setQuery(text);
  }

  @ReactProp(name = "mostRecentEventCount")
  public void setMostRecentEventCount(SearchBar view, int mostRecentEventCount) {
    view.mostRecentEventCount = mostRecentEventCount;
  }

  @ReactProp(name = "autoCapitalize")
  public void setAutoCapitalize(SearchBar view, String autoCapitalize) {
    if ("none".equals(autoCapitalize)) {
      view.searchView.setInputType(InputType.TYPE_CLASS_TEXT);
    } else if ("words".equals(autoCapitalize)) {
      view.searchView.setInputType(InputType.TYPE_TEXT_FLAG_CAP_WORDS);
    } else if ("sentences".equals(autoCapitalize)) {
      view.searchView.setInputType(InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
    } else if ("allCharacters".equals(autoCapitalize)) {
      view.searchView.setInputType(InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS);
    } else {
      throw new JSApplicationIllegalArgumentException("Unknown autoCapitalize type " + autoCapitalize);
    }
  }

  @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
  public void setBarTintColor(SearchBar view, int barTintColor) {
    view.setBarTintColor(barTintColor != Integer.MAX_VALUE ? barTintColor : null);
  }

  @Nonnull
  @Override
  protected SearchBar createViewInstance(@Nonnull ThemedReactContext reactContext) {
    return new SearchBar(reactContext);
  }

  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
            .put("onChangeText", MapBuilder.of("registrationName", "onChangeText"))
            .put("onExpand", MapBuilder.of("registrationName", "onExpand"))
            .put("onCollapse", MapBuilder.of("registrationName", "onCollapse"))
            .put("topSearchButtonPress", MapBuilder.of("registrationName", "onSearchButtonPress"))
            .build();
  }

  @Override
  public Map<String, Object> getExportedViewConstants() {
    return MapBuilder.<String, Object>of(
            "AutoCapitalize",
            MapBuilder.of(
                    "none", InputType.TYPE_CLASS_TEXT,
                    "words", InputType.TYPE_TEXT_FLAG_CAP_WORDS,
                    "sentences", InputType.TYPE_TEXT_FLAG_CAP_SENTENCES,
                    "allCharacters", InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS));
  }
}
