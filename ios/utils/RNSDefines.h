#pragma once

#pragma mark - Compiler utility

#define RNS_IGNORE_SUPER_CALL_BEGIN \
  _Pragma("clang diagnostic push")  \
      _Pragma("clang diagnostic ignored \"-Wobjc-missing-super-calls\"")

#define RNS_IGNORE_SUPER_CALL_END _Pragma("clang diagnostic pop")

#define MUTATION_PARENT_TAG(mutation) mutation.parentTag

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

#pragma mark - Availability utils

#define RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE \
  RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
