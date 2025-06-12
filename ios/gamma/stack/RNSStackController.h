#import <UIKit/UIKit.h>
#import "RNSReactMountingTransactionObserving.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

@interface RNSStackController : UINavigationController <RNSReactMountingTransactionObserving>

@end

#pragma mark - Invalidate signals

@interface RNSStackController ()

- (void)setNeedsUpdateOfChildViewControllers:(nonnull NSArray<RNSStackScreenController *> *)childViewControllers;

@end

NS_ASSUME_NONNULL_END
