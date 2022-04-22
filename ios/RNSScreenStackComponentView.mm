#ifdef RN_FABRIC_ENABLED
#import "RNSScreenStackComponentView.h"
#import "RNSScreen.h"
#import "RNSScreenStackAnimator.h"
#import "RNSScreenStackHeaderConfigComponentView.h"
#import "RNSScreenWindowTraits.h"

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
    RCTMountingTransactionObserving> {
  BOOL _updateScheduled;
}

@property (nonatomic) NSMutableArray<UIViewController *> *presentedModals;
@property (nonatomic) BOOL updatingModals;
@property (nonatomic) BOOL scheduleModalsUpdate;

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
  NSMutableArray<RNSScreenView *> *_reactSubviews;
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
    _presentedModals = [NSMutableArray new];
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
  // TODO: Remove this if def when merging with RNSScreenStack
#ifdef RN_FABRIC_ENABLED
  if (![childComponentView isKindOfClass:[RNSScreenView class]]) {
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

  [_reactSubviews insertObject:(RNSScreenView *)childComponentView atIndex:index];
  ((RNSScreenView *)childComponentView).reactSuperview = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    [self maybeAddToParentAndUpdateContainer];
  });
#endif
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  // TODO: Remove this if def when merging with RNSScreenStack
#ifdef RN_FABRIC_ENABLED
  RNSScreenView *screenChildComponent = (RNSScreenView *)childComponentView;
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
#endif
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
  // TODO: Remove this if def when merging with RNSScreenStack
#ifdef RN_FABRIC_ENABLED

  UIView *view = viewController.view;
  if ([view isKindOfClass:RNSScreenView.class]) {
    RNSScreenStackHeaderConfigComponentView *config =
        (RNSScreenStackHeaderConfigComponentView *)((RNSScreenView *)view).config;
    [RNSScreenStackHeaderConfigComponentView willShowViewController:viewController animated:animated withConfig:config];
  }
#endif
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

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  // We don't directly set presentation delegate but instead rely on the ScreenView's delegate to
  // forward certain calls to the container (Stack).
  UIView *screenView = presentationController.presentedViewController.view;
  if ([screenView isKindOfClass:[RNSScreenView class]]) {
    // we trigger the update of status bar's appearance here because there is no other lifecycle method
    // that can handle it when dismissing a modal, the same for orientation
    [RNSScreenWindowTraits updateWindowTraits];
    [_presentedModals removeObject:presentationController.presentedViewController];
    // we double check if there are no new controllers pending to be presented since someone could
    // have tried to push another one during the transition
    _updatingModals = NO;
    [self updateContainer];
    // TODO: implement onFinishTransitioning
    //    if (self.onFinishTransitioning) {
    //      // instead of directly triggering onFinishTransitioning this time we enqueue the event on the
    //      // main queue. We do that because onDismiss event is also enqueued and we want for the transition
    //      // finish event to arrive later than onDismiss (see RNSScreen#notifyDismiss)
    //      dispatch_async(dispatch_get_main_queue(), ^{
    //        if (self.onFinishTransitioning) {
    //          self.onFinishTransitioning(nil);
    //        }
    //      });
    //    }
  }
}

- (void)setPushViewControllers:(NSArray<UIViewController *> *)controllers
{
  // TODO: Remove this if def when merging with RNSScreenStack
#ifdef RN_FABRIC_ENABLED

  // when there is no change we return immediately
  if ([_controller.viewControllers isEqualToArray:controllers]) {
    return;
  }

  // if view controller is not yet attached to window we skip updates now and run them when view
  // is attached
  if (self.window == nil) {
    return;
  }

  // when transition is ongoing, any updates made to the controller will not be reflected until the
  // transition is complete. In particular, when we push/pop view controllers we expect viewControllers
  // property to be updated immediately. Based on that property we then calculate future updates.
  // When the transition is ongoing the property won't be updated immediatly. We therefore avoid
  // making any updated when transition is ongoing and schedule updates for when the transition
  // is complete.
  if (_controller.transitionCoordinator != nil) {
    if (!_updateScheduled) {
      _updateScheduled = YES;
      __weak RNSScreenStackComponentView *weakSelf = self;
      [_controller.transitionCoordinator
          animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
            // do nothing here, we only want to be notified when transition is complete
          }
          completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
            self->_updateScheduled = NO;
            [weakSelf updateContainer];
          }];
    }
    return;
  }

  UIViewController *top = controllers.lastObject;
  UIViewController *previousTop = _controller.topViewController;

  // At the start we set viewControllers to contain a single UIViewController
  // instance. This is a workaround for header height adjustment bug (see comment
  // in the init function). Here, we need to detect if the initial empty
  // controller is still there
  BOOL firstTimePush = ![previousTop isKindOfClass:[RNSScreen class]];

  if (firstTimePush) {
    // nothing pushed yet
    [_controller setViewControllers:controllers animated:NO];
  } else if (top != previousTop) {
    if (![controllers containsObject:previousTop]) {
      // if the previous top screen does not exist anymore and the new top was not on the stack before, probably replace
      // was called, so we check the animation
      if (![_controller.viewControllers containsObject:top]) {
        // setting new controllers with animation does `push` animation by default
        auto screenController = (RNSScreen *)top;
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
      auto screenController = (RNSScreen *)top;
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
#endif
}

- (void)setModalViewControllers:(NSArray<UIViewController *> *)controllers
{
  // prevent re-entry
  if (_updatingModals) {
    _scheduleModalsUpdate = YES;
    return;
  }

  // when there is no change we return immediately. This check is important because sometime we may
  // accidently trigger modal dismiss if we don't verify to run the below code only when an actual
  // change in the list of presented modal was made.
  if ([_presentedModals isEqualToArray:controllers]) {
    return;
  }

  // if view controller is not yet attached to window we skip updates now and run them when view
  // is attached
  if (self.window == nil && _presentedModals.lastObject.view.window == nil) {
    return;
  }

  _updatingModals = YES;

  NSMutableArray<UIViewController *> *newControllers = [NSMutableArray arrayWithArray:controllers];
  [newControllers removeObjectsInArray:_presentedModals];

  // find bottom-most controller that should stay on the stack for the duration of transition
  NSUInteger changeRootIndex = 0;
  UIViewController *changeRootController = _controller;
  for (NSUInteger i = 0; i < MIN(_presentedModals.count, controllers.count); i++) {
    if (_presentedModals[i] == controllers[i]) {
      changeRootController = controllers[i];
      changeRootIndex = i + 1;
    } else {
      break;
    }
  }

  // we verify that controllers added on top of changeRootIndex are all new. Unfortunately modal
  // VCs cannot be reshuffled (there are some visual glitches when we try to dismiss then show as
  // even non-animated dismissal has delay and updates the screen several times)
  for (NSUInteger i = changeRootIndex; i < controllers.count; i++) {
    if ([_presentedModals containsObject:controllers[i]]) {
      RCTAssert(false, @"Modally presented controllers are being reshuffled, this is not allowed");
    }
  }

  __weak RNSScreenStackComponentView *weakSelf = self;

  void (^afterTransitions)(void) = ^{
    // TODO: find out how to implement these
    //    if (weakSelf.onFinishTransitioning) {
    //      weakSelf.onFinishTransitioning(nil);
    //    }
    weakSelf.updatingModals = NO;
    if (weakSelf.scheduleModalsUpdate) {
      // if modals update was requested during setModalViewControllers we set scheduleModalsUpdate
      // flag in order to perform updates at a later point. Here we are done with all modals
      // transitions and check this flag again. If it was set, we reset the flag and execute updates.
      weakSelf.scheduleModalsUpdate = NO;
      [weakSelf updateContainer];
    }
    // we trigger the update of orientation here because, when dismissing the modal from JS,
    // neither `viewWillAppear` nor `presentationControllerDidDismiss` are called, same for status bar.
    [RNSScreenWindowTraits updateWindowTraits];
  };

  void (^finish)(void) = ^{
    NSUInteger oldCount = weakSelf.presentedModals.count;
    if (changeRootIndex < oldCount) {
      [weakSelf.presentedModals removeObjectsInRange:NSMakeRange(changeRootIndex, oldCount - changeRootIndex)];
    }
    BOOL isAttached =
        changeRootController.parentViewController != nil || changeRootController.presentingViewController != nil;
    if (!isAttached || changeRootIndex >= controllers.count) {
      // if change controller view is not attached, presenting modals will silently fail on iOS.
      // In such a case we trigger controllers update from didMoveToWindow.
      // We also don't run any present transitions if changeRootIndex is greater or equal to the size
      // of new controllers array. This means that no new controllers should be presented.
      afterTransitions();
      return;
    } else {
      UIViewController *previous = changeRootController;
      for (NSUInteger i = changeRootIndex; i < controllers.count; i++) {
        UIViewController *next = controllers[i];
        BOOL lastModal = (i == controllers.count - 1);

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
        if (@available(iOS 13.0, tvOS 13.0, *)) {
          // Inherit UI style from its parent - solves an issue with incorrect style being applied to some UIKit views
          // like date picker or segmented control.
          next.overrideUserInterfaceStyle = self->_controller.overrideUserInterfaceStyle;
        }
#endif

        BOOL shouldAnimate = lastModal && [next isKindOfClass:[RNSScreen class]] &&
            ((RNSScreenView *)next.view).stackAnimation != RNSScreenStackAnimationNone;

        // if you want to present another modal quick enough after dismissing the previous one,
        // it will result in wrong changeRootController, see repro in
        // https://github.com/software-mansion/react-native-screens/issues/1299 We call `updateContainer` again in
        // `presentationControllerDidDismiss` to cover this case and present new controller
        if (previous.beingDismissed) {
          return;
        }

        [previous presentViewController:next
                               animated:shouldAnimate
                             completion:^{
                               [weakSelf.presentedModals addObject:next];
                               if (lastModal) {
                                 afterTransitions();
                               };
                             }];
        previous = next;
      }
    }
  };

  if (changeRootController.presentedViewController != nil &&
      [_presentedModals containsObject:changeRootController.presentedViewController]) {
    BOOL shouldAnimate = changeRootIndex == controllers.count &&
        [changeRootController.presentedViewController isKindOfClass:[RNSScreen class]] &&
        ((RNSScreenView *)changeRootController.presentedViewController.view).stackAnimation !=
            RNSScreenStackAnimationNone;
    [changeRootController dismissViewControllerAnimated:shouldAnimate completion:finish];
  } else {
    finish();
  }
}

- (void)updateContainer
{
  NSMutableArray<UIViewController *> *pushControllers = [NSMutableArray new];
  NSMutableArray<UIViewController *> *modalControllers = [NSMutableArray new];
  for (RNSScreenView *screen in _reactSubviews) {
    if (screen.controller != nil) {
      if (pushControllers.count == 0) {
        // first screen on the list needs to be places as "push controller"
        [pushControllers addObject:screen.controller];
      } else {
        if (screen.stackPresentation == RNSScreenStackPresentationPush) {
          [pushControllers addObject:screen.controller];
        } else {
          [modalControllers addObject:screen.controller];
        }
      }
    }
  }

  [self setPushViewControllers:pushControllers];
  [self setModalViewControllers:modalControllers];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _controller.view.frame = self.bounds;
}

- (void)dismissOnReload
{
  // TODO: Remove this ifdef when merging with RNSScreenStack
#ifdef RN_FABRIC_ENABLED
  auto screenController = (RNSScreen *)_controller.topViewController;
  [screenController resetViewToScreen];
#endif
}

#pragma mark - methods connected to transitioning

- (id<UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController
                                  animationControllerForOperation:(UINavigationControllerOperation)operation
                                               fromViewController:(UIViewController *)fromVC
                                                 toViewController:(UIViewController *)toVC
{
  RNSScreenView *screen;
  if (operation == UINavigationControllerOperationPush) {
    screen = (RNSScreenView *)toVC.view;
  } else if (operation == UINavigationControllerOperationPop) {
    screen = (RNSScreenView *)fromVC.view;
  }
  if (screen != nil &&
      // we need to return the animator when full width swiping even if the animation is not custom,
      // otherwise the screen will be just popped immediately due to no animation
      (_isFullWidthSwiping || [RNSScreenStackAnimator isCustomAnimation:screen.stackAnimation])) {
    return [[RNSScreenStackAnimator alloc] initWithOperation:operation];
  }
  return nil;
}

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
  RNSScreenView *topScreen = (RNSScreenView *)_controller.viewControllers.lastObject.view;

  if (![topScreen isKindOfClass:[RNSScreenView class]] || !topScreen.gestureEnabled ||
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
  RNSScreenView *topScreen = (RNSScreenView *)_controller.viewControllers.lastObject.view;

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

  for (UIViewController *controller in _presentedModals) {
    [controller dismissViewControllerAnimated:NO completion:nil];
  }

  [_presentedModals removeAllObjects];
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

#endif // RN_FABRIC_ENABLED
