package com.swmansion.rnscreens;

import com.facebook.jni.HybridData;
import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.fabric.ComponentFactory;
import com.facebook.soloader.SoLoader;

@DoNotStrip
public class RNScreensComponentsRegistry {
  static {
    SoLoader.loadLibrary("rnscreens_modules");
  }

  @DoNotStrip private final HybridData mHybridData;

  @DoNotStrip
  private native HybridData initHybrid(ComponentFactory componentFactory);

  @DoNotStrip
  private RNScreensComponentsRegistry(ComponentFactory componentFactory) {
    mHybridData = initHybrid(componentFactory);
  }

  @DoNotStrip
  public static RNScreensComponentsRegistry register(ComponentFactory componentFactory) {
    return new RNScreensComponentsRegistry(componentFactory);
  }
}
