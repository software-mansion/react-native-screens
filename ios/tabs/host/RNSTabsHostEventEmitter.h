#pragma once

#import <Foundation/Foundation.h>
#import <RNSTabsNavigationState.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTComponent.h>
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

typedef struct {
  NSString *_Nonnull selectedScreenKey;
  int provenance;
  BOOL isRepeated;
  BOOL hasTriggeredSpecialEffect;
  BOOL isNativeAction;
} OnTabSelectedPayload;

typedef struct {
  RNSTabsNavigationState *_Nonnull currentNavState;
  RNSTabsNavigationState *_Nonnull rejectedNavState;
  RNSTabsNavigationStateRejectionReason rejectionReason;
} OnTabSelectionRejectedPayload;

@interface RNSTabsHostEventEmitter : NSObject

- (BOOL)emitOnTabSelected:(OnTabSelectedPayload)payload;

- (BOOL)emitOnTabSelectionRejected:(OnTabSelectionRejectedPayload)payload;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSTabsHostEventEmitter ()

#if RCT_NEW_ARCH_ENABLED

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSTabsHostIOSEventEmitter> &)emitter;

#else
#pragma mark - LEGACY Event emitter blocks

@property (nonatomic, copy) RCTDirectEventBlock onNativeFocusChange;

#endif // RCT_NEW_ARCH_ENABLED

@end

#endif // __cplusplus

NS_ASSUME_NONNULL_END
