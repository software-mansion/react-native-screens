#import "RNSBottomTabsAccessoryEventEmitter.h"
#import "RNSBottomTabsHostComponentView.h"
#import "RNSReactBaseView.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSViewControllerInvalidating.h"
#else
#import <React/RCTInvalidating.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomAccessoryHelper;

@interface RNSBottomTabsAccessoryComponentView : RNSReactBaseView <
#ifdef RCT_NEW_ARCH_ENABLED
                                                     RNSViewControllerInvalidating
#else
                                                     RCTInvalidating
#endif
                                                     >

/**
 * If not null, the bottom accesory's helper that handles synchronization with ShadowNode.
 */
@property (nonatomic, strong, readonly, nullable) RNSBottomAccessoryHelper *helper;

/**
 * If not null, the bottom tabs host view that this accessory component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *reactSuperview;

@end

#pragma mark - React Events

@interface RNSBottomTabsAccessoryComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSBottomTabsAccessoryEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
