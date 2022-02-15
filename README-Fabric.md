# React Native Screens - Fabric version

To use this library with your fabric application, you have to:
1. Add latest react-native-screens
2. on iOS
    - Install pods using `RCT_NEW_ARCH_ENABLED=1 pod install` (iOS only)
3. on Android
    - In `ReactNativeHost` in your Application (for react native 0.68 template it is in `android/app/src/main/java/com/YOUR_APP_NAME/newarchitecture/MainApplicationReactNativeHost.java`) add
    ```diff
    import com.fabricexample.newarchitecture.modules.MainApplicationTurboModuleManagerDelegate;
    + import com.swmansion.rnscreens.RNScreensComponentRegistry;
    ...
    public JSIModuleProvider<UIManager> getJSIModuleProvider() {
        ...
        MainComponentsRegistry.register(componentFactory);
    +   RNScreensComponentsRegistry.register(componentFactory);
    ```
    - In your app `Android.mk` (for react native 0.68 template it is in `android/app/src/main/jni/Android.mk`) add
    ```diff
    + include $(REACT_ANDROID_DIR)/../../react-native-screens/android/src/main/jni/Android.mk
    include $(CLEAR_VARS)
    ...
    LOCAL_SHARED_LIBRARIES := libjsi \
    ...
    -   libyoga
    +   libyoga \
    +   librnscreens_modules 
    ```
