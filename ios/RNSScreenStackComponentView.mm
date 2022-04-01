#import "RNSScreenStackComponentView.h"
#import "RNSScreenComponentView.h"
#import "RNSScreenStackHeaderConfigComponentView.h"

#import <React/RCTMountingTransactionObserving.h>

#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTSurfaceTouchHandler.h>

using namespace facebook::react;

@interface RNSScreenStackComponentView () <
    UINavigationControllerDelegate,
    UIAdaptivePresentationControllerDelegate,
    UIGestureRecognizerDelegate,
    UIViewControllerTransitioningDelegate,
    RCTMountingTransactionObserving>
@end

#if !TARGET_OS_TV
@interface RNSScreenEdgeGestureRecognizerF : UIScreenEdgePanGestureRecognizer
@end

@implementation RNSScreenEdgeGestureRecognizerF
@end

@interface RNSPanGestureRecognizerF : UIPanGestureRecognizer
@end

@implementation RNSPanGestureRecognizerF
@end
#endif

@implementation RNSScreenStackComponentView {
  UINavigationController *_controller;
  NSMutableArray<RNSScreenComponentView *> *_reactSubviews;
  BOOL _invalidated;
  UIView *_snapshot;
  BOOL _isFullWidthSwiping;
  UIPercentDrivenInteractiveTransition *_interactionController;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSScreenStackProps>();
    _props = defaultProps;
    _reactSubviews = [NSMutableArray new];
    _controller = [RNScreensNavigationController new];
    _controller.delegate = self;
    [_controller setViewControllers:@[ [UIViewController new] ]];
#if !TARGET_OS_TV
    [self setupGestureHandlers];
#endif
  }

  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if (![childComponentView isKindOfClass:[RNSScreenComponentView class]]) {
    RCTLogError(@"ScreenStack only accepts children of type Screen");
    return;
  }

  RCTAssert(
      childComponentView.reactSuperview == nil,
      @"Attempt to mount already mounted component view. (parent: %@, child: %@, index: %@, existing parent: %@)",
      self,
      childComponentView,
      @(index),
      @([childComponentView.superview tag]));

  [_reactSubviews insertObject:(RNSScreenComponentView *)childComponentView atIndex:index];
  ((RNSScreenComponentView *)childComponentView).reactSuperview = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    [self maybeAddToParentAndUpdateContainer];
  });
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RNSScreenComponentView *screenChildComponent = (RNSScreenComponentView *)childComponentView;
  // We should only do a snapshot of a screen that is on the top
  if (screenChildComponent == _controller.topViewController.view) {
    [screenChildComponent.controller setViewToSnapshot:_snapshot];
  }

  RCTAssert(
      screenChildComponent.reactSuperview == self,
      @"Attempt to unmount a view which is mounted inside different view. (parent: %@, child: %@, index: %@)",
      self,
      screenChildComponent,
      @(index));
  RCTAssert(
      (_reactSubviews.count > index) && [_reactSubviews objectAtIndex:index] == childComponentView,
      @"Attempt to unmount a view which has a different index. (parent: %@, child: %@, index: %@, actual index: %@, tag at index: %@)",
      self,
      screenChildComponent,
      @(index),
      @([_reactSubviews indexOfObject:screenChildComponent]),
      @([[_reactSubviews objectAtIndex:index] tag]));
  screenChildComponent.reactSuperview = nil;
  [_reactSubviews removeObject:screenChildComponent];
  [screenChildComponent removeFromSuperview];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self maybeAddToParentAndUpdateContainer];
  });
}

- (void)takeSnapshot
{
  _snapshot = [_controller.topViewController.view snapshotViewAfterScreenUpdates:NO];
}

- (void)mountingTransactionWillMountWithMetadata:(MountingTransactionMetadata const &)metadata
{
  [self takeSnapshot];
}

- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  // for handling nested stacks
  [self maybeAddToParentAndUpdateContainer];
}

- (void)navigationController:(UINavigationController *)navigationController
      willShowViewController:(UIViewController *)viewController
                    animated:(BOOL)animated
{
  UIView *view = viewController.view;
  if ([view isKindOfClass:RNSScreenComponentView.class]) {
    RNSScreenStackHeaderConfigComponentView *config =
        (RNSScreenStackHeaderConfigComponentView *)((RNSScreenComponentView *)view).config;
    [RNSScreenStackHeaderConfigComponentView willShowViewController:viewController animated:animated withConfig:config];
  }
}

- (void)maybeAddToParentAndUpdateContainer
{
  BOOL wasScreenMounted = _controller.parentViewController != nil;
  BOOL isScreenReadyForShowing = self.window;
  if (!isScreenReadyForShowing && !wasScreenMounted) {
    return;
  }
  [self updateContainer];
  if (!wasScreenMounted) {
    // when stack hasn't been added to parent VC yet we do two things:
    // 1) we run updateContainer (the one above) – we do this because we want push view controllers to
    // be installed before the VC is mounted. If we do that after it is added to parent the push
    // updates operations are going to be blocked by UIKit.
    // 2) we add navigation VS to parent – this is needed for the VC lifecycle events to be dispatched
    // properly
    // 3) we again call updateContainer – this time we do this to open modal controllers. Modals
    // won't open in (1) because they require navigator to be added to parent. We handle that case
    // gracefully in setModalViewControllers and can retry opening at any point.
    [self reactAddControllerToClosestParent:_controller];
    [self updateContainer];
  }
}

- (void)reactAddControllerToClosestParent:(UIViewController *)controller
{
  if (!controller.parentViewController) {
    UIView *parentView = (UIView *)self.reactSuperview;
    while (parentView) {
      if ([parentView reactViewController]) {
        [parentView.reactViewController addChildViewController:controller];
        [self addSubview:controller.view];
#if !TARGET_OS_TV
        _controller.interactivePopGestureRecognizer.delegate = self;
#endif
        [self navigationController:_controller willShowViewController:_controller.topViewController animated:NO];
        break;
      }
      parentView = (UIView *)parentView.reactSuperview;
    }
    return;
  }
}

- (void)setPushViewControllers:(NSArray<UIViewController *> *)controllers
{
  // when there is no change we return immediately
  if ([_controller.viewControllers isEqualToArray:controllers]) {
    return;
  }

  // if view controller is not yet attached to window we skip updates now and run them when view
  // is attached
  if (self.window == nil) {
    return;
  }

  UIViewController *top = controllers.lastObject;
  UIViewController *previousTop = _controller.topViewController;

  // At the start we set viewControllers to contain a single UIViewController
  // instance. This is a workaround for header height adjustment bug (see comment
  // in the init function). Here, we need to detect if the initial empty
  // controller is still there
  BOOL firstTimePush = ![previousTop isKindOfClass:[RNSScreenController class]];

  if (firstTimePush) {
    // nothing pushed yet
    [_controller setViewControllers:controllers animated:NO];
  } else if (top != previousTop) {
    if (![controllers containsObject:previousTop]) {
      // if the previous top screen does not exist anymore and the new top was not on the stack before, probably replace
      // was called, so we check the animation
      if (![_controller.viewControllers containsObject:top]) {
        // setting new controllers with animation does `push` animation by default
        auto screenController = (RNSScreenController *)top;
        [screenController resetViewToScreen];
        [_controller setViewControllers:controllers animated:YES];
      } else {
        // last top controller is no longer on stack
        // in this case we set the controllers stack to the new list with
        // added the last top element to it and perform (animated) pop
        NSMutableArray *newControllers = [NSMutableArray arrayWithArray:controllers];
        [newControllers addObject:previousTop];
        [_controller setViewControllers:newControllers animated:NO];
        [_controller popViewControllerAnimated:YES];
      }
    } else if (![_controller.viewControllers containsObject:top]) {
      // new top controller is not on the stack
      // in such case we update the stack except from the last element with
      // no animation and do animated push of the last item
      NSMutableArray *newControllers = [NSMutableArray arrayWithArray:controllers];
      [newControllers removeLastObject];
      [_controller setViewControllers:newControllers animated:NO];
      auto screenController = (RNSScreenController *)top;
      [screenController resetViewToScreen];
      [_controller pushViewController:top animated:YES];
    } else {
      // don't really know what this case could be, but may need to handle it
      // somehow
      [_controller setViewControllers:controllers animated:YES];
    }
  } else {
    // change wasn't on the top of the stack. We don't need animation.
    [_controller setViewControllers:controllers animated:NO];
  }
}

- (void)updateContainer
{
  NSMutableArray<UIViewController *> *pushControllers = [NSMutableArray new];
  for (RNSScreenComponentView *screen in _reactSubviews) {
    if (screen.controller != nil) {
      [pushControllers addObject:screen.controller];
    }
  }

  [self setPushViewControllers:pushControllers];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _controller.view.frame = self.bounds;
}

- (void)dismissOnReload
{
  auto screenController = (RNSScreenController *)_controller.topViewController;
  [screenController resetViewToScreen];
}

#pragma mark - methods connected to transitioning

- (void)cancelTouchesInParent
{
  // cancel touches in parent, this is needed to cancel RN touch events. For example when Touchable
  // item is close to an edge and we start pulling from edge we want the Touchable to be cancelled.
  // Without the below code the Touchable will remain active (highlighted) for the duration of back
  // gesture and onPress may fire when we release the finger.
  UIView *parent = _controller.view;
  while (parent != nil && ![parent respondsToSelector:@selector(touchHandler)])
    parent = parent.superview;

  if (parent != nil) {
    RCTSurfaceTouchHandler *touchHandler = [parent performSelector:@selector(touchHandler)];
    [touchHandler setEnabled:NO];
    [touchHandler setEnabled:YES];
    [touchHandler reset];
  }
}

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer
{
  RNSScreenComponentView *topScreen = (RNSScreenComponentView *)_controller.viewControllers.lastObject.view;

  if (![topScreen isKindOfClass:[RNSScreenComponentView class]] || !topScreen.gestureEnabled ||
      _controller.viewControllers.count < 2) {
    return NO;
  }

#if TARGET_OS_TV
  [self cancelTouchesInPartent];
  return YES;
#else

  if (topScreen.fullScreenSwipeEnabled) {
    // we want only `RNSPanGestureRecognizer` to be able to recognize when
    // `fullScreenSwipeEnabled` is set
    if ([gestureRecognizer isKindOfClass:[RNSPanGestureRecognizerF class]]) {
      _isFullWidthSwiping = YES;
      [self cancelTouchesInParent];
      return YES;
    }
    return NO;
  }

  if ([gestureRecognizer isKindOfClass:[RNSScreenEdgeGestureRecognizerF class]]) {
    // it should only recognize with `customAnimationOnSwipe` set
    return NO;
  } else if ([gestureRecognizer isKindOfClass:[RNSPanGestureRecognizerF class]]) {
    // it should only recognize with `fullScreenSwipeEnabled` set
    return NO;
  }
  [self cancelTouchesInParent];
  return _controller.viewControllers.count >= 2;

  // TODO: add code for customAnimationOnSwipe prop here
#endif
}

#if !TARGET_OS_TV
- (void)setupGestureHandlers
{
  // gesture recognizers for custom stack animations
  RNSScreenEdgeGestureRecognizerF *leftEdgeSwipeGestureRecognizer =
      [[RNSScreenEdgeGestureRecognizerF alloc] initWithTarget:self action:@selector(handleSwipe:)];
  leftEdgeSwipeGestureRecognizer.edges = UIRectEdgeLeft;
  leftEdgeSwipeGestureRecognizer.delegate = self;
  [self addGestureRecognizer:leftEdgeSwipeGestureRecognizer];

  RNSScreenEdgeGestureRecognizerF *rightEdgeSwipeGestureRecognizer =
      [[RNSScreenEdgeGestureRecognizerF alloc] initWithTarget:self action:@selector(handleSwipe:)];
  rightEdgeSwipeGestureRecognizer.edges = UIRectEdgeRight;
  rightEdgeSwipeGestureRecognizer.delegate = self;

  // gesture recognizer for full width swipe gesture
  RNSPanGestureRecognizerF *panRecognizer = [[RNSPanGestureRecognizerF alloc] initWithTarget:self
                                                                                      action:@selector(handleSwipe:)];
  panRecognizer.delegate = self;
  [self addGestureRecognizer:panRecognizer];
}

- (void)handleSwipe:(UIPanGestureRecognizer *)gestureRecognizer
{
  RNSScreenComponentView *topScreen = (RNSScreenComponentView *)_controller.viewControllers.lastObject.view;

  float translation;
  float velocity;
  float distance;

  if (topScreen.swipeDirection == RNSScreenSwipeDirectionVertical) {
    translation = [gestureRecognizer translationInView:gestureRecognizer.view].y;
    velocity = [gestureRecognizer velocityInView:gestureRecognizer.view].y;
    distance = gestureRecognizer.view.bounds.size.height;
  } else {
    translation = [gestureRecognizer translationInView:gestureRecognizer.view].x;
    velocity = [gestureRecognizer velocityInView:gestureRecognizer.view].x;
    distance = gestureRecognizer.view.bounds.size.width;
    BOOL isRTL = _controller.view.semanticContentAttribute == UISemanticContentAttributeForceRightToLeft;
    if (isRTL) {
      translation = -translation;
      velocity = -velocity;
    }
  }

  float transitionProgress = (translation / distance);

  switch (gestureRecognizer.state) {
    case UIGestureRecognizerStateBegan: {
      _interactionController = [UIPercentDrivenInteractiveTransition new];
      [_controller popViewControllerAnimated:YES];
      break;
    }

    case UIGestureRecognizerStateChanged: {
      [_interactionController updateInteractiveTransition:transitionProgress];
      break;
    }

    case UIGestureRecognizerStateCancelled: {
      [_interactionController cancelInteractiveTransition];
      break;
    }

    case UIGestureRecognizerStateEnded: {
      // values taken from
      // https://github.com/react-navigation/react-navigation/blob/54739828598d7072c1bf7b369659e3682db3edc5/packages/stack/src/views/Stack/Card.tsx#L316
      BOOL shouldFinishTransition = (translation + velocity * 0.3) > (distance / 2);
      if (shouldFinishTransition) {
        [_interactionController finishInteractiveTransition];
      } else {
        [_interactionController cancelInteractiveTransition];
      }
      _interactionController = nil;
    }
    default: {
      break;
    }
  }
}
#endif

#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _reactSubviews = [NSMutableArray new];
  [self dismissOnReload];
  [_controller willMoveToParentViewController:nil];
  [_controller removeFromParentViewController];
  [_controller setViewControllers:@[ [UIViewController new] ]];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSScreenStackComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> RNSScreenStackCls(void)
{
  return RNSScreenStackComponentView.class;
}
