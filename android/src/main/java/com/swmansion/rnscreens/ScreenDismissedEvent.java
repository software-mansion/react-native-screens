package com.swmansion.rnscreens;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class ScreenDismissedEvent extends Event<ScreenDismissedEvent> {

  public static final String EVENT_NAME = "topDismissed";

  public ScreenDismissedEvent(int viewId) {
    super(viewId);
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public short getCoalescingKey() {
    // All events for a given view can be coalesced.
    return 0;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    WritableMap args = Arguments.createMap();
    // on Android we always dismiss one screen at a time
    args.putInt("dismissCount", 1);
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), args);
  }
}
