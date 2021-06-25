package com.swmansion.rnscreens;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class ScreenTransitionProgressContextEvent extends Event<ScreenAppearEvent> {

  public static final String EVENT_NAME = "topTransitionProgressContext";

  private final float mProgress;
  private final boolean mClosing;
  private final short mCoalescingKey;

  public ScreenTransitionProgressContextEvent(int viewId, float progress, boolean closing, short coalescingKey) {
    super(viewId);
    mProgress = progress;
    mClosing = closing;
    mCoalescingKey = coalescingKey;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public short getCoalescingKey() {
    return mCoalescingKey;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    WritableMap map = Arguments.createMap();
    map.putDouble("progress", mProgress);
    map.putInt("closing", mClosing ? 1 : 0);
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), map);
  }
}
