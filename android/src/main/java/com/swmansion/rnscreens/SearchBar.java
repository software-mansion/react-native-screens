package com.swmansion.rnscreens;

import android.content.Context;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewParent;
import android.view.inputmethod.InputMethodManager;
import android.widget.ImageButton;

import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.material.appbar.AppBarLayout;

public class SearchBar extends ReactViewGroup {
  SearchView searchView;
  AppBarLayout.OnOffsetChangedListener onOffsetChangedListener;
  private int barOffset = 0;
  int nativeEventCount;
  int mostRecentEventCount;

  public SearchBar(Context context) {
    super(context);
    searchView = new SearchView(context);
    searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
      @Override
      public boolean onQueryTextSubmit(String query) {
        WritableMap event = Arguments.createMap();
        event.putString("searchText", query);
        ReactContext context = (ReactContext) getContext();
        context.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "topSearchButtonPress",
                event
        );
        return false;
      }

      @Override
      public boolean onQueryTextChange(String newText) {
        nativeEventCount++;
        WritableMap event = Arguments.createMap();
        event.putString("text", newText);
        event.putInt("eventCount", nativeEventCount);
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onChangeText", event);
        return false;
      }
    });
//    searchView.setOnQueryTextFocusChangeListener(new OnFocusChangeListener() {
//      @Override
//      public void onFocusChange(View v, boolean hasFocus) {
//        if (hasFocus) {
//          Toolbar toolbarView = (Toolbar) searchView.getParent();
//          if (toolbarView.getChildAt(1) instanceof ImageButton)
//            toolbarView.setCollapseButton((ImageButton) toolbarView.getChildAt(1));
//        }
//      }
//    });
    onOffsetChangedListener = new AppBarLayout.OnOffsetChangedListener() {
      @Override
      public void onOffsetChanged(AppBarLayout appBarLayout, int offset) {
        barOffset = offset;
      }
    };
  }

  void setQuery(String query) {
    int eventLag = nativeEventCount - mostRecentEventCount;
    if (eventLag == 0 && !searchView.getQuery().toString().equals(query))
      searchView.setQuery(query, true);
  }

  void setBarTintColor(Integer barTintColor) {
    SearchView.SearchAutoComplete searchAutoComplete = searchView.findViewById(androidx.appcompat.R.id.search_src_text);
    if (barTintColor != null) {
      searchAutoComplete.setBackgroundColor(barTintColor);
    } else {
      searchAutoComplete.setBackground(null);
    }
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    if (searchView.requestFocusFromTouch()) {
      InputMethodManager inputMethodManager = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
      if (inputMethodManager != null)
        inputMethodManager.showSoftInput(searchView.findFocus(), 0);
    }
    Toolbar toolbar = null;
    final AppBarLayout appBarLayout = getAppBarLayout();
    if (appBarLayout != null) {
      for (int i = 0; i < appBarLayout.getChildCount(); i++) {
        if (appBarLayout.getChildAt(i) instanceof Toolbar)
          toolbar = (Toolbar) appBarLayout.getChildAt(i);
      }
      appBarLayout.addOnOffsetChangedListener(onOffsetChangedListener);
    }
    if (toolbar != null) {
      toolbar.setOnSearchListener(new Toolbar.OnSearchListener() {
        @Override
        public void onSearchAdd(MenuItem searchMenuItem) {
          searchMenuItem.setActionView(searchView);
        }

        @Override
        public void onSearchExpand() {
          ReactContext reactContext = (ReactContext) getContext();
          WritableMap event = Arguments.createMap();
          event.putInt("top", 56 + (int) PixelUtil.toDIPFromPixel(barOffset));
          reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onExpand", event);
        }

        @Override
        public void onSearchCollapse() {
          ReactContext reactContext = (ReactContext) getContext();
          reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onCollapse", null);
        }
      });
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    AppBarLayout appBarLayout = getAppBarLayout();
    if (appBarLayout != null)
      appBarLayout.removeOnOffsetChangedListener(onOffsetChangedListener);
  }

  private AppBarLayout getAppBarLayout() {
    ViewParent parent = getParent();
    while (parent != null) {
      if (parent instanceof AppBarLayout) {
        return (AppBarLayout)parent;
      }
      parent = parent.getParent();
    }
    return null;
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int r, int b) {
  }
}