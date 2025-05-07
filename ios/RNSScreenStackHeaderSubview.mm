#import "RNSScreenStackHeaderSubview.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSScreenStackHeaderConfig.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTMountingTransactionObserving.h>

#import <rnscreens/RNSScreenStackHeaderSubviewComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

#ifdef RCT_NEW_ARCH_ENABLED
@interface RNSScreenStackHeaderSubview () <RCTMountingTransactionObserving>

@end
#endif

@implementation RNSScreenStackHeaderSubview {
#ifdef RCT_NEW_ARCH_ENABLED
  react::RNSScreenStackHeaderSubviewShadowNode::ConcreteState::Shared _state;

  /// Last frame sent from this component view to the shadow node. This might have non-zero origin. CGRectZero
  /// initially.
  CGRect _lastScheduledFrame;

  /// Last size reported by the content wrapper. CGSizeZero initially.
  CGSize _reactContentSize;
#endif
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

#if !defined(RCT_NEW_ARCH_ENABLED)
  UIView *toLayoutView = [self findNavigationBar];

  // TODO: It is possible, that this needs to be called only on old architecture.
  // Make sure that Test432 keeps working.
  [toLayoutView setNeedsLayout];

  // TODO: Determine why this must be called & deferring layout to next "update cycle"
  // is not sufficient. See Test2552 and Test432. (Talking Paper here).
  [toLayoutView layoutIfNeeded];
#endif
}

//- (CGSize)intrinsicContentSize
//{
//  // If there is no content wrapper yet, e.g. it is mounted in useEffect or delayed for some other reason, we want
//  // to provide non undefined size to prevent system from zeroing the frame.
//  if (CGSizeEqualToSize(CGSizeZero, _reactContentSize)) {
//    NSLog(@"Subview [%ld] intrinsicContentSize:%@", self.tag, NSStringFromCGSize(self.bounds.size));
//    return self.bounds.size;
//  } else {
//    NSLog(@"Subview [%ld] intrinsicContentSize:%@", self.tag, NSStringFromCGSize(_reactContentSize));
//    return _reactContentSize;
//  }
//}

- (void)layoutSubviews
{
  NSLog(@"Subview [%ld] layoutSubviews", self.tag);
  // TODO: DO I NEED THIS!?
  [super layoutSubviews];
  [self updateShadowStateInContextOfAncestorView:[self findNavigationBar]];
}

- (void)setFrame:(CGRect)frame
{
  // This is mostly called by UIKit
  NSLog(@"Subview [%ld] setFrame:%@ oldFrame:%@", self.tag, NSStringFromCGRect(frame), NSStringFromCGRect(self.frame));
  [super setFrame:frame];
}

- (void)setBounds:(CGRect)bounds
{
  // This is most likely called by `updateLayoutMetrics:oldLayoutMetrics:`
  NSLog(
      @"Subview [%ld] setBounds:%@ oldBounds:%@",
      self.tag,
      NSStringFromCGRect(bounds),
      NSStringFromCGRect(self.bounds));
  [super setBounds:bounds];
}

- (void)setCenter:(CGPoint)center
{
  NSLog(
      @"Subview [%ld] setCenter:%@ oldCenter:%@",
      self.tag,
      NSStringFromCGPoint(center),
      NSStringFromCGPoint(self.center));
  [super setCenter:center];
}

#pragma mark - RNSHeaderSubviewContentWrapperDelegate

- (void)headerSubviewContentWrapper:(RNSHeaderSubviewContentWrapper *)contentWrapper
                  receivedReactSize:(CGSize)reactSize;
{
  // This is a signal for us, that the size of our content has changed.
  // We need to react to that

#ifdef RCT_NEW_ARCH_ENABLED
  if (!CGSizeEqualToSize(_reactContentSize, reactSize)) {
    _reactContentSize = reactSize;
    //    [self invalidateIntrinsicContentSize];
  }
#endif
}

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - Fabric specific

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
    _reactContentSize = CGSizeZero;
    // #ifdef RCT_NEW_ARCH_ENABLED
    //     self.translatesAutoresizingMaskIntoConstraints = YES;
    // #endif
  }

  return self;
}

#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
  [super prepareForRecycle];
}

- (void)updateProps:(react::Props::Shared const &)props oldProps:(react::Props::Shared const &)oldProps
{
  const auto &newHeaderSubviewProps = *std::static_pointer_cast<const react::RNSScreenStackHeaderSubviewProps>(props);

  [self setType:[RNSConvert RNSScreenStackHeaderSubviewTypeFromCppEquivalent:newHeaderSubviewProps.type]];
  [super updateProps:props oldProps:oldProps];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenStackHeaderSubviewComponentDescriptor>();
}

// System positions the subviews, however their size is determined depending on content by Yoga.
// It is enforced in shadow node of this component that the frame we receive here is the same as frame
// of direct child - content wrapper.
//
// Implementation of this method assumes that this view is mounted at origin=(0, 0) of parent system view.
// Currently it is `_UIButtonBarStackView` or `_UIATCMIAdaptorView`, depending on whether auto resizing is enabled or
// not.
RNS_IGNORE_SUPER_CALL_BEGIN
- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  CGRect frame = RCTCGRectFromRect(layoutMetrics.frame);
  NSLog(@"Subview [%ld] updateLayoutMetrics:%@", self.tag, NSStringFromCGRect(frame));

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
    if (!CGSizeEqualToSize(frame.size, self.bounds.size)) {
      NSLog(@"Subview [%ld] invalidateIntrinsicContentSize:%@", self.tag, NSStringFromCGSize(frame.size));
      CGRect newBounds = CGRect{CGPointZero, frame.size};

      // Assuming here we're at origin=(0,0) relative to native parent view!
      self.center = CGPointMake(CGRectGetMidX(newBounds), CGRectGetMidY(newBounds));
      self.bounds = newBounds;

      //      [self invalidateIntrinsicContentSize];
    }
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

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSHeaderSubviewContentWrapper.class],
      @"RNSScreenStackHeaderSubview accepts only instances of @RNSHeaderSubviewContentWrapper as direct children. Got: %@",
      childComponentView.class);

  NSLog(
      @"Subview [%ld] addsReactSubview [%ld] with frame %@",
      self.tag,
      childComponentView.tag,
      NSStringFromCGRect(childComponentView.frame));

  static_cast<RNSHeaderSubviewContentWrapper *>(childComponentView).delegate = self;
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  NSLog(
      @"Subview [%ld] removesReactSubview [%ld] with frame %@",
      self.tag,
      childComponentView.tag,
      NSStringFromCGRect(childComponentView.frame));
  if ([childComponentView isKindOfClass:RNSHeaderSubviewContentWrapper.class]) {
    static_cast<RNSHeaderSubviewContentWrapper *>(childComponentView).delegate = nil;
  }
  [super unmountChildComponentView:childComponentView index:index];
}

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
  [self updateShadowStateInContextOfAncestorView:ancestorView withFrame:self.frame];
}

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (_state == nullptr) {
    return;
  }

  if (!CGRectEqualToRect(frame, _lastScheduledFrame)) {
    auto newState =
        react::RNSScreenStackHeaderSubviewState(RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin));
    NSLog(@"Subview [%ld] send state update %@", self.tag, NSStringFromCGRect(frame));
    _state->updateState(std::move(newState));
    _lastScheduledFrame = frame;
  }
}
#else // RCT_NEW_ARCH_ENABLED
#pragma mark - Paper specific

- (void)reactSetFrame:(CGRect)frame
{
  // Block any attempt to set coordinates on RNSScreenStackHeaderSubview. This
  // makes UINavigationBar the only one to control the position of header content.
  if (!CGSizeEqualToSize(frame.size, self.frame.size)) {
    [super reactSetFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
    [self layoutNavigationBar];
  }
}
#endif // RCT_NEW_ARCH_ENABLED

@end

@implementation RNSScreenStackHeaderSubviewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(type, RNSScreenStackHeaderSubviewType)

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
