#import "RNSBaseNavigatorComponentView.h"

#import <React/RCTAssert.h>
#import <React/RCTMountingTransactionObserving.h>

#import "Swift-Bridging.h"

@interface RNSBaseNavigatorComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSBaseNavigatorComponentView {
  NSMutableArray<RNSBaseScreenComponentView *> *_reactSubviews;
  BOOL _hasModifiedReactSubviewsInCurrentTransaction;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _reactSubviews = [NSMutableArray new];
  }
  return self;
}

// MARK: - Public interface

- (nonnull NSMutableArray<RNSBaseScreenComponentView *> *)reactSubviews
{
  return _reactSubviews;
}

// MARK: - Abstract interface (subclasses must override)

- (nonnull RNSBaseNavigatorController *)navigatorController
{
  [NSException raise:NSInternalInconsistencyException
              format:@"%@ must override -navigatorController", NSStringFromClass(self.class)];
  return nil;
}

// MARK: - Screen communication

- (void)screenChangedActivityMode:(nonnull RNSBaseScreenComponentView *)screen
{
  [self.navigatorController setNeedsUpdateOfChildViewControllers];
}

- (void)markSubviewsModifiedInCurrentTransaction
{
  _hasModifiedReactSubviewsInCurrentTransaction = YES;
}

- (BOOL)hadSubviewsModifiedInCurrentTransaction
{
  return _hasModifiedReactSubviewsInCurrentTransaction;
}

// MARK: - Subclass hook

- (void)navigatorDidMountTransaction
{
  // No-op. Subclasses override to react after transaction processing.
}

// MARK: - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  _hasModifiedReactSubviewsInCurrentTransaction = NO;
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (_hasModifiedReactSubviewsInCurrentTransaction) {
    [self.navigatorController setNeedsUpdateOfChildViewControllers];
  }
  [self.navigatorController reactMountingTransactionDidMount];
  [self navigatorDidMountTransaction];
}

@end
