#import "RNSBottomTabsHostComponentView.h"

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTImageLoader.h>
#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSBottomTabsComponentDescriptor.h>
#import "RNSBottomTabsHostComponentView+RNSImageLoader.h"
#import "RNSInvalidatedComponentsRegistry.h"
#import "RNSViewControllerInvalidator.h"
#endif // RCT_NEW_ARCH_ENABLED

#import "RNSBottomAccessoryHelper.h"
#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomTabsScreenComponentView.h"
#import "RNSConversions.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSTabBarController.h"
#import "RNSTabBarControllerDelegate.h"

namespace react = facebook::react;

#pragma mark - Modified React Subviews extension

@interface RNSBottomTabsHostComponentView ()

@property (nonatomic, readonly) BOOL hasModifiedReactSubviewsInCurrentTransaction;

@end

#pragma mark - View implementation

@interface RNSBottomTabsHostComponentView ()
#if RCT_NEW_ARCH_ENABLED
    <RCTMountingTransactionObserving>
#endif // RCT_NEW_ARCH_ENABLED
@end

@implementation RNSBottomTabsHostComponentView {
  RNSTabBarController *_Nonnull _controller;
  RNSTabBarControllerDelegate *_controllerDelegate;

  RNSBottomTabsHostEventEmitter *_Nonnull _reactEventEmitter;

  RCTImageLoader *_Nullable _imageLoader;

#if RCT_NEW_ARCH_ENABLED
  RNSInvalidatedComponentsRegistry *_Nonnull _invalidatedComponentsRegistry;
#endif // RCT_NEW_ARCH_ENABLED

  // RCTViewComponentView does not expose this field, therefore we maintain
  // it on our side.
  NSMutableArray<UIView *> *_reactSubviews;
  BOOL _hasModifiedTabsScreensInCurrentTransaction;
  BOOL _hasModifiedBottomAccessoryInCurrentTransation;
  BOOL _needsTabBarAppearanceUpdate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

#if !RCT_NEW_ARCH_ENABLED
- (instancetype)initWithFrame:(CGRect)frame reactImageLoader:(RCTImageLoader *)imageLoader
{
  if (self = [self initWithFrame:frame]) {
    _imageLoader = imageLoader;
  }
  return self;
}
#endif // !RCT_NEW_ARCH_ENABLED

- (nonnull RNSTabBarController *)controller
{
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil");
  return _controller;
}

- (void)initState
{
  [self resetProps];

  _controller = [[RNSTabBarController alloc] initWithTabsHostComponentView:self];
  _controllerDelegate = [RNSTabBarControllerDelegate new];
  _controller.delegate = _controllerDelegate;

  _reactSubviews = [NSMutableArray new];
  _reactEventEmitter = [RNSBottomTabsHostEventEmitter new];

#if RCT_NEW_ARCH_ENABLED
  _invalidatedComponentsRegistry = [RNSInvalidatedComponentsRegistry new];
#endif // RCT_NEW_ARCH_ENABLED

  _hasModifiedTabsScreensInCurrentTransaction = NO;
  _hasModifiedBottomAccessoryInCurrentTransation = NO;
  _needsTabBarAppearanceUpdate = NO;
}

- (void)resetProps
{
#if RCT_NEW_ARCH_ENABLED
  static const auto defaultProps = std::make_shared<const react::RNSBottomTabsProps>();
  _props = defaultProps;
#endif
  _tabBarTintColor = nil;
}

#pragma mark - UIView methods

- (void)willMoveToWindow:(UIWindow *)newWindow
{
#if RCT_NEW_ARCH_ENABLED
  if (newWindow == nil) {
    [_invalidatedComponentsRegistry flushInvalidViews];
  }
#endif // RCT_NEW_ARCH_ENABLED
}

- (void)didMoveToWindow
{
  if ([self window] != nil) {
    [self reactAddControllerToClosestParent:_controller];

#if !RCT_NEW_ARCH_ENABLED
    // This is required on legacy architecture to prevent a bug with doubled size of UIViewControllerWrapperView.
    _controller.view.frame = self.bounds;
#endif // !RCT_NEW_ARCH_ENABLED
  }
}

- (void)reactAddControllerToClosestParent:(UIViewController *)controller
{
  if (!controller.parentViewController) {
    UIView *parentView = (UIView *)self.reactSuperview;
    while (parentView) {
      if (parentView.reactViewController) {
        [parentView.reactViewController addChildViewController:controller];
        [self addSubview:controller.view];

        // Enable auto-layout to ensure valid size of tabBarController.view.
        // In host tree, tabBarController.view is the only child of HostComponentView.
        controller.view.translatesAutoresizingMaskIntoConstraints = NO;
        [NSLayoutConstraint activateConstraints:@[
          [controller.view.topAnchor constraintEqualToAnchor:self.topAnchor],
          [controller.view.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
          [controller.view.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
          [controller.view.trailingAnchor constraintEqualToAnchor:self.trailingAnchor]
        ]];

        [controller didMoveToParentViewController:parentView.reactViewController];
        break;
      }
      parentView = (UIView *)parentView.reactSuperview;
    }
    return;
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
  RNSBottomTabsAccessoryComponentView *bottomAccessory = nil;
  for (UIView *childView in _reactSubviews) {
    if ([childView isKindOfClass:[RNSBottomTabsScreenComponentView class]]) {
      RNSBottomTabsScreenComponentView *childScreen = static_cast<RNSBottomTabsScreenComponentView *>(childView);
      [tabControllers addObject:childScreen.controller];
    } else if ([childView isKindOfClass:[RNSBottomTabsAccessoryComponentView class]]) {
      RCTAssert(bottomAccessory == nil, @"[RNScreens] There can only be one child RNSBottomTabsAccessoryComponentView");
      bottomAccessory = static_cast<RNSBottomTabsAccessoryComponentView *>(childView);
    } else {
      RCTLogError(
          @"[RNScreens] BottomTabs only accepts children of type BottomTabScreen and BottomTabsAccessory. Detected %@ instead.",
          childView);
    }
  }

  if (_hasModifiedTabsScreensInCurrentTransaction) {
    RNSLog(@"updateContainer: tabControllers: %@", tabControllers);
    [_controller childViewControllersHaveChangedTo:tabControllers];
  }

  if (_hasModifiedBottomAccessoryInCurrentTransation) {
    RNSLog(@"updateContainer: bottomAccessory: %@", bottomAccessory);
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
    if (@available(iOS 26.0, *)) {
      if (bottomAccessory != nil) {
        // We wrap RNSBottomTabsAccessoryComponentView in plain UIView to maintain native
        // corner radius. RCTViewComponentView overrides it to 0 by default and we're unable
        // to restore default value in an easy way. By wrapping it in UIView, it is clipped
        // to default corner radius.
        UIView *wrapperView = [UIView new];
        [wrapperView addSubview:bottomAccessory];

        [_controller setBottomAccessory:[[UITabAccessory alloc] initWithContentView:wrapperView] animated:YES];
      } else {
        [_controller setBottomAccessory:nil animated:YES];
      }
    }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  }
}

- (void)markChildUpdated
{
  [self updateContainer];
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RNSViewControllerInvalidating

- (void)invalidateController
{
  _controller = nil;
}

- (BOOL)shouldInvalidateOnMutation:(const facebook::react::ShadowViewMutation &)mutation
{
  return (mutation.oldChildShadowView.tag == self.tag && mutation.type == facebook::react::ShadowViewMutation::Delete);
}
#else

#pragma mark - RCTInvalidating

- (void)invalidate
{
  // We assume that bottom tabs host is removed from view hierarchy **only** when
  // whole component is destroyed & therefore we do the necessary cleanup here.
  // If at some point that statement does not hold anymore, this cleanup
  // should be moved to a different place.
  for (UIView<RCTInvalidating> *subview in _reactSubviews) {
    [subview invalidate];
  }
  _controller = nil;
}

#endif

#pragma mark - React events

- (nonnull RNSBottomTabsHostEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

- (BOOL)emitOnNativeFocusChangeRequestSelectedTabScreen:(nonnull RNSBottomTabsScreenComponentView *)tabScreen
                repeatedSelectionHandledBySpecialEffect:(BOOL)repeatedSelectionHandledBySpecialEffect
{
  return [_reactEventEmitter
      emitOnNativeFocusChange:OnNativeFocusChangePayload{
                                  .tabKey = tabScreen.tabKey,
                                  .repeatedSelectionHandledBySpecialEffect = repeatedSelectionHandledBySpecialEffect}];
}

#pragma mark - RCTComponentViewProtocol
#if RCT_NEW_ARCH_ENABLED

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
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSBottomTabsProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSBottomTabsProps>(props);

  if (newComponentProps.controlNavigationStateInJS != oldComponentProps.controlNavigationStateInJS) {
    _experimental_controlNavigationStateInJS = newComponentProps.controlNavigationStateInJS;
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

  if (newComponentProps.tabBarMinimizeBehavior != oldComponentProps.tabBarMinimizeBehavior) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    if (@available(iOS 26.0, *)) {
      _tabBarMinimizeBehavior = rnscreens::conversion::UITabBarMinimizeBehaviorFromRNSBottomTabsTabBarMinimizeBehavior(
          newComponentProps.tabBarMinimizeBehavior);
      _controller.tabBarMinimizeBehavior = _tabBarMinimizeBehavior;
    } else
#endif // Check for iOS >= 26
      if (newComponentProps.tabBarMinimizeBehavior != react::RNSBottomTabsTabBarMinimizeBehavior::Automatic) {
        RCTLogWarn(@"[RNScreens] tabBarMinimizeBehavior is supported for iOS >= 26");
      }
  }

  if (newComponentProps.tabBarControllerMode != oldComponentProps.tabBarControllerMode) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
    if (@available(iOS 18.0, *)) {
      _tabBarControllerMode = rnscreens::conversion::UITabBarControllerModeFromRNSBottomTabsTabBarControllerMode(
          newComponentProps.tabBarControllerMode);
      _controller.mode = _tabBarControllerMode;
    } else
#endif // Check for iOS >= 18
      if (newComponentProps.tabBarControllerMode != react::RNSBottomTabsTabBarControllerMode::Automatic) {
        RCTLogWarn(@"[RNScreens] tabBarControllerMode is supported for iOS >= 18");
      }
  }

  // Super call updates _props pointer. We should NOT update it before calling super.
  [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(const facebook::react::State::Shared &)state
           oldState:(const facebook::react::State::Shared &)oldState
{
  react::RNSBottomTabsShadowNode::ConcreteState::Shared receivedState =
      std::static_pointer_cast<const react::RNSBottomTabsShadowNode::ConcreteState>(state);

  _imageLoader = [self retrieveImageLoaderFromState:receivedState];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];

  const auto &castedEventEmitter = std::static_pointer_cast<const react::RNSBottomTabsEventEmitter>(eventEmitter);
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
  return react::concreteComponentDescriptorProvider<react::RNSBottomTabsComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  _hasModifiedTabsScreensInCurrentTransaction = NO;
  _hasModifiedBottomAccessoryInCurrentTransation = NO;
  [_controller reactMountingTransactionWillMount];

#if RCT_NEW_ARCH_ENABLED
  for (const auto &mutation : transaction.getMutations()) {
    if ([self shouldInvalidateOnMutation:mutation]) {
      for (UIView<RNSViewControllerInvalidating> *childView in _reactSubviews) {
        [RNSViewControllerInvalidator invalidateViewIfDetached:childView forRegistry:_invalidatedComponentsRegistry];
      }

      [RNSViewControllerInvalidator invalidateViewIfDetached:self forRegistry:_invalidatedComponentsRegistry];
    }
  }
#endif // RCT_NEW_ARCH_ENABLED
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (self.hasModifiedReactSubviewsInCurrentTransaction) {
    [self updateContainer];
  }
  [_controller reactMountingTransactionDidMount];
}

#else
#pragma mark - LEGACY architecture implementation

#pragma mark - LEGACY RCTComponent protocol

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)index
{
  [super insertReactSubview:subview atIndex:index];
  [self validateAndHandleReactSubview:subview atIndex:index shouldMount:YES];
}

- (void)removeReactSubview:(UIView *)subview
{
  [super removeReactSubview:subview];
  // index is not used for unmount
  [self validateAndHandleReactSubview:subview atIndex:-1 shouldMount:NO];
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (void)didUpdateReactSubviews
{
  [self invalidateFlagsOnControllerIfNeeded];
}
RNS_IGNORE_SUPER_CALL_END

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  [super didSetProps:changedProps];
  _needsTabBarAppearanceUpdate = YES;
  [self invalidateFlagsOnControllerIfNeeded];
}

#pragma mark - LEGACY update methods

- (void)invalidateFlagsOnControllerIfNeeded
{
  if (_needsTabBarAppearanceUpdate) {
    _needsTabBarAppearanceUpdate = NO;
    [_controller setNeedsUpdateOfTabBarAppearance:true];
  }

  if (self.hasModifiedReactSubviewsInCurrentTransaction) {
    [self updateContainer];
    _hasModifiedTabsScreensInCurrentTransaction = NO;
    _hasModifiedBottomAccessoryInCurrentTransation = NO;
  }
}

- (void)invalidateTabBarAppearance
{
  _needsTabBarAppearanceUpdate = YES;
  [self invalidateFlagsOnControllerIfNeeded];
}

#pragma mark - LEGACY prop setters

// Paper will call property setters

- (void)setTabBarTintColor:(UIColor *_Nullable)tabBarTintColor
{
  _tabBarTintColor = tabBarTintColor;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarHidden:(BOOL)tabBarHidden
{
  _tabBarHidden = tabBarHidden;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
  if (@available(iOS 18.0, *)) {
    [_controller setTabBarHidden:_tabBarHidden animated:NO];
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
  {
    _controller.tabBar.hidden = _tabBarHidden;
  }
}

// This is a Paper-only setter method that will be called by the mounting code.
// It allows us to store UITabBarMinimizeBehavior in the component while accepting a custom enum as input from JS.
- (void)setTabBarMinimizeBehaviorFromRNSTabBarMinimizeBehavior:(RNSTabBarMinimizeBehavior)tabBarMinimizeBehavior
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    _tabBarMinimizeBehavior =
        rnscreens::conversion::UITabBarMinimizeBehaviorFromRNSTabBarMinimizeBehavior(tabBarMinimizeBehavior);
    _controller.tabBarMinimizeBehavior = _tabBarMinimizeBehavior;
  } else
#endif // Check for iOS >= 26
    if (tabBarMinimizeBehavior != RNSTabBarMinimizeBehaviorAutomatic) {
      RCTLogWarn(@"[RNScreens] tabBarMinimizeBehavior is supported for iOS >= 26");
    }
}

- (void)setTabBarControllerModeFromRNSTabBarControllerMode:(RNSTabBarControllerMode)tabBarControllerMode
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
  if (@available(iOS 18.0, *)) {
    _tabBarControllerMode =
        rnscreens::conversion::UITabBarControllerModeFromRNSTabBarControllerMode(tabBarControllerMode);
    _controller.mode = _tabBarControllerMode;
  } else
#endif // Check for iOS >= 18
    if (tabBarControllerMode != RNSTabBarControllerModeAutomatic) {
      RCTLogWarn(@"[RNScreens] tabBarControllerMode is supported for iOS >= 18");
    }
}

- (void)setOnNativeFocusChange:(RCTDirectEventBlock)onNativeFocusChange
{
  [self.reactEventEmitter setOnNativeFocusChange:onNativeFocusChange];
}

#endif // RCT_NEW_ARCH_ENABLED

#pragma mark - Common

- (void)validateAndHandleReactSubview:(UIView *)subview atIndex:(NSInteger)index shouldMount:(BOOL)mount
{
  BOOL isBottomAccessory = [subview isKindOfClass:[RNSBottomTabsAccessoryComponentView class]];
  BOOL isTabsScreen = [subview isKindOfClass:[RNSBottomTabsScreenComponentView class]];
  RCTAssert(
      isBottomAccessory || isTabsScreen,
      @"%@",
      [NSString
          stringWithFormat:
              @"BottomTabs only accepts children of type BottomTabScreen and BottomTabsAccessory. Attempted to %@ %@",
              mount ? @"mount" : @"unmount",
              subview]);

  if (isTabsScreen) {
    auto *childScreen = static_cast<RNSBottomTabsScreenComponentView *>(subview);
    childScreen.reactSuperview = mount ? self : nil;
    _hasModifiedTabsScreensInCurrentTransaction = YES;
  } else if (isBottomAccessory) {
    auto *bottomAccessory = static_cast<RNSBottomTabsAccessoryComponentView *>(subview);
    bottomAccessory.bottomTabsHostView = mount ? self : nil;
    _hasModifiedBottomAccessoryInCurrentTransation = YES;
  }

  if (mount) {
    [_reactSubviews insertObject:subview atIndex:index];
  } else {
    [_reactSubviews removeObject:subview];
  }
}

#pragma mark - React Image Loader

- (nullable RCTImageLoader *)reactImageLoader
{
  return _imageLoader;
}

@end

#pragma mark - Modified React Subviews implementation

@implementation RNSBottomTabsHostComponentView (ModifiedReactSubviews)

- (BOOL)hasModifiedReactSubviewsInCurrentTransaction
{
  return _hasModifiedTabsScreensInCurrentTransaction || _hasModifiedBottomAccessoryInCurrentTransation;
}

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsCls(void)
{
  return RNSBottomTabsHostComponentView.class;
}
#endif // RCT_NEW_ARCH_ENABLED
