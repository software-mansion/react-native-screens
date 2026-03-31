#import "RNSStackHeaderItemComponentView.h"
#import "RNSConversions-Stack.h"
#import "RNSDefines.h"
#import "RNSShadowStateFrameTracker.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSStackHeaderItemComponentDescriptor.h>

namespace react = facebook::react;

@implementation RNSStackHeaderItemComponentView {
  react::RNSStackHeaderItemIOSPlacement _placement;
  NSString *_Nullable _label;

  std::shared_ptr<const react::RNSStackHeaderItemShadowNode::ConcreteState> _state;
  RNSShadowStateFrameTracker *_Nonnull _frameTracker;
  react::LayoutMetrics _layoutMetrics;

  UINavigationBar *_Nullable _navigationBar;
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSStackHeaderItemIOSProps>();
    _props = defaultProps;
    [self resetProps];
    _frameTracker = [RNSShadowStateFrameTracker new];
  }
  return self;
}

- (void)resetProps
{
  _label = nil;
  _placement = react::RNSStackHeaderItemIOSPlacement::Right;
}

- (RNSHeaderItemPlacement)placement
{
  return rnscreens::conversion::convert<RNSHeaderItemPlacement>(_placement);
}

- (BOOL)hasCustomView
{
  return self.subviews.count > 0;
}

#pragma mark - Bar Button Item

- (nonnull UIBarButtonItem *)makeBarButtonItem
{
  if (self.hasCustomView) {
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

      return [[UIBarButtonItem alloc] initWithCustomView:wrapperView];
    }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    return [[UIBarButtonItem alloc] initWithCustomView:self];
  }

  return [[UIBarButtonItem alloc] initWithTitle:_label ?: @"" style:UIBarButtonItemStylePlain target:nil action:nil];
}

#pragma mark - Shadow State

- (void)updateShadowStateToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar
{
  if (_state == nullptr || self.superview == nil) {
    return;
  }

  CGRect frameInNavBar = [self convertRect:self.bounds toView:navigationBar];
  if (![_frameTracker updateFrameIfNeeded:frameInNavBar]) {
    return;
  }

  auto newState =
      react::RNSStackHeaderItemState(RCTSizeFromCGSize(frameInNavBar.size), RCTPointFromCGPoint(frameInNavBar.origin));
  _state->updateState(std::move(newState));
}

- (void)layoutSubviews
{
  [super layoutSubviews];

  UINavigationBar *navBar = [self findNavigationBar];
  if (navBar != nil) {
    [self updateShadowStateToMatchNavigationBar:navBar];
  }
}

- (nullable UINavigationBar *)findNavigationBar
{
  if (_navigationBar) {
    return _navigationBar;
  }

  UIView *current = self.superview;
  while (current != nil) {
    if ([current isKindOfClass:UINavigationBar.class]) {
      _navigationBar = (UINavigationBar *)current;
      return _navigationBar;
    }
    current = current.superview;
  }
  return nil;
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

// UIKit controls our position in the navigation bar for all placements.
// Do NOT call super — it would set the full frame (including the shadow node's
// origin correction) and fight with UIKit's positioning.
// Only left/right bar button items on iOS 26 use the intrinsicContentSize bridge
// (needed for the centering wrapper). Everything else just sets self.bounds.
RNS_IGNORE_SUPER_CALL_BEGIN
- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  CGRect frame = RCTCGRectFromRect(layoutMetrics.frame);
  if (!std::isfinite(frame.size.width) || !std::isfinite(frame.size.height)) {
    return;
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (_placement == react::RNSStackHeaderItemIOSPlacement::Left ||
        _placement == react::RNSStackHeaderItemIOSPlacement::Right) {
      // On iOS 26, left/right bar button items use a centering wrapper with
      // Auto Layout. Bridge Yoga's size via intrinsicContentSize.
      BOOL sizeHasChanged = _layoutMetrics.frame.size != layoutMetrics.frame.size;
      _layoutMetrics = layoutMetrics;
      if (sizeHasChanged) {
        [self invalidateIntrinsicContentSize];
      }
      return;
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

  self.bounds = CGRect{CGPointZero, frame.size};
}
RNS_IGNORE_SUPER_CALL_END

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
- (CGSize)intrinsicContentSize
{
  return RCTCGSizeFromSize(_layoutMetrics.frame.size);
}
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &newItemProps = *std::static_pointer_cast<const react::RNSStackHeaderItemIOSProps>(props);
  const auto &oldItemProps = *std::static_pointer_cast<const react::RNSStackHeaderItemIOSProps>(_props);

  bool needsUpdate = NO;

  if (oldItemProps.placement != newItemProps.placement) {
    // TODO: We shouldn't allow for changing placement after it is set
    _placement = newItemProps.placement;
  }

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

@end

Class<RCTComponentViewProtocol> RNSStackHeaderItemComponentViewCls(void)
{
  return RNSStackHeaderItemComponentView.class;
}
