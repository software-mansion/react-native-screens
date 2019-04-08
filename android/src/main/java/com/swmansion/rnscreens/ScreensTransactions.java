package com.swmansion.rnscreens;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.transition.Fade;
import android.transition.Slide;
import android.transition.TransitionInflater;
import android.transition.TransitionSet;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewParent;
import android.widget.TextView;

import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

@ReactModule(name=ScreensTransactions.MODULE_NAME)
public class ScreensTransactions extends ReactContextBaseJavaModule {
  static final String MODULE_NAME = "ScreensTransactions";

  public ScreensTransactions(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  private FragmentActivity findRootFragmentActivity(ViewParent parent) {
    while (!(parent instanceof ReactRootView) && parent.getParent() != null) {
      parent = parent.getParent();
    }
    // we expect top level view to be of type ReactRootView, this isn't really necessary but in order
    // to find root view we test if parent is null. This could potentially happen also when the view
    // is detached from the hierarchy and that test would not correctly indicate the root view. So
    // in order to make sure we indeed reached the root we test if it is of a correct type. This
    // allows us to provide a more descriptive error message for the aforementioned case.
    if (!(parent instanceof ReactRootView)) {
      throw new IllegalStateException("ScreenContainer is not attached under ReactRootView");
    }
    // ReactRootView is expected to be initialized with the main React Activity as a context
    Context context = ((ReactRootView) parent).getContext();
    if (!(context instanceof FragmentActivity)) {
      throw new IllegalStateException(
              "In order to use RNScreens components your app's activity need to extend ReactFragmentActivity or ReactCompatActivity");
    }
    return (FragmentActivity) context;
  }

  @ReactMethod
  public void perform(
          final int from,
          final int to,
          final int se,
          final int seTo) {
    UIManagerModule x = getReactApplicationContext()
            .getNativeModule(UIManagerModule.class);
    x.addUIBlock(new UIBlock() {
      @TargetApi(Build.VERSION_CODES.LOLLIPOP)
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        Screen viewFrom = (Screen) nativeViewHierarchyManager.resolveView(from);
        Screen viewTo = (Screen) nativeViewHierarchyManager.resolveView(to);
        View shared = nativeViewHierarchyManager.resolveView(se);
        View sharedTo = nativeViewHierarchyManager.resolveView(seTo);

        sharedTo.setTransitionName("my t");
        shared.setTransitionName("my t");


        TextView textView = new TextView(findRootFragmentActivity(viewFrom.getContainer()));

        textView.setText("This TextView is dynamically created");

       TransitionSet enterTransitionSet = new TransitionSet();
        enterTransitionSet.addTransition(TransitionInflater.from(findRootFragmentActivity(viewFrom.getContainer())).inflateTransition(android.R.transition.move));
        enterTransitionSet.setDuration(1000);
        viewTo.getFragment().setSharedElementEnterTransition(enterTransitionSet);

        findRootFragmentActivity(viewFrom.getContainer()).getSupportFragmentManager().beginTransaction()
                .setReorderingAllowed(true)
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .addSharedElement(shared, sharedTo.getTransitionName())
                .replace(viewFrom.getContainer().getId(), viewTo.getFragment(), viewTo.getFragment().getTag())
                .commit();

      }
    });

  }
}
