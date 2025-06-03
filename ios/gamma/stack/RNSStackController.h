#import <UIKit/UIKit.h>
#import "RNSReactMountingTransactionObserving.h"
#import "RNSStackScreenController.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackController : UINavigationController <RNSReactMountingTransactionObserving>

@end

#pragma mark - Invalidate signals

@interface RNSStackController ()

- (void)setNeedsUpdateOfChildViewControllers:(nonnull NSArray<RNSStackScreenController *> *)childViewControllers;

@end

NS_ASSUME_NONNULL_END
