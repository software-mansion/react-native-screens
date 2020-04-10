#import "RNSScreenContainer.h"
#import "RNSScreen.h"

#import <React/RCTUIManager.h>
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTUIManagerUtils.h>

@interface RNSScreenContainerManager : RCTViewManager

- (void)markUpdated:(RNSScreenContainerView *)screen;

@end

@interface RNSScreenContainerView () <RCTInvalidating>

@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, retain) NSMutableSet<RNSScreenView *> *activeScreens;
@property (nonatomic, retain) NSMutableArray<RNSScreenView *> *reactSubviews;

- (void)updateContainer;

@end

@implementation RNSScreenContainerView {
  BOOL _needUpdate;
  __weak RNSScreenContainerManager *_manager;
}

- (instancetype)initWithManager:(RNSScreenContainerManager *)manager
{
  if (self = [super init]) {
    _activeScreens = [NSMutableSet new];
    _reactSubviews = [NSMutableArray new];
    _controller = [[UIViewController alloc] init];
    _needUpdate = NO;
    _manager = manager;
    [self addSubview:_controller.view];
  }
  return self;
}

- (void)markChildUpdated
{
  // We want 'updateContainer' to be executed on main thread after all enqueued operations in
  // uimanager are complete. For that we collect all marked containers in manager class and enqueue
  // operation on ui thread that should run once all the updates are completed.
  if (!_needUpdate) {
    _needUpdate = YES;
    [_manager markUpdated:self];
  }
}

- (void)insertReactSubview:(RNSScreenView *)subview atIndex:(NSInteger)atIndex
{
  subview.reactSuperview = self;
  [_reactSubviews insertObject:subview atIndex:atIndex];
  [subview reactSetFrame:CGRectMake(0, 0, self.bounds.size.width, self.bounds.size.height)];
}

- (void)removeReactSubview:(RNSScreenView *)subview
{
  subview.reactSuperview = nil;
  [_reactSubviews removeObject:subview];
}

- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
}

- (UIViewController *)reactViewController
{
  return _controller;
}

- (void)detachScreen:(RNSScreenView *)screen
{
  [screen.controller willMoveToParentViewController:nil];
  [screen.controller.view removeFromSuperview];
  [screen.controller removeFromParentViewController];
  [_activeScreens removeObject:screen];
}

- (void)attachScreen:(RNSScreenView *)screen
{
  [_controller addChildViewController:screen.controller];
  // the frame is already set at this moment because we adjust it in insertReactSubview. We don't
  // want to update it here as react-driven animations may already run and hence changing the frame
  // would result in visual glitches
  [_controller.view addSubview:screen.controller.view];
  [screen.controller didMoveToParentViewController:_controller];
  [_activeScreens addObject:screen];
}

- (void)updateContainer
{
  _needUpdate = NO;
  BOOL activeScreenRemoved = NO;
  // remove screens that are no longer active
  NSMutableSet *orphaned = [NSMutableSet setWithSet:_activeScreens];
  for (RNSScreenView *screen in _reactSubviews) {
    if (!screen.active && [_activeScreens containsObject:screen]) {
      activeScreenRemoved = YES;
      [self detachScreen:screen];
    }
    [orphaned removeObject:screen];
  }
  for (RNSScreenView *screen in orphaned) {
    activeScreenRemoved = YES;
    [self detachScreen:screen];
  }

  // detect if new screen is going to be activated
  BOOL activeScreenAdded = NO;
  for (RNSScreenView *screen in _reactSubviews) {
    if (screen.active && ![_activeScreens containsObject:screen]) {
      activeScreenAdded = YES;
    }
  }

  // if we are adding new active screen, we perform remounting of all already marked as active
  // this is done to mimick the effect UINavigationController has when willMoveToWindow:nil is
  // triggered before the animation starts
  if (activeScreenAdded) {
    // Following the assumption that there're mostly two active screens
    // it's reasnabe to assume that it's not allowed to add additional one
    // if there're already two on them
    RCTAssert(_activeScreens.count < 2, @"It's allowed to have max two active screens");
    RNSScreenView* onlyActiveScreen = [_activeScreens anyObject];
    if (onlyActiveScreen != nil) {
      // We're not using [self.detachScreen:] couse we don't
      // want ot actually call [view.removeFromSuperview] in order 
      // to keep the gesture recognition continuous
      [onlyActiveScreen.controller removeFromParentViewController];
      [onlyActiveScreen.controller willMoveToParentViewController:nil];
      [_activeScreens removeObject:onlyActiveScreen];
      onlyActiveScreen.userInteractionEnabled = YES;
    }

    // add new screens in order they are placed in subviews array
    for (RNSScreenView *screen in _reactSubviews) {
      if (screen.active) {
        if (screen == onlyActiveScreen) {
          // We're not using [self.attachScreen:] couse we don't
          // want to call [view.addSubview:] to keep the gesture
          // recognition continuos
          [_controller addChildViewController:screen.controller];
          [screen.controller didMoveToParentViewController:_controller];
          [_activeScreens addObject:screen];
        } else {
          [_controller addChildViewController:screen.controller];
          if (onlyActiveScreen == nil) {
            [_controller.view addSubview:screen.controller.view];
          } else {
            // We need to keed the native views' order sync with js.
            // if there's already another active screen attached we
            // need to keep the order of screens on native site the
            // same as on react site. Therefore assuming that the order 
            // of screens' attaching might be different than the order 
            // in the react hierarchy and assuming that there might
            // be max two active screens we're insering the new screen 
            // either at index 0 or at index 1 according to
            // the position is react hierarchy.
            BOOL isBeforePreviouslyOnlyOneActiveScreen = [_reactSubviews indexOfObject:screen] < [_reactSubviews indexOfObject:onlyActiveScreen];
            [_controller.view insertSubview:screen.controller.view atIndex: isBeforePreviouslyOnlyOneActiveScreen ? 0 : 1];
          }
          [screen.controller didMoveToParentViewController:_controller];
          [_activeScreens addObject:screen];
        }
      }
    }
  }

  // if we are down to one active screen it means the transitioning is over and we want to notify
  // the transition has finished
  if ((activeScreenRemoved || activeScreenAdded) && _activeScreens.count == 1) {
    RNSScreenView *singleActiveScreen = [_activeScreens anyObject];
    // restore interactions
    singleActiveScreen.userInteractionEnabled = YES;
    [singleActiveScreen notifyFinishTransitioning];
  }

  if ((activeScreenRemoved || activeScreenAdded) && _controller.presentedViewController == nil) {
    // if user has reachability enabled (one hand use) and the window is slided down the below
    // method will force it to slide back up as it is expected to happen with UINavController when
    // we push or pop views.
    // We only do that if `presentedViewController` is nil, as otherwise it'd mean that modal has
    // been presented on top of recently changed controller in which case the below method would
    // dismiss such a modal (e.g., permission modal or alert)
    [_controller dismissViewControllerAnimated:NO completion:nil];
  }
}

- (void)didUpdateReactSubviews
{
  [self markChildUpdated];
}

- (void)didMoveToWindow
{
  if (self.window) {
    [self reactAddControllerToClosestParent:_controller];
  }
}

- (void)invalidate
{
  [_controller willMoveToParentViewController:nil];
  [_controller removeFromParentViewController];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _controller.view.frame = self.bounds;
  for (RNSScreenView *subview in _reactSubviews) {
    [subview reactSetFrame:CGRectMake(0, 0, self.bounds.size.width, self.bounds.size.height)];
    [subview setNeedsLayout];
  }
}

@end


@implementation RNSScreenContainerManager {
  NSMutableArray<RNSScreenContainerView *> *_markedContainers;
}

RCT_EXPORT_MODULE()

- (UIView *)view
{
  if (!_markedContainers) {
    _markedContainers = [NSMutableArray new];
  }
  return [[RNSScreenContainerView alloc] initWithManager:self];
}

- (void)markUpdated:(RNSScreenContainerView *)screen
{
  RCTAssertMainQueue();
  [_markedContainers addObject:screen];
  if ([_markedContainers count] == 1) {
    // we enqueue updates to be run on the main queue in order to make sure that
    // all this updates (new screens attached etc) are executed in one batch
    RCTExecuteOnMainQueue(^{
      for (RNSScreenContainerView *container in self->_markedContainers) {
        [container updateContainer];
      }
      [self->_markedContainers removeAllObjects];
    });
  }
}

@end
