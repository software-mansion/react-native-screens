#import "RNSStackNavigationController.h"
#import "RNSAssert.h"
#import "RNSContainer.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSParentContainerItemRegistry.h"
#import "RNSStackAnimationResolver.h"
#import "RNSStackAnimationTransitionTimeline.h"
#import "RNSStackNavigationBar.h"
#import "RNSStackNavigationControllerDelegate.h"
#import "RNSStackOperation.h"
#import "RNSStackPopGestureRecognizerDelegate.h"
#import "RNSStackScreenController.h"
#import "RNSStackScreenHeaderCoordinator.h"
#import "RNSViewControllerViewLifecycleEventsObserver.h"
#import "RNSViewFrameChangeDelegate.h"

@implementation RNSStackNavigationController {
  // The screens in the stack, bottom to top. `viewControllers` cannot serve as the model (undocumented):
  // it ignores a `setViewControllers:` UIKit queues behind its running transition, and it drops the
  // swiped screen when the swipe begins, before it commits or cancels.
  NSMutableArray<RNSStackScreenController *> *_Nonnull _stackModel;
  NSMutableArray<RNSPushOperation *> *_Nonnull _pendingPushOperations;
  NSMutableArray<RNSPopOperation *> *_Nonnull _pendingPopOperations;
  RNSParentContainerItemRegistry *_Nonnull _parentContainerRegistry;
  // UIKit holds both delegates weakly.
  RNSStackNavigationControllerDelegate *_Nonnull _navigationControllerDelegate;
#if !TARGET_OS_TV
  RNSStackPopGestureRecognizerDelegate *_Nonnull _popGestureRecognizerDelegate;
#endif // !TARGET_OS_TV
  BOOL _needsLayoutDirectionUpdateBelowIOS17;
}

- (instancetype)init
{
#if !TARGET_OS_TV
  self = [super initWithNavigationBarClass:RNSStackNavigationBar.class toolbarClass:nil];
#else // !TARGET_OS_TV
  self = [super init];
#endif // !TARGET_OS_TV
  if (self != nil) {
    _navigationBarCoordinator = [RNSStackNavigationBarCoordinator new];
    [_navigationBarCoordinator initializeNavigationBarOfNavigationController:self];
    [self initState];
  }
  return self;
}

- (void)initState
{
  _stackModel = [NSMutableArray array];
  _pendingPushOperations = [NSMutableArray array];
  _pendingPopOperations = [NSMutableArray array];
  _parentContainerRegistry = [RNSParentContainerItemRegistry new];
  _navigationControllerDelegate = [RNSStackNavigationControllerDelegate new];
  self.delegate = _navigationControllerDelegate;
  _layoutDirection = UITraitEnvironmentLayoutDirectionUnspecified;
  _needsLayoutDirectionUpdateBelowIOS17 = NO;
#if !TARGET_OS_TV
  _popGestureRecognizerDelegate = [[RNSStackPopGestureRecognizerDelegate alloc] initWithNavigationController:self];
#endif // !TARGET_OS_TV
#if RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
  if (@available(iOS 17.0, *)) {
    [self registerForTraitChanges:@[ UITraitLayoutDirection.class ]
                       withAction:@selector(updateViewSemanticContentAttribute)];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
}

- (void)viewDidLoad
{
  [super viewDidLoad];
#if !TARGET_OS_TV
  // UIKit creates the system pop recognizers with the view.
  for (UIGestureRecognizer *recognizer in [self systemPopGestureRecognizers]) {
    recognizer.delegate = _popGestureRecognizerDelegate;
  }
#endif // !TARGET_OS_TV
  [self updateViewSemanticContentAttribute];
}

#pragma mark-- Layout

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
  [_navigationBarFrameChangeDelegate viewFrameDidChange:self.navigationBar];
  [_viewFrameChangeDelegate viewFrameDidChange:self.view];
}

#pragma mark - View lifecycle events

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [_viewLifecycleEventsObserver viewControllerViewWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_viewLifecycleEventsObserver viewControllerViewDidAppear:self];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_viewLifecycleEventsObserver viewControllerViewWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_viewLifecycleEventsObserver viewControllerViewDidDisappear:self];
}

#pragma mark - Layout direction

- (void)setLayoutDirection:(UITraitEnvironmentLayoutDirection)layoutDirection
{
  _layoutDirection = layoutDirection;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
  if (@available(iOS 17.0, *)) {
    // Assigning `Unspecified` installs an override with that value, which views resolve against the app direction
    // instead of the parent's (undocumented, 18 and 27). Removing the override restores inheritance, see
    // https://developer.apple.com/videos/play/wwdc2023/10057/.
    if (layoutDirection == UITraitEnvironmentLayoutDirectionUnspecified) {
      [self.traitOverrides removeTrait:UITraitLayoutDirection.class];
    } else {
      self.traitOverrides.layoutDirection = layoutDirection;
    }
    return;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
  // Before iOS 17 only the parent overrides a child's traits; applied once there is one.
  _needsLayoutDirectionUpdateBelowIOS17 = YES;
  if (self.parentViewController != nil) {
    [self updateLayoutDirectionBelowIOS17];
  }
}

- (void)updateLayoutDirectionBelowIOS17
{
  _needsLayoutDirectionUpdateBelowIOS17 = NO;
  [self.parentViewController
      setOverrideTraitCollection:[UITraitCollection traitCollectionWithLayoutDirection:_layoutDirection]
          forChildViewController:self];
}

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
  [super traitCollectionDidChange:previousTraitCollection];
#if RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
  // From iOS 17 the trait change registration in `initState` covers this.
  if (@available(iOS 17.0, *)) {
    return;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
  if (self.traitCollection.layoutDirection != previousTraitCollection.layoutDirection) {
    [self updateViewSemanticContentAttribute];
  }
}

// UIKit picks the edge of the system pop recognizers and the direction of the content swipe from this view's
// `semanticContentAttribute` resolved against the app direction, never from the trait (undocumented): an RTL trait in
// an LTR app pushes from the left but pops from the left edge. Descendants keep their own direction: a view resolves it
// from its own attribute and the trait. See https://developer.apple.com/forums/thread/704049.
- (void)updateViewSemanticContentAttribute
{
  if (!self.isViewLoaded) {
    return;
  }
  switch (self.traitCollection.layoutDirection) {
    case UITraitEnvironmentLayoutDirectionLeftToRight:
      self.view.semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
      break;
    case UITraitEnvironmentLayoutDirectionRightToLeft:
      self.view.semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
      break;
    case UITraitEnvironmentLayoutDirectionUnspecified:
      // Views resolve an unspecified trait against the app direction, and so does this attribute.
      self.view.semanticContentAttribute = UISemanticContentAttributeUnspecified;
      break;
  }
}

#pragma mark - RNSContainer

- (nullable UIScrollView *)resolveCurrentContentScrollView
{
  // We assume `topViewController` corresponds to the currently presented screen.
  UIViewController *topController = self.topViewController;
  if (![topController isKindOfClass:RNSStackScreenController.class]) {
    return nil;
  }
  return [static_cast<RNSStackScreenController *>(topController) findContentScrollView];
}

- (void)attachToParentContainerItem
{
  [_parentContainerRegistry attachContainer:self];
}

- (void)detachFromParentContainerItem
{
  [_parentContainerRegistry detachContainer:self];
}

#pragma mark - View controller containment

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  [super didMoveToParentViewController:parent];

  if (parent != nil) {
    if (_needsLayoutDirectionUpdateBelowIOS17) {
      [self updateLayoutDirectionBelowIOS17];
    }
    [self attachToParentContainerItem];
  } else {
    [self detachFromParentContainerItem];
  }
}

- (BOOL)hasPendingOperations
{
  return _pendingPushOperations.count > 0 || _pendingPopOperations.count > 0;
}

- (void)enqueuePushOperation:(nonnull RNSStackScreenController *)screenController
{
  RNSPushOperation *operation = [[RNSPushOperation alloc] initWithScreenController:screenController];
  [_pendingPushOperations addObject:operation];
}

- (void)enqueuePopOperation:(nonnull RNSStackScreenController *)screenController
{
  RNSPopOperation *operation = [[RNSPopOperation alloc] initWithScreenController:screenController];
  [_pendingPopOperations addObject:operation];
}

#pragma mark - RNSContainerTransactionSupporting

- (void)beginTransaction
{
  // noop
}

- (void)commitTransaction
{
  if (![self hasPendingOperations]) {
    return;
  }

  NSMutableArray<RNSStackScreenController *> *target = [_stackModel mutableCopy];
  for (RNSPopOperation *op in _pendingPopOperations) {
    RNSAssert(target.count > 1, @"[RNScreens] Attempt to pop last screen from the stack");
    RNSAssert(target.lastObject == op.screenController, @"[RNScreens] Attempt to pop non-top screen");
    [target removeObject:op.screenController];
  }
  for (RNSPushOperation *op in _pendingPushOperations) {
    [target addObject:op.screenController];
  }
  RNSAssert(target.count > 0, @"[RNScreens] Stack should never be empty after updates");

  [_pendingPopOperations removeAllObjects];
  [_pendingPushOperations removeAllObjects];

  [self applyStackModel:target];
}

- (void)applyStackModel:(nonnull NSArray<RNSStackScreenController *> *)target
{
  if ([target isEqualToArray:_stackModel]) {
    return;
  }
  [self finishRunningCustomTransition];
  NSArray<RNSStackScreenController *> *previous = [_stackModel copy];
  [_stackModel setArray:target];
  [self stackModelDidChange];
  // UIKit mishandles `setViewControllers:` during an interactive transition: a back swipe, or dragging down an
  // `RNSSheetContentController` the stack is in or under. From 26 a swiped pop commits inside the call even if the
  // finger cancels, below 26 the call is replayed after the swipe; the popped screen stays shown although it left the
  // model (undocumented, 18 and 27). A sheet drag queues each call and replays them after it ends (undocumented, 27).
  if (self.transitionCoordinator.initiallyInteractive) {
    [self updateViewControllersWhenTransitionEnds];
    return;
  }
  [self updateViewControllersTransitioningFrom:previous];
}

// Each change made during the transition registers its own completion. A pending flag would work too; this keeps the
// controller free of extra state until the stack model refactor handles changes during transitions. The completions run
// in order once the transition has ended, the first with no transition running (undocumented, 18 and 27). It hands the
// model to UIKit; the later ones return because the push or pop it started is running (during a pop `viewControllers`
// still lists the outgoing screen) or because the lists are equal. A swipe leaves its screen in `viewControllers` after
// a cancel and removes it after a commit.
- (void)updateViewControllersWhenTransitionEnds
{
  __weak auto weakSelf = self;
  [self.transitionCoordinator
      animateAlongsideTransition:nil
                      completion:^(id<UIViewControllerTransitionCoordinatorContext> context) {
                        auto strongSelf = weakSelf;
                        if (strongSelf == nil || strongSelf.transitionCoordinator != nil) {
                          return;
                        }
                        NSArray<RNSStackScreenController *> *shown =
                            static_cast<NSArray<RNSStackScreenController *> *>(strongSelf.viewControllers);
                        if (![shown isEqualToArray:strongSelf->_stackModel]) {
                          [strongSelf updateViewControllersTransitioningFrom:shown];
                        }
                      }];
}

- (void)updateViewControllersTransitioningFrom:(nonnull NSArray<RNSStackScreenController *> *)previous
{
  RNSStackScreenController *outgoing = previous.lastObject;
  RNSStackScreenController *incoming = _stackModel.lastObject;
  BOOL animated = outgoing != nil;
  // A change below an unchanged top is neither a push nor a pop, so no screen's animation applies to it.
  if (animated && incoming != outgoing) {
    // UIKit plays `setViewControllers:` as a pop when the new top was already in the stack.
    RNSStackAnimationTransitionKind kind =
        [previous containsObject:incoming] ? RNSStackAnimationTransitionKindPop : RNSStackAnimationTransitionKindPush;
    RNSStackAnimationTransitionTimeline *timeline = [RNSStackAnimationResolver transitionTimelineForKind:kind
                                                                                                outgoing:outgoing
                                                                                                incoming:incoming];
    animated = !timeline.isStatic;
  }
  [self setViewControllers:[_stackModel copy] animated:animated];
}

#pragma mark - Native pops

- (nullable UIViewController *)popViewControllerAnimated:(BOOL)animated
{
  [self finishRunningCustomTransition];
  // The system pop recognizers call this when they begin (undocumented). The swipe can still cancel, so the screen
  // leaves the model only when it commits, through the coordinator `super` creates. UIKit pops its own top, which is
  // below the model's while a change waits for a transition to end.
  if ([self isSystemPopGestureBeginning]) {
    UIViewController *popped = [super popViewControllerAnimated:animated];
    if (popped != nil) {
      [self removeFromStackModelWhenSwipeCommits:static_cast<RNSStackScreenController *>(popped)];
    }
    return popped;
  }
  [self removeTopFromStackModel];
  return [super popViewControllerAnimated:animated];
}

// The back button menu pops through here.
- (nullable NSArray<UIViewController *> *)popToViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  [self finishRunningCustomTransition];
  NSUInteger index = [_stackModel indexOfObject:static_cast<RNSStackScreenController *>(viewController)];
  if (index != NSNotFound) {
    [self cutStackModelAboveIndex:index];
  }
  return [super popToViewController:viewController animated:animated];
}

// A tab bar re-selecting its tab pops to root through here. `RNSTabBarController` refuses the repeated selection,
// so only another tab bar controller reaches it.
- (nullable NSArray<UIViewController *> *)popToRootViewControllerAnimated:(BOOL)animated
{
  [self finishRunningCustomTransition];
  [self cutStackModelAboveIndex:0];
  return [super popToRootViewControllerAnimated:animated];
}

- (void)cutStackModelAboveIndex:(NSUInteger)index
{
  if (index + 1 < _stackModel.count) {
    [_stackModel removeObjectsInRange:NSMakeRange(index + 1, _stackModel.count - index - 1)];
    [self stackModelDidChange];
  }
}

- (void)removeTopFromStackModel
{
  // UIKit refuses to pop the root.
  if (_stackModel.count > 1) {
    [_stackModel removeLastObject];
    [self stackModelDidChange];
  }
}

- (void)removeFromStackModelWhenSwipeCommits:(nonnull RNSStackScreenController *)screenController
{
  __weak auto weakSelf = self;
  [self.transitionCoordinator
      notifyWhenInteractionChangesUsingBlock:^(id<UIViewControllerTransitionCoordinatorContext> context) {
        auto strongSelf = weakSelf;
        if (strongSelf != nil && !context.isCancelled) {
          [strongSelf->_stackModel removeObject:screenController];
          [strongSelf stackModelDidChange];
        }
      }];
}

- (void)stackModelDidChange
{
  [self dumpStackModel];
#if !TARGET_OS_TV
  [self applyBackButtonConfigs];
#endif // !TARGET_OS_TV
}

// UIKit queues a navigation call behind a running custom animator and a swipe's queued pop then plays without the
// finger (undocumented, 18 and 27). UIKit finishes its own running transition inside the next call on 26 and later
// (undocumented); this does the same for ours.
- (void)finishRunningCustomTransition
{
  [_navigationControllerDelegate.transitionAnimator finish];
}

- (BOOL)isSystemPopGestureBeginning
{
#if !TARGET_OS_TV
  for (UIGestureRecognizer *recognizer in [self systemPopGestureRecognizers]) {
    if (recognizer.state == UIGestureRecognizerStateBegan) {
      return YES;
    }
  }
#endif // !TARGET_OS_TV
  return NO;
}

#if !TARGET_OS_TV
- (nonnull NSArray<UIGestureRecognizer *> *)systemPopGestureRecognizers
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    return @[ self.interactivePopGestureRecognizer, self.interactiveContentPopGestureRecognizer ];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  return @[ self.interactivePopGestureRecognizer ];
}
#endif // !TARGET_OS_TV

#pragma mark - Back button

#if !TARGET_OS_TV
- (void)applyBackButtonConfigs
{
  [self applyBackButtonConfigsForScreens:_stackModel];
}

// The top item keeps the config of the screen that was above it. UIKit reads it only while a screen sits above, and
// every change that puts one there rewrites it here first; clearing it on a pop would relabel the back button of the
// leaving screen, which iOS 18 and 26 redraw live.
- (void)applyBackButtonConfigsForScreens:(nonnull NSArray<RNSStackScreenController *> *)screens
{
  for (NSUInteger index = 1; index < screens.count; index++) {
    [screens[index].headerCoordinator applyBackButtonConfigToNavigationItem:screens[index - 1].navigationItem];
  }
}
#endif // !TARGET_OS_TV

#pragma mark - Debug

- (void)dumpStackModel
{
#ifdef RNS_DEBUG_LOGGING
  RNSLogD(@"[RNScreens] StackContainer [%ld] MODEL BEGIN", self.view.tag);
  for (RNSStackScreenController *screenController in _stackModel) {
    RNSLogD(@"[RNScreens] %@", screenController.configProvider.screenKey);
  }
#endif // RNS_DEBUG_LOGGING
}

@end
