
#import "RNSScreenNavigationContainer.h"
#import "RNSScreen.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"

#import <React/RCTUIManager.h>
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTUIManagerUtils.h>

@interface RNSScreenNavigationContainerManager : RCTViewManager

- (void)markUpdated:(RNSScreenNavigationContainerView *)screen;

@end

@interface RNSScreenNavigationContainerView () <RCTInvalidating>

@property (nonatomic, retain) RNScreensContainerNavigationController *controller;
@property (nonatomic, retain) NSMutableArray<RNSScreenView *> *reactSubviews;

- (void)updateContainer;

@end

@implementation RNScreensContainerNavigationController

@end

@implementation RNSScreenNavigationContainerView {
  BOOL _needUpdate;
  BOOL _invalidated;
  __weak RNSScreenNavigationContainerManager *_manager;
}

- (instancetype)initWithManager:(RNSScreenNavigationContainerManager *)manager
{
  if (self = [super init]) {
    _reactSubviews = [NSMutableArray new];
    _controller = [[RNScreensContainerNavigationController alloc] init];
    [_controller setNavigationBarHidden:YES animated:NO];
    _needUpdate = NO;
    _invalidated = NO;
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

- (void)updateContainer
{
  _needUpdate = NO;

  for (RNSScreenView *screen in _reactSubviews) {
    if (screen.activityState == RNSActivityStateOnTop) {
      // there should never be more than one screen with `RNSActivityStateOnTop`
      // since this component should be used for `tabs` and `drawer` navigators
      [_controller setViewControllers:@[ screen.controller ] animated:NO];
      [screen notifyFinishTransitioning];
    }
  }

  if (_controller.presentedViewController == nil && _controller.presentingViewController == nil) {
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
  if (self.window && !_invalidated) {
    // We check whether the view has been invalidated before running side-effects in didMoveToWindow
    // This is needed because when LayoutAnimations are used it is possible for view to be re-attached
    // to a window despite the fact it has been removed from the React Native view hierarchy.
    [self reactAddControllerToClosestParent:_controller];
  }
}

- (void)invalidate
{
  _invalidated = YES;
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

@implementation RNSScreenNavigationContainerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RNSScreenNavigationContainerView alloc] initWithManager:self];
}

- (void)markUpdated:(RNSScreenNavigationContainerView *)container
{
  // we want the attaching/detaching of children to be always made on main queue, which
  // is currently true for `react-navigation` since mounting/unmounting
  // views in tabs and drawer are dispatched on main queue.
  RCTAssertMainQueue();
  [container updateContainer];
}

@end
