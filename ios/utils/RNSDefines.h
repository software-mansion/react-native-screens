#pragma once

#pragma mark - Compiler utility

#define RNS_IGNORE_SUPER_CALL_BEGIN \
  _Pragma("clang diagnostic push")  \
      _Pragma("clang diagnostic ignored \"-Wobjc-missing-super-calls\"")

#define RNS_IGNORE_SUPER_CALL_END _Pragma("clang diagnostic pop")

#pragma mark - React Native version dependent code

#if defined __has_include
#if __has_include(<React-RCTAppDelegate/RCTReactNativeFactory.h>) ||\
    __has_include(<React_RCTAppDelegate/RCTReactNativeFactory.h>) // added in 78; underscore is used in dynamic frameworks
#define RNS_REACT_NATIVE_VERSION_MINOR_BELOW_78 0
#else
#define RNS_REACT_NATIVE_VERSION_MINOR_BELOW_78 1
#endif
#else
#define RNS_REACT_NATIVE_VERSION_MINOR_BELOW_78 \
  1 // Wild guess, close eyes and hope for the best.
#endif

#if RNS_REACT_NATIVE_VERSION_MINOR_BELOW_78
#define MUTATION_PARENT_TAG(mutation) mutation.parentShadowView.tag
#else
#define MUTATION_PARENT_TAG(mutation) mutation.parentTag
#endif

#pragma mark - React Native architecture dependent code

#ifdef RCT_NEW_ARCH_ENABLED

#define RNS_REACT_SCROLL_VIEW_COMPONENT RCTScrollViewComponentView

#else

#define RNS_REACT_SCROLL_VIEW_COMPONENT RCTScrollView

#endif

#pragma mark - SDK availability utility

#define RNS_IPHONE_OS_VERSION_AVAILABLE(v)                              \
  (defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_##v) && \
   __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_##v)
