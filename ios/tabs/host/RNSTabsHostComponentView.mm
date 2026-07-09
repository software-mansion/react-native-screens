#import "RNSTabsHostComponentView.h"

#import <React/RCTConversions.h>
#import <React/RCTImageLoader.h>
#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSTabsHostComponentDescriptor.h>
#import "RNSTabsHostComponentView+RNSImageLoader.h"

#import "RNSContainerHelpers.h"
#import "RNSConversions.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSTabBarController.h"
#import "RNSTabsBottomAccessoryComponentView.h"
#import "RNSTabsBottomAccessoryHelper.h"
#import "RNSTabsScreenComponentView.h"

namespace react = facebook::react;

#pragma mark - Modified React Subviews extension

@interface RNSTabsHostComponentView ()

@property (nonatomic, readonly) BOOL hasModifiedReactSubviewsInCurrentTransaction;

@end

#pragma mark - View implementation

@interface RNSTabsHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSTabsHostComponentView {
  RNSTabBarController *_Nonnull _controller;

  RNSTabsHostEventEmitter *_Nonnull _reactEventEmitter;

  RCTImageLoader *_Nullable _imageLoader;

  // RCTViewComponentView does not expose this field, therefore we maintain
  // it on our side.
  NSMutableArray<UIView *> *_reactSubviews;
  BOOL _hasModifiedTabsScreensInCurrentTransaction;
  BOOL _hasModifiedBottomAccessoryInCurrentTransation;
  BOOL _needsTabBarAppearanceUpdate;

  RNSTabsNavigationStateUpdateRequest *_Nullable _navStateRequest;

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  UIView *_Nullable _bottomAccessoryWrapperView;
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (nonnull RNSTabBarController *)controller
{
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil");
  return _controller;
}

- (void)initState
{
  [self resetProps];

  _controller = [[RNSTabBarController alloc] initWithTabsHostComponentView:self];
  [[maybe_unused]] BOOL didRegisterObserver = [_controller addNavigationStateObserver:self];
  RCTAssert(didRegisterObserver,
            @"[RNScreens] Failed to register RNSTabsHostComponentView as navigation state observer");

  _reactSubviews = [NSMutableArray new];
  _reactEventEmitter = [RNSTabsHostEventEmitter new];

  _hasModifiedTabsScreensInCurrentTransaction = NO;
  _hasModifiedBottomAccessoryInCurrentTransation = NO;
  _needsTabBarAppearanceUpdate = NO;

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  _bottomAccessoryWrapperView = nil;
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSTabsHostIOSProps>();
  _props = defaultProps;
  _tabBarTintColor = nil;
  _layoutDirection = UITraitEnvironmentLayoutDirectionUnspecified;
  _colorScheme = UIUserInterfaceStyleUnspecified;
  _rejectStaleNavStateUpdates = NO;
  _bottomAccessoryHidden = NO;
#if !TARGET_OS_TV
  _nativeContainerBackgroundColor = [UIColor systemBackgroundColor];
#else // !TARGET_OS_TV
  _nativeContainerBackgroundColor = nil;
#endif // !TARGET_OS_TV
}

- (void)invalidateImpl
{
  // We want to run after container updates are performed (transitions etc.)
  __weak auto weakSelf = self;

  dispatch_async(dispatch_get_main_queue(), ^{
    auto strongSelf = weakSelf;
    if (strongSelf) {
      [strongSelf->_controller tearDown];
      strongSelf->_controller = nil;
    }
  });
}

#pragma mark - UIView methods

- (void)didMoveToWindow
{
  if (self.window != nil && _controller.parentViewController == nil) {
    BOOL mountResult = [RNSContainerHelpers addChildViewController:_controller
                                          toViewControllerManaging:self.reactSuperview
                                                 withContainerView:self];
    if (mountResult) {
      [self setupViewConstraintsForController:_controller];
    }
  }
}

#pragma mark - RNSScreenContainerDelegate

- (void)updateContainer
{
  if (!self.hasModifiedReactSubviewsInCurrentTransaction) {
    return;
  }

  NSMutableArray<RNSTabsScreenViewController *> *tabControllers =
      [[NSMutableArray alloc] initWithCapacity:_reactSubviews.count];
  RNSTabsBottomAccessoryComponentView *bottomAccessory = nil;
  for (UIView *childView in _reactSubviews) {
    if ([childView isKindOfClass:[RNSTabsScreenComponentView class]]) {
      RNSTabsScreenComponentView *childScreen = static_cast<RNSTabsScreenComponentView *>(childView);
      [tabControllers addObject:childScreen.controller];
    } else if ([childView isKindOfClass:[RNSTabsBottomAccessoryComponentView class]]) {
      RCTAssert(bottomAccessory == nil, @"[RNScreens] There can only be one child RNSTabsBottomAccessoryComponentView");
      bottomAccessory = static_cast<RNSTabsBottomAccessoryComponentView *>(childView);
    } else {
      RCTLogError(
          @"[RNScreens] TabsHost only accepts children of type TabsScreen and TabsBottomAccessory. Detected %@ instead.",
          childView);
    }
  }

  if (_hasModifiedTabsScreensInCurrentTransaction) {
    RNSLog(@"updateContainer: tabControllers: %@", tabControllers);
    [_controller childViewControllersHaveChangedTo:tabControllers];
  }

  if (_hasModifiedBottomAccessoryInCurrentTransation) {
    RNSLog(@"updateContainer: bottomAccessory: %@", bottomAccessory);
#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
    if (@available(iOS 26.0, *)) {
      if (bottomAccessory != nil) {
        // We wrap RNSTabsBottomAccessoryComponentView in plain UIView to maintain native
        // corner radius. RCTViewComponentView overrides it to 0 by default and we're unable
        // to restore default value in an easy way. By wrapping it in UIView, it is clipped
        // to default corner radius.
        UIView *wrapperView = [UIView new];
        [wrapperView addSubview:bottomAccessory];
        _bottomAccessoryWrapperView = wrapperView;
      } else {
        _bottomAccessoryWrapperView = nil;
      }

      [self applyBottomAccessoryVisibility];
    }
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  }
}

- (void)markChildUpdated
{
  [self updateContainer];
}

#pragma mark - React events

- (nonnull RNSTabsHostEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [self validateAndHandleReactSubview:childComponentView atIndex:index shouldMount:YES];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [self validateAndHandleReactSubview:childComponentView atIndex:index shouldMount:NO];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSTabsHostIOSProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSTabsHostIOSProps>(props);

  if (newComponentProps.navStateRequest.selectedScreenKey != oldComponentProps.navStateRequest.selectedScreenKey ||
      newComponentProps.navStateRequest.baseProvenance != oldComponentProps.navStateRequest.baseProvenance) {
    NSString *selectedScreenKey = RCTNSStringFromStringNilIfEmpty(newComponentProps.navStateRequest.selectedScreenKey);
    RCTAssert(selectedScreenKey != nil, @"[RNScreens] selectedScreenKey MUST NOT be nil");
    RCTAssert(newComponentProps.navStateRequest.baseProvenance >= 0, @"[RNScreens] baseProvenance MUST BE >= 0");
    _navStateRequest = [RNSTabsNavigationStateUpdateRequest
        requestWithSelectedScreenKey:selectedScreenKey
                      baseProvenance:newComponentProps.navStateRequest.baseProvenance
                        actionOrigin:RNSTabsActionOriginProgrammaticJs];
    [_controller setPendingNavigationStateUpdate:[_navStateRequest cloneRequest]];
  }

  if (newComponentProps.rejectStaleNavStateUpdates != oldComponentProps.rejectStaleNavStateUpdates) {
    _rejectStaleNavStateUpdates = static_cast<BOOL>(newComponentProps.rejectStaleNavStateUpdates);
    [_controller setRejectStaleNavigationStateUpdates:_rejectStaleNavStateUpdates];
  }

  if (newComponentProps.tabBarTintColor != oldComponentProps.tabBarTintColor) {
    _needsTabBarAppearanceUpdate = YES;
    _tabBarTintColor = RCTUIColorFromSharedColor(newComponentProps.tabBarTintColor);
  }

  if (newComponentProps.tabBarHidden != oldComponentProps.tabBarHidden) {
    _tabBarHidden = newComponentProps.tabBarHidden;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
    if (@available(iOS 18.0, *)) {
      [_controller setTabBarHidden:_tabBarHidden animated:NO];
    } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
    {
      _controller.tabBar.hidden = _tabBarHidden;
    }
  }

  if (newComponentProps.bottomAccessoryHidden != oldComponentProps.bottomAccessoryHidden) {
    _bottomAccessoryHidden = newComponentProps.bottomAccessoryHidden;
#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
    if (@available(iOS 26.0, *)) {
      [self applyBottomAccessoryVisibility];
    }
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  }

  if (newComponentProps.nativeContainerBackgroundColor != oldComponentProps.nativeContainerBackgroundColor) {
    _nativeContainerBackgroundColor = RCTUIColorFromSharedColor(newComponentProps.nativeContainerBackgroundColor);
#if !TARGET_OS_TV
    if (_nativeContainerBackgroundColor == nil) {
      _nativeContainerBackgroundColor = [UIColor systemBackgroundColor];
    }
#endif // !TARGET_OS_TV

    _controller.view.backgroundColor = _nativeContainerBackgroundColor;
  }

  if (newComponentProps.tabBarMinimizeBehavior != oldComponentProps.tabBarMinimizeBehavior) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    if (@available(iOS 26.0, *)) {
      _tabBarMinimizeBehavior = rnscreens::conversion::UITabBarMinimizeBehaviorFromRNSTabsHostTabBarMinimizeBehavior(
          newComponentProps.tabBarMinimizeBehavior);
      _controller.tabBarMinimizeBehavior = _tabBarMinimizeBehavior;
    } else
#endif // Check for iOS >= 26
      if (newComponentProps.tabBarMinimizeBehavior != react::RNSTabsHostIOSTabBarMinimizeBehavior::Automatic) {
        RCTLogWarn(@"[RNScreens] tabBarMinimizeBehavior is supported for iOS >= 26");
      }
  }

  if (newComponentProps.tabBarControllerMode != oldComponentProps.tabBarControllerMode) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
    if (@available(iOS 18.0, *)) {
      _tabBarControllerMode = rnscreens::conversion::UITabBarControllerModeFromRNSTabsHostTabBarControllerMode(
          newComponentProps.tabBarControllerMode);
      _controller.mode = _tabBarControllerMode;
    } else
#endif // Check for iOS >= 18
      if (newComponentProps.tabBarControllerMode != react::RNSTabsHostIOSTabBarControllerMode::Automatic) {
        RCTLogWarn(@"[RNScreens] tabBarControllerMode is supported for iOS >= 18");
      }
  }

  if (newComponentProps.layoutDirection != oldComponentProps.layoutDirection) {
    [self setLayoutDirection:rnscreens::conversion::UITraitEnvironmentLayoutDirectionFromTabsHostCppEquivalent(
                                 newComponentProps.layoutDirection)];
  }

  if (newComponentProps.colorScheme != oldComponentProps.colorScheme) {
    _colorScheme = rnscreens::conversion::UIUserInterfaceStyleFromHostProp(newComponentProps.colorScheme);
    _controller.overrideUserInterfaceStyle = _colorScheme;
  }

  // Super call updates _props pointer. We should NOT update it before calling super.
  [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(const facebook::react::State::Shared &)state
           oldState:(const facebook::react::State::Shared &)oldState
{
  react::RNSTabsHostShadowNode::ConcreteState::Shared receivedState =
      std::static_pointer_cast<const react::RNSTabsHostShadowNode::ConcreteState>(state);

  _imageLoader = [self retrieveImageLoaderFromState:receivedState];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];

  const auto &castedEventEmitter = std::static_pointer_cast<const react::RNSTabsHostIOSEventEmitter>(eventEmitter);
  [_reactEventEmitter updateEventEmitter:castedEventEmitter];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  if (_needsTabBarAppearanceUpdate) {
    _needsTabBarAppearanceUpdate = NO;
    [_controller setNeedsUpdateOfTabBarAppearance:true];
  }
  [super finalizeUpdates:updateMask];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSTabsHostComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

#pragma mark - RCTMountingTransactionObserving

- (void)invalidate
{
  [self invalidateImpl];
}

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  _hasModifiedTabsScreensInCurrentTransaction = NO;
  _hasModifiedBottomAccessoryInCurrentTransation = NO;
  [_controller reactMountingTransactionWillMount];
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (self.hasModifiedReactSubviewsInCurrentTransaction) {
    [self updateContainer];
  }
  [_controller reactMountingTransactionDidMount];
}

#pragma mark - Common

- (void)validateAndHandleReactSubview:(UIView *)subview atIndex:(NSInteger)index shouldMount:(BOOL)mount
{
  BOOL isBottomAccessory = [subview isKindOfClass:[RNSTabsBottomAccessoryComponentView class]];
  BOOL isTabsScreen = [subview isKindOfClass:[RNSTabsScreenComponentView class]];
  RCTAssert(
      isBottomAccessory || isTabsScreen,
      @"%@",
      [NSString stringWithFormat:
                    @"TabsHost only accepts children of type TabsScreen and TabsBottomAccessory. Attempted to %@ %@",
                    mount ? @"mount" : @"unmount",
                    subview]);

  if (isTabsScreen) {
    auto *childScreen = static_cast<RNSTabsScreenComponentView *>(subview);
    childScreen.reactSuperview = mount ? self : nil;
    _hasModifiedTabsScreensInCurrentTransaction = YES;
  } else if (isBottomAccessory) {
    auto *bottomAccessory = static_cast<RNSTabsBottomAccessoryComponentView *>(subview);
    bottomAccessory.tabsHostView = mount ? self : nil;
    _hasModifiedBottomAccessoryInCurrentTransation = YES;
  }

  if (mount) {
    [_reactSubviews insertObject:subview atIndex:index];
  } else {
    [_reactSubviews removeObject:subview];
  }
}

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
- (void)applyBottomAccessoryVisibility API_AVAILABLE(ios(26.0))
{
  if (_bottomAccessoryWrapperView != nil && !_bottomAccessoryHidden) {
    [_controller setBottomAccessory:[[UITabAccessory alloc] initWithContentView:_bottomAccessoryWrapperView]
                           animated:YES];
  } else {
    [_controller setBottomAccessory:nil animated:YES];
  }
}
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

- (void)setLayoutDirection:(UITraitEnvironmentLayoutDirection)layoutDirection
{
  _layoutDirection = layoutDirection;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
  if (@available(iOS 17.0, *)) {
    _controller.traitOverrides.layoutDirection = _layoutDirection;
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
  {
    _controller.needsLayoutDirectionUpdateBelowIOS17 = YES;

    // If controller is already attached to parent VC, we should update layout direction
    // immediately as controller updates layoutDirection only on `didMoveToParentViewController`.
    if (_controller.parentViewController != nil) {
      [_controller updateLayoutDirectionBelowIOS17IfNeeded];
    }
  }
}

- (void)setupViewConstraintsForController:(nonnull UIViewController *)controller
{
  // Enable auto-layout to ensure valid size of tabBarController.view.
  // In host tree, tabBarController.view is the only child of HostComponentView.
  controller.view.translatesAutoresizingMaskIntoConstraints = NO;
  [NSLayoutConstraint activateConstraints:@[
    [controller.view.topAnchor constraintEqualToAnchor:self.topAnchor],
    [controller.view.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
    [controller.view.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
    [controller.view.trailingAnchor constraintEqualToAnchor:self.trailingAnchor]
  ]];
}

#pragma mark - React Image Loader

- (nullable RCTImageLoader *)reactImageLoader
{
  return _imageLoader;
}

#pragma mark - RNSTabsNavigationStateObserver

- (void)tabsContainer:(nonnull RNSTabBarController *)tabsContainer
     didUpdateStateTo:(nonnull RNSTabsNavigationState *)navState
          withContext:(nonnull RNSTabsNavigationStateUpdateContext *)context
{
  RCTAssert(navState.selectedScreenKey != nil, @"[RNScreens] screenKey MUST NOT be nil");

  [self.reactEventEmitter emitOnTabSelected:{.selectedScreenKey = navState.selectedScreenKey,
                                             .provenance = navState.provenance,
                                             .isRepeated = context.isRepeated,
                                             .hasTriggeredSpecialEffect = context.hasTriggeredSpecialEffect,
                                             .actionOrigin = context.actionOrigin}];
}

- (void)tabsContainer:(nonnull RNSTabBarController *)tabsContainer
    rejectedStateUpdate:(nonnull RNSTabsNavigationStateUpdateRequest *)rejectedRequest
           currentState:(nonnull RNSTabsNavigationState *)currentNavState
             withReason:(RNSTabsNavigationStateRejectionReason)reason
{
  RCTAssert(currentNavState.selectedScreenKey != nil, @"[RNScreens] Current state screenKey MUST NOT be nil");
  RCTAssert(rejectedRequest.selectedScreenKey != nil,
            @"[RNScreens] Rejected request selectedScreenKey MUST NOT be nil");

  [self.reactEventEmitter emitOnTabSelectionRejected:{.currentNavState = currentNavState,
                                                      .rejectedRequest = rejectedRequest,
                                                      .rejectionReason = reason}];
}

- (void)tabsContainer:(nonnull RNSTabBarController *)tabsContainer
    preventedSelectionOf:(nonnull NSString *)preventedScreenKey
            currentState:(nonnull RNSTabsNavigationState *)currentNavState
{
  RCTAssert(tabsContainer != nil, @"[RNScreens] Expected NON NIL tabsContainer");
  RCTAssert(preventedScreenKey != nil, @"[RNScreens] Expected NON NIL preventedScreenKey");
  RCTAssert(currentNavState != nil && currentNavState.selectedScreenKey != nil,
            @"[RNScreens] Expected NON NIL nav state & selectedScreenKey");

  [self.reactEventEmitter emitOnTabSelectionPrevented:{
                                                          .currentNavState = currentNavState,
                                                          .preventedScreenKey = preventedScreenKey,
  }];
}

- (void)tabsContainer:(nonnull RNSTabBarController *)tabsContainer
    didSelectMoreTabWithCurrentState:(nonnull RNSTabsNavigationState *)currentNavState
{
  RCTAssert(tabsContainer != nil, @"[RNScreens] Expected NON NIL tabsContainer");
  RCTAssert(currentNavState != nil && currentNavState.selectedScreenKey != nil,
            @"[RNScreens] Expected NON NIL nav state & selectedScreenKey");

  [self.reactEventEmitter emitOnMoreTabSelected:{
                                                    .currentNavState = currentNavState,
  }];
}

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

#pragma mark - Modified React Subviews implementation

@implementation RNSTabsHostComponentView (ModifiedReactSubviews)

- (BOOL)hasModifiedReactSubviewsInCurrentTransaction
{
  return _hasModifiedTabsScreensInCurrentTransaction || _hasModifiedBottomAccessoryInCurrentTransation;
}

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSTabsHostCls(void)
{
  return RNSTabsHostComponentView.class;
}
