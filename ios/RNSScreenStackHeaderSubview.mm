#import "RNSScreenStackHeaderSubview.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSScreenStackHeaderConfig.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <cxxreact/ReactNativeVersion.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>

#import <rnscreens/RNSScreenStackHeaderSubviewComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSScreenStackHeaderSubview {
#if RCT_NEW_ARCH_ENABLED
  react::RNSScreenStackHeaderSubviewShadowNode::ConcreteState::Shared _state;
  CGRect _lastScheduledFrame;
#endif // RCT_NEW_ARCH_ENABLED
#if !RCT_NEW_ARCH_ENABLED && RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  CGSize _lastReactFrameSize;
#endif // !RCT_NEW_ARCH_ENABLED && RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  // TODO: Refactor this, so that we don't keep reference here at all.
  // Currently this likely creates retain cycle between subview & the bar button item.
  UIBarButtonItem *_barButtonItem;
  BOOL _hidesSharedBackground;
}

#pragma mark - Common

- (nullable RNSScreenStackHeaderConfig *)getHeaderConfig
{
  RNSScreenStackHeaderConfig *headerConfig = (RNSScreenStackHeaderConfig *_Nullable)self.reactSuperview;
#ifndef NDEBUG
  if (headerConfig != nil && ![headerConfig isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
    RCTLogError(@"[RNScreens] Invalid view type, expecting RNSScreenStackHeaderConfig, got: %@", headerConfig);
    return nil;
  }
#endif
  return headerConfig;
}

- (nullable UINavigationBar *)findNavigationBar
{
  return [[[[[self getHeaderConfig] screenView] reactViewController] navigationController] navigationBar];
}

// We're forcing the navigation controller's view to re-layout
// see: https://github.com/software-mansion/react-native-screens/pull/2385
- (void)layoutNavigationBar
{
  // If we're not attached yet, we should not layout the navigation bar,
  // because the layout flow won't reach us & we will clear "isLayoutDirty" flags
  // on view above us, causing subsequent layout request to not reach us.
  if (self.window == nil) {
    return;
  }

  UIView *toLayoutView = [self findNavigationBar];

  // TODO: It is possible, that this needs to be called only on old architecture.
  // Make sure that Test432 keeps working.
  [toLayoutView setNeedsLayout];

  // TODO: Determine why this must be called & deferring layout to next "update cycle"
  // is not sufficient. See Test2552 and Test432. (Talking Paper here).
  [toLayoutView layoutIfNeeded];
}

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - Fabric specific

- (void)updateShadowStateInContextOfAncestorView:(nullable UIView *)ancestorView withFrame:(CGRect)frame
{
  if (ancestorView == nil) {
    // We can not compute valid value
    return;
  }

  CGRect convertedFrame = [self convertRect:frame toView:ancestorView];
  [self updateShadowStateWithFrame:convertedFrame];
}

- (void)updateShadowStateInContextOfAncestorView:(nullable UIView *)ancestorView
{
  [self updateShadowStateInContextOfAncestorView:ancestorView withFrame:self.bounds];
}

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (_state == nullptr) {
    return;
  }

  if (!CGRectEqualToRect(frame, _lastScheduledFrame)) {
    auto newState =
        react::RNSScreenStackHeaderSubviewState(RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin));
    _state->updateState(
        std::move(newState)
#if REACT_NATIVE_VERSION_MINOR >= 82
            ,
        _synchronousShadowStateUpdatesEnabled ? facebook::react::EventQueue::UpdateMode::unstable_Immediate
                                              : facebook::react::EventQueue::UpdateMode::Asynchronous
#endif
    );

    _lastScheduledFrame = frame;
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  [self updateShadowStateInContextOfAncestorView:[self findNavigationBar]];
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSScreenStackHeaderSubviewProps>();
    _props = defaultProps;
    _lastScheduledFrame = CGRectZero;
  }

  return self;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(react::Props::Shared const &)props oldProps:(react::Props::Shared const &)oldProps
{
  const auto &newHeaderSubviewProps = *std::static_pointer_cast<const react::RNSScreenStackHeaderSubviewProps>(props);

  [self setType:[RNSConvert RNSScreenStackHeaderSubviewTypeFromCppEquivalent:newHeaderSubviewProps.type]];
  [self setHidesSharedBackground:newHeaderSubviewProps.hidesSharedBackground];
  [self setSynchronousShadowStateUpdatesEnabled:newHeaderSubviewProps.synchronousShadowStateUpdatesEnabled];
  [super updateProps:props oldProps:oldProps];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenStackHeaderSubviewComponentDescriptor>();
}

// System layouts the subviews.
RNS_IGNORE_SUPER_CALL_BEGIN
- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  CGRect frame = RCTCGRectFromRect(layoutMetrics.frame);
  // CALayer will crash if we pass NaN or Inf values.
  // It's unclear how to detect this case on cross-platform manner holistically, so we have to do it on the mounting
  // layer as well. NaN/Inf is a kinda valid result of some math operations. Even if we can (and should) detect (and
  // report early) incorrect (NaN and Inf) values which come from JavaScript side, we sometimes cannot backtrace the
  // sources of a calculation that produced an incorrect/useless result.
  if (!std::isfinite(frame.size.width) || !std::isfinite(frame.size.height)) {
    RCTLogWarn(
        @"-[UIView(ComponentViewProtocol) updateLayoutMetrics:oldLayoutMetrics:]: Received invalid layout metrics (%@) for a view (%@).",
        NSStringFromCGRect(frame),
        self);
  } else {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    if (self.needsAutoLayout) {
      BOOL sizeHasChanged = _layoutMetrics.frame.size != layoutMetrics.frame.size;
      _layoutMetrics = layoutMetrics;
      if (sizeHasChanged) {
        [self invalidateIntrinsicContentSize];
      }
    } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    {
      self.bounds = CGRect{CGPointZero, frame.size};
    }
    [self layoutNavigationBar];
  }
}
RNS_IGNORE_SUPER_CALL_END

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)updateState:(const facebook::react::State::Shared &)state
           oldState:(const facebook::react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSScreenStackHeaderSubviewShadowNode::ConcreteState>(state);
}
#else // RCT_NEW_ARCH_ENABLED
#pragma mark - Paper specific

- (void)reactSetFrame:(CGRect)frame
{
  // Block any attempt to set coordinates on RNSScreenStackHeaderSubview. This
  // makes UINavigationBar the only one to control the position of header content.
  if (!CGSizeEqualToSize(frame.size, self.frame.size)) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    if (self.needsAutoLayout) {
      _lastReactFrameSize = frame.size;
      [self invalidateIntrinsicContentSize];
    } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    {
      [super reactSetFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
    }
    [self layoutNavigationBar];
  }
}

#endif // RCT_NEW_ARCH_ENABLED

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

// Starting from iOS 26, to center left and right subviews inside liquid glass backdrop,
// we need to use auto layout. To make Yoga's layout work with auto layout, we pass information
// from Yoga via `intrinsicContentSize`.
- (BOOL)needsAutoLayout
{
  BOOL needsAutoLayout = NO;
  if (@available(iOS 26.0, *)) {
    needsAutoLayout = _type == RNSScreenStackHeaderSubviewTypeLeft || _type == RNSScreenStackHeaderSubviewTypeRight;
  }
  return needsAutoLayout;
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#pragma mark - UIBarButtonItem specific

- (UIBarButtonItem *)getUIBarButtonItem
{
  RCTAssert(
      _type == RNSScreenStackHeaderSubviewTypeLeft || _type == RNSScreenStackHeaderSubviewTypeRight,
      @"[RNScreens] Unexpected subview type.");

  if (_barButtonItem == nil) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    if (@available(iOS 26.0, *)) {
      // Starting from iOS 26, UIBarButtonItem's customView is streched to have at least 36 width.
      // Stretching RNSScreenStackHeaderSubview means that its subviews are aligned to left instead
      // of the center. To mitigate this, we add a wrapper view that will center
      // RNSScreenStackHeaderSubview inside of itself.
      UIView *wrapperView = [UIView new];
      wrapperView.translatesAutoresizingMaskIntoConstraints = NO;

      self.translatesAutoresizingMaskIntoConstraints = NO;
      [wrapperView addSubview:self];

      [self.centerXAnchor constraintEqualToAnchor:wrapperView.centerXAnchor].active = YES;
      [self.centerYAnchor constraintEqualToAnchor:wrapperView.centerYAnchor].active = YES;

      // To prevent UIKit from stretching subviews to all available width, we need to:
      // 1. Set width of wrapperView to match RNSScreenStackHeaderSubview BUT when
      //    RNSScreenStackHeaderSubview's width is smaller that minimal required 36 width, it breaks
      //    UIKit's constraint. That's why we need to lower the priority of the constraint.
      NSLayoutConstraint *widthEqual = [wrapperView.widthAnchor constraintEqualToAnchor:self.widthAnchor];
      widthEqual.priority = UILayoutPriorityDefaultHigh;
      widthEqual.active = YES;

      NSLayoutConstraint *heightEqual = [wrapperView.heightAnchor constraintEqualToAnchor:self.heightAnchor];
      heightEqual.priority = UILayoutPriorityDefaultHigh;
      heightEqual.active = YES;

      // 2. Set content hugging priority for RNSScreenStackHeaderSubview.
      [self setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];
      [self setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisVertical];
      
      // 3. Set compression resistance to prevent UIKit from shrinking the subview below its intrinsic size.
      [self setContentCompressionResistancePriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisVertical];
      [self setContentCompressionResistancePriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];

      _barButtonItem = [[UIBarButtonItem alloc] initWithCustomView:wrapperView];
    } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    {
      _barButtonItem = [[UIBarButtonItem alloc] initWithCustomView:self];
    }
    [self configureBarButtonItem];
  }

  return _barButtonItem;
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
- (CGSize)intrinsicContentSize
{
#if RCT_NEW_ARCH_ENABLED
  return RCTCGSizeFromSize(_layoutMetrics.frame.size);
#else // RCT_NEW_ARCH_ENABLED
  return _lastReactFrameSize;
#endif // RCT_NEW_ARCH_ENABLED
}
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

- (void)configureBarButtonItem
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (_barButtonItem != nil) {
      [_barButtonItem setHidesSharedBackground:_hidesSharedBackground];
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

- (void)setHidesSharedBackground:(BOOL)hidesSharedBackground
{
  _hidesSharedBackground = hidesSharedBackground;
  [self configureBarButtonItem];
}

@end

@implementation RNSScreenStackHeaderSubviewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(type, RNSScreenStackHeaderSubviewType)
RCT_EXPORT_VIEW_PROPERTY(hidesSharedBackground, BOOL)

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
  return [RNSScreenStackHeaderSubview new];
}
#endif

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSScreenStackHeaderSubviewCls(void)
{
  return RNSScreenStackHeaderSubview.class;
}
#endif

@implementation RCTConvert (RNSScreenStackHeaderSubview)

RCT_ENUM_CONVERTER(
    RNSScreenStackHeaderSubviewType,
    (@{
      @"back" : @(RNSScreenStackHeaderSubviewTypeBackButton),
      @"left" : @(RNSScreenStackHeaderSubviewTypeLeft),
      @"right" : @(RNSScreenStackHeaderSubviewTypeRight),
      @"title" : @(RNSScreenStackHeaderSubviewTypeTitle),
      @"center" : @(RNSScreenStackHeaderSubviewTypeCenter),
      @"searchBar" : @(RNSScreenStackHeaderSubviewTypeSearchBar),
    }),
    RNSScreenStackHeaderSubviewTypeTitle,
    integerValue)

@end
