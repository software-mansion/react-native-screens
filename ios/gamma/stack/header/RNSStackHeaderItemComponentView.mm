#import "RNSStackHeaderItemComponentView.h"
#import "RNSConversions-Stack.h"
#import "RNSDefines.h"
#import "RNSStackHeaderItemShadowStateProxy.h"
#import "RNSStackHeaderItemWrapperView.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSStackHeaderItemComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSStackHeaderItemComponentView () <RNSViewFrameChangeDelegate>
@end

@implementation RNSStackHeaderItemComponentView {
  RNSHeaderItemPlacement _placement;
  BOOL _didSetHeaderItemPlacement;
  NSString *_Nullable _label;

  std::shared_ptr<const react::RNSStackHeaderItemShadowNode::ConcreteState> _state;
  RNSStackHeaderItemShadowStateProxy *_Nonnull _shadowStateProxy;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSStackHeaderItemIOSProps>();
    _props = defaultProps;
    [self resetProps];
    _shadowStateProxy = [[RNSStackHeaderItemShadowStateProxy alloc] initWithHeaderItemView:self];

    // For custom items (header subviews), we rely on `intrinsicContentSize`
    // which passes correct view size from layoutMetrics to iOS
    // `intrinsicContentSize` is queried only when opted out of default constraints
    self.translatesAutoresizingMaskIntoConstraints = NO;
  }
  return self;
}

- (void)resetProps
{
  _label = nil;
  _placement = RNSHeaderItemPlacementTrailing;
  _didSetHeaderItemPlacement = NO;
}

- (RNSHeaderItemPlacement)placement
{
  return _placement;
}

- (BOOL)hasCustomView
{
  return self.subviews.count > 0;
}

#pragma mark - Bar Button Item

- (nonnull UIView *)makeWrappedViewWithFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
{
  // The wrapper view is delegating the state update outside the view
  // and we expect that delegate to call viewFrameDidChange from outside.
  // This is needed for iOS 18 where there is no other way to sync all child elements
  // when one updates its side in a way that impacts the layout of others
  // (on iOS 26, this would work with just attaching self here).
  RNSStackHeaderItemWrapperView *wrapperView = [[RNSStackHeaderItemWrapperView alloc] initWithDelegate:delegate];
  wrapperView.translatesAutoresizingMaskIntoConstraints = NO;
  [wrapperView addSubview:self];

  [NSLayoutConstraint activateConstraints:@[
    [self.leadingAnchor constraintEqualToAnchor:wrapperView.leadingAnchor],
    [self.trailingAnchor constraintEqualToAnchor:wrapperView.trailingAnchor],
    [self.topAnchor constraintEqualToAnchor:wrapperView.topAnchor],
    [self.bottomAnchor constraintEqualToAnchor:wrapperView.bottomAnchor],
  ]];

  return wrapperView;
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
- (nonnull UIView *)makeWrappedInlineItemViewForIOS26WithFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
{
  // (taken from #3868)
  // Starting from iOS 26, UIBarButtonItem's customView is stretched to have at least 36 width.
  // To mitigate this, we add a wrapper view that will center the item inside of itself.
  RNSStackHeaderItemWrapperView *wrapperView = [[RNSStackHeaderItemWrapperView alloc] initWithDelegate:delegate];
  wrapperView.translatesAutoresizingMaskIntoConstraints = NO;
  // self has already opted out of default constraints with `translateAutoresizingMaskIntoConstraints = NO`
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

  // 2. Set content hugging priority for header subview
  [self setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];
  [self setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisVertical];

  // 3. Set compression resistance to prevent UIKit from shrinking the subview below its intrinsic size.
  [self setContentCompressionResistancePriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisVertical];
  [self setContentCompressionResistancePriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];

  return wrapperView;
}
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

- (nonnull UIBarButtonItem *)makeBarButtonItemWithFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
{
  // Similarly to makeWrappedViewWithDelegate, we're attaching outside delegate here.
  // See the reasoning in the aforementioned function.
  if (self.hasCustomView) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    if (@available(iOS 26.0, *)) {
      return [[UIBarButtonItem alloc]
          initWithCustomView:[self makeWrappedInlineItemViewForIOS26WithFrameChangeDelegate:delegate]];
    }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    return [[UIBarButtonItem alloc] initWithCustomView:[self makeWrappedViewWithFrameChangeDelegate:delegate]];
  }

  return [[UIBarButtonItem alloc] initWithTitle:_label style:UIBarButtonItemStylePlain target:nil action:nil];
}

#pragma mark - RNSViewFrameChangeDelegate

- (void)viewFrameDidChange:(nonnull UINavigationBar *)navigationBar
{
  if (_state == nullptr || self.superview == nil) {
    return;
  }

  CGRect frameInNavBar = [self convertRect:self.bounds toView:navigationBar];
  [_shadowStateProxy updateShadowStateWithFrame:frameInNavBar];
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];

  // An existing item may have transitioned from label-only to custom view,
  // and needs to be rebuilt.
  [_invalidationDelegate headerItemDidInvalidate];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];

  // An existing item may have transitioned from custom view to label-only,
  // and needs to be rebuilt.
  [_invalidationDelegate headerItemDidInvalidate];
}

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSStackHeaderItemShadowNode::ConcreteState>(state);
}

- (react::RNSStackHeaderItemShadowNode::ConcreteState::Shared)state
{
  return _state;
}

// (adapted from #3489)
// UIKit controls our position in the navigation bar for all placements.
// Do NOT call super — it would set the full frame (including the shadow node's
// origin correction) and fight with UIKit's positioning.
RNS_IGNORE_SUPER_CALL_BEGIN
- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  CGRect frame = RCTCGRectFromRect(layoutMetrics.frame);
  if (!std::isfinite(frame.size.width) || !std::isfinite(frame.size.height)) {
    return;
  }

  BOOL sizeHasChanged = _layoutMetrics.frame.size != layoutMetrics.frame.size;
  if (sizeHasChanged) {
    // Store layout metrics for `intrinsicContentSize`
    _layoutMetrics = layoutMetrics;
    [self invalidateIntrinsicContentSize];
    // Update view bounds. Irrespective of intrinsic content size, this seems to be required
    // for largeTitle to be laid out correctly within its host _UINavigationBarLargeTitleView
    // and for UINavigationBar height to acknowledge the subview
    self.bounds = CGRect(CGPointZero, frame.size);
  }
}
RNS_IGNORE_SUPER_CALL_END

- (CGSize)intrinsicContentSize
{
  // UIKit queries this value for views that opted out of `translateAutoresizingMaskIntoContraints` - all custom header
  // items. Native views use this property to communicate their size when UIKit is not able to guess correctly. We
  // leverage this to return the size from the most recent `layoutMetrics`.
  return RCTCGSizeFromSize(_layoutMetrics.frame.size);
}

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &newItemProps = *std::static_pointer_cast<const react::RNSStackHeaderItemIOSProps>(props);
  const auto &oldItemProps = *std::static_pointer_cast<const react::RNSStackHeaderItemIOSProps>(_props);

  BOOL needsUpdate = NO;

  if (oldItemProps.placement != newItemProps.placement) {
    if (_didSetHeaderItemPlacement) {
      RCTLogWarn(@"[RNScreens] Changing header item placement at runtime is not supported");
    } else {
      _placement = rnscreens::conversion::convert<RNSHeaderItemPlacement>(newItemProps.placement);
    }
  }
  _didSetHeaderItemPlacement = YES;

  if (oldItemProps.label != newItemProps.label) {
    _label = RCTNSStringFromStringNilIfEmpty(newItemProps.label);
    needsUpdate = YES;
  }

  [super updateProps:props oldProps:oldProps];

  if (needsUpdate) {
    [_invalidationDelegate headerItemDidInvalidate];
  }
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSStackHeaderItemComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
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

Class<RCTComponentViewProtocol> RNSStackHeaderItemComponentViewCls(void)
{
  return RNSStackHeaderItemComponentView.class;
}
