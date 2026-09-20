#import "RNSSplitColumnController.h"

#import <React/RCTAssert.h>
#import "RNSLog.h"
#import "RNSSplitColumnControllerDelegate.h"
#import "RNSSplitColumnFrameObserver.h"
#import "RNSSplitColumnFrameObserverDelegate.h"
#import "RNSStackNavigationController.h"
#import "RNSStackOperationCoordinator.h"

@interface RNSSplitColumnController () <RNSSplitColumnFrameObserverDelegate>
@end

@implementation RNSSplitColumnController {
  RNSStackNavigationController *_navigationController;
  RNSStackOperationCoordinator *_operationCoordinator;
  NSMutableArray<UIView<RNSStackScreenProviding> *> *_renderedScreens;
  RNSSplitColumnFrameObserver *_frameObserver;
  BOOL _waitingForTransition;
}

- (instancetype)init
{
  if (self = [super init]) {
    _navigationController = [RNSStackNavigationController new];
    _navigationController.allowsEmptyStack = YES;
    _operationCoordinator = [RNSStackOperationCoordinator new];
    _renderedScreens = [NSMutableArray new];
    // The view must exist to observe its frame; it is loaded before the Split installs it in a column anyway.
    [_navigationController loadViewIfNeeded];
    _frameObserver = [[RNSSplitColumnFrameObserver alloc] initWithNavigationController:_navigationController
                                                                              delegate:self];
    [_frameObserver registerForViewFrameChanges];
  }

  return self;
}

- (UINavigationController *)navigationController
{
  return _navigationController;
}

#pragma mark - Screens

- (void)insertScreen:(UIView<RNSStackScreenProviding> *)screen atIndex:(NSInteger)index
{
  [_renderedScreens insertObject:screen atIndex:index];
  [self addPushOperationIfNeeded:screen];
}

- (void)removeScreen:(UIView<RNSStackScreenProviding> *)screen
{
  [_renderedScreens removeObject:screen];
  [self addPopOperationIfNeeded:screen];
}

- (void)screenDidChangeActivityMode:(UIView<RNSStackScreenProviding> *)screen
{
  switch (screen.activityMode) {
    case RNSStackScreenActivityModeAttached:
      [_operationCoordinator addPushOperation:screen];
      break;
    case RNSStackScreenActivityModeDetached:
      if ([_navigationController.viewControllers containsObject:screen.controller]) {
        [_operationCoordinator addPopOperation:screen];
      }
      break;
    default:
      RCTAssert(NO, @"[RNScreens] Unexpected value of activityMode: %d", screen.activityMode);
      return;
  }
}

- (void)flushPendingUpdates
{
  if (_waitingForTransition) {
    return;
  }
  id<UIViewControllerTransitionCoordinator> coordinator = _navigationController.transitionCoordinator;
  if (coordinator != nil) {
    // UIKit can ignore pops while the column is being shown or hidden.
    _waitingForTransition = YES;
    __weak RNSSplitColumnController *weakSelf = self;
    [coordinator animateAlongsideTransition:nil
                                 completion:^(id<UIViewControllerTransitionCoordinatorContext> context) {
                                   dispatch_async(dispatch_get_main_queue(), ^{
                                     RNSSplitColumnController *strongSelf = weakSelf;
                                     if (strongSelf != nil) {
                                       strongSelf->_waitingForTransition = NO;
                                       [strongSelf flushPendingUpdates];
                                     }
                                   });
                                 }];
    return;
  }
  [_operationCoordinator executePendingOperationsIfNeeded:_navigationController withRenderedScreens:_renderedScreens];
}

- (void)addPushOperationIfNeeded:(UIView<RNSStackScreenProviding> *)screen
{
  if (screen.activityMode == RNSStackScreenActivityModeAttached) {
    [_operationCoordinator addPushOperation:screen];
  }
}

- (void)addPopOperationIfNeeded:(UIView<RNSStackScreenProviding> *)screen
{
  // A screen popped natively (back button, back gesture, back button menu) is already off the stack when React
  // reacts to its dismissal: UIKit removes the controller from `viewControllers` as the pop starts.
  if (screen.activityMode == RNSStackScreenActivityModeAttached &&
      [_navigationController.viewControllers containsObject:screen.controller]) {
    [_operationCoordinator addPopOperation:screen];
  } else {
    RNSLog(@"[RNScreens] ignoring pop operation of %@, already off the stack", screen.screenKey);
  }
}

#pragma mark - RNSSplitColumnFrameObserverDelegate

- (void)frameObserver:(RNSSplitColumnFrameObserver *)observer
    didChangeFrameOriginOfNavigationController:(UINavigationController *)navigationController
{
  [self.delegate splitColumnControllerFrameOriginDidChange:self];
}

@end
