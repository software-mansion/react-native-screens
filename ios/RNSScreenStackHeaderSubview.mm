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
  CGRect _lastScheduledFrame;
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

  UIView *toLayoutView = [self findNavigationBar];

  // TODO: It is possible, that this needs to be called only on old architecture.
  // Make sure that Test432 keeps working.
  [toLayoutView setNeedsLayout];
  //  [self setNeedsLayout];

  // TODO: Determine why this must be called & deferring layout to next "update cycle"
  // is not sufficient. See Test2552 and Test432. (Talking Paper here).
  [toLayoutView layoutIfNeeded];
}

#pragma mark - RNSHeaderSubviewContentWrapperDelegate

- (void)headerSubviewContentWrapper:(RNSHeaderSubviewContentWrapper *)contentWrapper
                 receivedReactFrame:(CGRect)reactFrame
                          didChange:(BOOL)frameChanged
{
  if (!frameChanged) {
    return;
  }

  // This is a signal for us, that the size of our content has changed.
  // We need to react to that
  reactFrame.origin = CGPointMake(0.f, 0.f);
  [self setBounds:reactFrame];
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
  }

  return self;
}

//- (void)handleContentBoundsChange
//{
//  [self setBounds:<#(CGRect)#>]
//  [self updateShadowStateInContextOfAncestorView:[self findNavigationBar]];
//}

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

RNS_IGNORE_SUPER_CALL_BEGIN

// System layouts the subviews.
- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  CGRect frame = RCTCGRectFromRect(layoutMetrics.frame);
  NSLog(@"Subview [%ld] updateLayoutMetrics %@", self.tag, NSStringFromCGRect(CGRect{CGPointZero, frame.size}));
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
    const CGRect newBounds = CGRect{CGPointZero, frame.size};

    // This prevents unnecessary layout scheduling
    if (!CGRectEqualToRect(self.bounds, newBounds)) {
      self.bounds = newBounds;
      [self layoutNavigationBar];
    }
  }
}

- (void)layoutSubviews
{
  NSLog(@"Subview [%ld] layoutSubviews", self.tag);
  // TODO: DO I NEED THIS!?
  [super layoutSubviews];
  [self updateShadowStateInContextOfAncestorView:[self findNavigationBar]];
}

RNS_IGNORE_SUPER_CALL_BEGIN

- (void)setFrame:(CGRect)frame
{
  // This is mostly called by UIKit
  NSLog(@"Subview [%ld] setFrame %@", self.tag, NSStringFromCGRect(frame));
  //  if (CGRectEqualToRect(frame, self.frame)) {
  //  }
  [super setFrame:frame];
}

- (void)setBounds:(CGRect)bounds
{
  // This is most likely called by `updateLayoutMetrics:oldLayoutMetrics:`
  NSLog(@"Subview [%ld] setBounds %@", self.tag, NSStringFromCGRect(bounds));
  [super setBounds:bounds];
}

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

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  for (const auto &mutation : transaction.getMutations()) {
    if (MUTATION_PARENT_TAG(mutation) == self.tag && mutation.type == react::ShadowViewMutation::Type::Update &&
        mutation.newChildShadowView.layoutMetrics != mutation.oldChildShadowView.layoutMetrics) {
      // Our direct child will receive layout update.
      NSLog(@"Subview [%ld] pre-updating layout metrics", self.tag);
      CGRect newChildFrame = RCTCGRectFromRect(mutation.newChildShadowView.layoutMetrics.frame);
      newChildFrame.origin = CGPointZero;
      self.bounds = newChildFrame;
    }
  }
}

- (void)updateShadowStateInContextOfAncestorView:(nullable UIView *)ancestorView
{
  if (ancestorView == nil) {
    // We can not compute valid value
    return;
  }

  CGRect frame = [self convertRect:self.frame toView:ancestorView];
  [self updateShadowStateWithFrame:frame];
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
