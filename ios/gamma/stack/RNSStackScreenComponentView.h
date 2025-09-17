#import "RNSReactBaseView.h"
#import "RNSStackScreenComponentEventEmitter.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSViewControllerInvalidating.h"
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;
@class RNSScreenStackHostComponentView;

typedef NS_ENUM(int, RNSScreenStackLifecycleState) {
  RNSScreenStackLifecycleInitial = 0,
  RNSScreenStackLifecycleDetached = 1,
  RNSScreenStackLifecycleAttached = 2,
};

@interface RNSStackScreenComponentView : RNSReactBaseView
#ifdef RCT_NEW_ARCH_ENABLED
                                         <RNSViewControllerInvalidating>
#endif // RCT_NEW_ARCH_ENABLED

@property (nonatomic, weak, readwrite, nullable) RNSScreenStackHostComponentView *stackHost;
@property (nonatomic, strong, readonly, nonnull) RNSStackScreenController *controller;

@property (nonatomic, strong, readonly, nullable) NSString *screenKey;
@property (nonatomic, readonly) RNSScreenStackLifecycleState maxLifecycleState;

@end

#pragma mark - Events

@interface RNSStackScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSStackScreenComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
