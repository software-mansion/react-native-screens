#pragma once

#import <Foundation/Foundation.h>
#import "RNSTabsNavigationState.h"

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTComponent.h>
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

/** Payload for the `onTabSelected` event emitted when a tab selection is accepted. */
typedef struct {
  /** Screen key of the newly selected tab. */
  NSString *_Nonnull selectedScreenKey;
  /** Provenance of the navigation state after the selection. */
  int provenance;
  /** Whether the same tab that was already selected has been selected again. */
  BOOL isRepeated;
  /** Whether a special effect (e.g. scroll-to-top) was triggered. */
  BOOL hasTriggeredSpecialEffect;
  /** Origin (actor) that requested this transition. */
  RNSTabsActionOrigin actionOrigin;
} OnTabSelectedPayload;

/** Payload for the `onTabSelectionRejected` event emitted when a tab selection request is rejected. */
typedef struct {
  /** The currently active navigation state that was kept. */
  RNSTabsNavigationState *_Nonnull currentNavState;
  /** The navigation state update request that was rejected. */
  RNSTabsNavigationStateUpdateRequest *_Nonnull rejectedRequest;
  /** Reason the update was rejected. */
  RNSTabsNavigationStateRejectionReason rejectionReason;
} OnTabSelectionRejectedPayload;

/** Payload for the `onTabSelectionPrevented` event emitted when a tab selection is prevented. */
typedef struct {
  /** The currently active navigation state that was kept. */
  RNSTabsNavigationState *_Nonnull currentNavState;
  /** Screen key of the tab whose selection was prevented. */
  NSString *_Nonnull preventedScreenKey;
} OnTabSelectionPreventedPayload;

/** Payload for the `onMoreTabSelected` event emitted when the user taps the "More" tab bar item. */
typedef struct {
  /** The currently active navigation state when the "More" tab was tapped. */
  RNSTabsNavigationState *_Nonnull currentNavState;
} OnMoreTabSelectedPayload;

@interface RNSTabsHostEventEmitter : NSObject

/** Emits `onTabSelected` event to JS. Returns YES if the event was dispatched successfully. */
- (BOOL)emitOnTabSelected:(OnTabSelectedPayload)payload;

/** Emits `onTabSelectionRejected` event to JS. Returns YES if the event was dispatched successfully. */
- (BOOL)emitOnTabSelectionRejected:(OnTabSelectionRejectedPayload)payload;

/** Emits `onTabSelectionPrevented` event to JS. Returns YES if the event was dispatched successfully. */
- (BOOL)emitOnTabSelectionPrevented:(OnTabSelectionPreventedPayload)payload;

/** Emits `onMoreTabSelected` event to JS. Returns YES if the event was dispatched successfully. */
- (BOOL)emitOnMoreTabSelected:(OnMoreTabSelectedPayload)payload;

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
