#pragma once

#import <Availability.h>
#import <TargetConditionals.h>

#pragma mark - Compiler utility

#define RNS_IGNORE_SUPER_CALL_BEGIN \
  _Pragma("clang diagnostic push") _Pragma("clang diagnostic ignored \"-Wobjc-missing-super-calls\"")

#define RNS_IGNORE_SUPER_CALL_END _Pragma("clang diagnostic pop")

#pragma mark - SDK availability utility

#define RNS_IPHONE_OS_VERSION_AVAILABLE(v) \
  (defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_##v) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_##v)

#pragma mark - Availability utils

#define RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

// UITab-based UITabBarController children API.
// Compile-time check for SDK availability and whether we want to actually use it.
#define RNS_UITAB_API_SDK_AVAILABLE (RNS_IPHONE_OS_VERSION_AVAILABLE(18_0) && !TARGET_OS_TV && !TARGET_OS_VISION)
// Runtime check deciding since which version we want to use it.
// Keep in mind that UITab api has been added in iOS 18,
// plus, for certain iOS 27 features this new API is mandatory.
#define RNS_UITAB_API_ENABLED @available(iOS 26.1, *)
