package com.google.android.material.bottomsheet;

/**
 * Access to BottomSheetBehavior's scrolling children, which are package-private
 * (`ScrollAwareBottomSheetBehavior`).
 */
public final class BottomSheetScrollingChild {
  private BottomSheetScrollingChild() {}

  public static void forget(BottomSheetBehavior<?> behavior) {
    behavior.nestedScrollingChildrenRef.clear();
  }
}
