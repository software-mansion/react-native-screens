#import "RNSStackNavigationController.h"
#import "RNSAssert.h"
#import "RNSContainer.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSParentContainerItemRegistry.h"
#import "RNSStackNavigationBar.h"
#import "RNSStackNavigationControllerDelegate.h"
#import "RNSStackNavigationStateObserverRegistry.h"
#import "RNSStackPopGestureRecognizerDelegate.h"
#import "RNSStackScreenController.h"
#import "RNSStackTransition.h"
#import "RNSViewControllerViewLifecycleEventsObserver.h"
#import "RNSViewFrameChangeDelegate.h"

@implementation RNSStackNavigationController {
  /// The screens in the stack, bottom to top: K of the navigation state. See the class documentation for why it is
  /// not `viewControllers`.
  NSMutableArray<RNSStackScreenController *> *_Nonnull _stackModel;

  /// Provenance of the state created by the last transition of an origin other than JS, or
  /// `RNSStackNavigationStateInitialProvenance` if there has been none. Used for staleness.
  int _lastNonJsTransitionProvenance;

  /// YES while one of the pop overrides runs. UIKit may implement one pop method with another (undocumented); only the
  /// outermost call is a transition.
  BOOL _isHandlingNativePop;

  RNSStackNavigationStateObserverRegistry *_Nonnull _observerRegistry;
  RNSParentContainerItemRegistry *_Nonnull _parentContainerRegistry;

  // UIKit holds both delegates weakly.
  RNSStackNavigationControllerDelegate *_Nonnull _navigationControllerDelegate;
#if !TARGET_OS_TV
  RNSStackPopGestureRecognizerDelegate *_Nonnull _popGestureRecognizerDelegate;
#endif // !TARGET_OS_TV
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
  _navigationState = nil;
  _lastNonJsTransitionProvenance = RNSStackNavigationStateInitialProvenance;
  _isHandlingNativePop = NO;
  _observerRegistry = [RNSStackNavigationStateObserverRegistry new];
  _parentContainerRegistry = [RNSParentContainerItemRegistry new];
  _navigationControllerDelegate = [RNSStackNavigationControllerDelegate new];
  self.delegate = _navigationControllerDelegate;
#if !TARGET_OS_TV
  _popGestureRecognizerDelegate = [[RNSStackPopGestureRecognizerDelegate alloc] initWithNavigationController:self];
#endif // !TARGET_OS_TV
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
}

#pragma mark - Public API

- (BOOL)addNavigationStateObserver:(id<RNSStackNavigationStateObserver>)observer
{
  return [_observerRegistry addObserver:observer];
}

- (BOOL)removeNavigationStateObserver:(id<RNSStackNavigationStateObserver>)observer
{
  return [_observerRegistry removeObserver:observer];
}

#pragma mark - Internal API

- (BOOL)isJsRequestBaseProvenanceStale:(int)baseProvenance
{
  return baseProvenance < _lastNonJsTransitionProvenance;
}

- (void)tearDown
{
  [_observerRegistry clear];
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
    [self attachToParentContainerItem];
  } else {
    [self detachFromParentContainerItem];
  }
}

#pragma mark - RNSContainerTransactionSupporting

- (void)beginTransaction
{
  // noop
}

- (void)commitTransaction
{
  // noop
}

#pragma mark - Navigation state

/**
 * Commits a transition: `stack` becomes the model of the stack and the navigation state progresses. Notifies the
 * observers. Does not touch UIKit; the caller makes the matching UIKit call.
 */
- (void)commitStack:(nonnull NSArray<RNSStackScreenController *> *)stack withOrigin:(RNSStackActionOrigin)origin
{
  RNSAssert(stack.count > 0, @"[RNScreens] Attempt to commit an empty stack");

  [_stackModel setArray:stack];

  int provenance = _navigationState != nil ? _navigationState.provenance + 1 : 0;
  _navigationState = [RNSStackNavigationState stateWithStack:[self screenKeysOfStack:stack] provenance:provenance];
  if (origin != RNSStackActionOriginProgrammaticJs) {
    _lastNonJsTransitionProvenance = provenance;
  }

  [self dumpStackModel];

  auto *context = [[RNSStackNavigationStateUpdateContext alloc] initWithNavState:_navigationState actionOrigin:origin];
  [_observerRegistry emitDidUpdateStateTo:_navigationState withContext:context sender:self];
}

- (nonnull NSArray<NSString *> *)screenKeysOfStack:(nonnull NSArray<RNSStackScreenController *> *)stack
{
  NSMutableArray<NSString *> *screenKeys = [NSMutableArray arrayWithCapacity:stack.count];
  for (RNSStackScreenController *screenController in stack) {
    NSString *screenKey = screenController.configProvider.screenKey;
    RNSAssert(screenKey != nil, @"[RNScreens] Screen in the stack MUST have a screenKey");
    [screenKeys addObject:screenKey != nil ? screenKey : @""];
  }
  return screenKeys;
}

#pragma mark - Native pops

// The back button and the system pop recognizers pop through here.
- (nullable UIViewController *)popViewControllerAnimated:(BOOL)animated
{
  if (_isHandlingNativePop) {
    return [super popViewControllerAnimated:animated];
  }
  _isHandlingNativePop = YES;
  UIViewController *popped = [self handleNativePopViewControllerAnimated:animated];
  _isHandlingNativePop = NO;
  return popped;
}

// The back button menu pops through here.
- (nullable NSArray<UIViewController *> *)popToViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  if (_isHandlingNativePop) {
    return [super popToViewController:viewController animated:animated];
  }
  _isHandlingNativePop = YES;
  NSUInteger index = [_stackModel indexOfObject:static_cast<RNSStackScreenController *>(viewController)];
  if (index != NSNotFound && index + 1 < _stackModel.count) {
    [self commitNativePopTo:[_stackModel subarrayWithRange:NSMakeRange(0, index + 1)]];
  }
  NSArray<UIViewController *> *popped = [super popToViewController:viewController animated:animated];
  _isHandlingNativePop = NO;
  return popped;
}

- (nullable NSArray<UIViewController *> *)popToRootViewControllerAnimated:(BOOL)animated
{
  if (_isHandlingNativePop) {
    return [super popToRootViewControllerAnimated:animated];
  }
  _isHandlingNativePop = YES;
  // Nothing in UIKit pops a nested navigation controller to its root on its own; whoever calls this directly is
  // treated as the user, like the back button menu.
  if (_stackModel.count > 1) {
    [self commitNativePopTo:@[ _stackModel.firstObject ]];
  }
  NSArray<UIViewController *> *popped = [super popToRootViewControllerAnimated:animated];
  _isHandlingNativePop = NO;
  return popped;
}

- (nullable UIViewController *)handleNativePopViewControllerAnimated:(BOOL)animated
{
  if (_stackModel.count < 2) {
    // UIKit refuses to pop the root.
    return [super popViewControllerAnimated:animated];
  }

  RNSStackScreenController *top = _stackModel.lastObject;
  NSArray<RNSStackScreenController *> *target = [_stackModel subarrayWithRange:NSMakeRange(0, _stackModel.count - 1)];

  if ([self isSystemPopGestureBeginning]) {
    // The system pop recognizers call this when they begin (undocumented). The swipe can still be cancelled, so the
    // screen leaves the stack only when the swipe commits, through the coordinator `super` creates.
    _navigationControllerDelegate.currentTransition = [[RNSStackTransition alloc] initFromStack:_stackModel
                                                                                        toStack:target
                                                                                    interactive:YES];
    UIViewController *popped = [super popViewControllerAnimated:animated];
    if (popped == nil) {
      _navigationControllerDelegate.currentTransition = nil;
      return nil;
    }
    [self commitWhenSwipeCommits:top];
    return popped;
  }

  [self commitNativePopTo:target];
  return [super popViewControllerAnimated:animated];
}

/**
 * A non-interactive native pop is committed right away, before the UIKit call, so the state change is reported before
 * the lifecycle events of the transition. A multi-pop is one transition.
 */
- (void)commitNativePopTo:(nonnull NSArray<RNSStackScreenController *> *)target
{
  _navigationControllerDelegate.currentTransition = [[RNSStackTransition alloc] initFromStack:_stackModel
                                                                                      toStack:target
                                                                                  interactive:NO];
  [self commitStack:target withOrigin:RNSStackActionOriginUser];
}

- (void)commitWhenSwipeCommits:(nonnull RNSStackScreenController *)swipedScreenController
{
  id<UIViewControllerTransitionCoordinator> coordinator = self.transitionCoordinator;
  if (coordinator == nil || !coordinator.isInteractive) {
    // UIKit did not start an interactive transition after all. Nothing can cancel the pop anymore.
    [self commitRemovalOfSwipedScreen:swipedScreenController];
    return;
  }

  __weak auto weakSelf = self;
  [coordinator notifyWhenInteractionChangesUsingBlock:^(id<UIViewControllerTransitionCoordinatorContext> context) {
    auto strongSelf = weakSelf;
    if (strongSelf == nil) {
      return;
    }
    if (context.isCancelled) {
      // No transition: the swiped screen stays on top.
      strongSelf->_navigationControllerDelegate.currentTransition = nil;
      return;
    }
    [strongSelf commitRemovalOfSwipedScreen:swipedScreenController];
  }];
}

- (void)commitRemovalOfSwipedScreen:(nonnull RNSStackScreenController *)swipedScreenController
{
  if (![_stackModel containsObject:swipedScreenController]) {
    return;
  }
  NSMutableArray<RNSStackScreenController *> *target = [_stackModel mutableCopy];
  [target removeObject:swipedScreenController];
  [self commitStack:target withOrigin:RNSStackActionOriginUser];
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

#pragma mark - Debug

- (void)dumpStackModel
{
#ifdef RNS_DEBUG_LOGGING
  RNSLogD(@"[RNScreens] StackContainer [%ld] MODEL BEGIN", self.view.tag);
  RNSLogD(@"[RNScreens] provenance: %d", _navigationState != nil ? _navigationState.provenance : -1);
  for (RNSStackScreenController *screenController in _stackModel) {
    RNSLogD(@"[RNScreens] %@", screenController.configProvider.screenKey);
  }
#endif // RNS_DEBUG_LOGGING
}

@end
