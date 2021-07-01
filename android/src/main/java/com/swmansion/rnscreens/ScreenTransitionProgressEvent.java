package com.swmansion.rnscreens;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class ScreenTransitionProgressEvent extends Event<ScreenAppearEvent> {

  public static final String EVENT_NAME = "topTransitionProgress";

  private final float mProgress;
  private final boolean mClosing;
  private final boolean mGoingForward;
  private final short mCoalescingKey;

  public ScreenTransitionProgressEvent(int viewId, float progress, boolean closing, boolean goingForward, short coalescingKey) {
    super(viewId);
    mProgress = progress;
    mClosing = closing;
    mGoingForward = goingForward;
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
    map.putInt("goingForward", mGoingForward ? 1 : 0);
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), map);
  }
}
