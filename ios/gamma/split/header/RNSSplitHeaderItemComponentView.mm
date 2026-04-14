#import "RNSSplitHeaderItemComponentView.h"
#import "RNSConversions-SplitHeader.h"
#import "RNSDefines.h"
#import "RNSShadowStateFrameTracker.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSSplitHeaderItemComponentDescriptor.h>

namespace react = facebook::react;

@implementation RNSSplitHeaderItemComponentView {
  react::RNSSplitHeaderItemIOSPlacement _placement;
  NSString *_Nullable _label;

  std::shared_ptr<const react::RNSSplitHeaderItemShadowNode::ConcreteState> _state;
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
    static const auto defaultProps = std::make_shared<const react::RNSSplitHeaderItemIOSProps>();
    _props = defaultProps;
    [self resetProps];
    _frameTracker = [RNSShadowStateFrameTracker new];
  }
  return self;
}

- (void)resetProps
{
  _label = nil;
  _placement = react::RNSSplitHeaderItemIOSPlacement::Right;
}

- (RNSSplitHeaderItemPlacement)placement
{
  return rnscreens::conversion::convert<RNSSplitHeaderItemPlacement>(_placement);
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
      // Starting from iOS 26, UIBarButtonItem's customView is stretched to have at least 36 width.
      // Stretching the subview means its children are aligned to left instead of the center.
      // To mitigate this, we add a wrapper view that will center the subview inside of itself.
      UIView *wrapperView = [UIView new];
      wrapperView.translatesAutoresizingMaskIntoConstraints = NO;

      self.translatesAutoresizingMaskIntoConstraints = NO;
      [wrapperView addSubview:self];

      [self.centerXAnchor constraintEqualToAnchor:wrapperView.centerXAnchor].active = YES;
      [self.centerYAnchor constraintEqualToAnchor:wrapperView.centerYAnchor].active = YES;

      // To prevent UIKit from stretching subviews to all available width, we need to:
      // 1. Set width of wrapperView to match the subview, but with lower priority.
      NSLayoutConstraint *widthEqual = [wrapperView.widthAnchor constraintEqualToAnchor:self.widthAnchor];
      widthEqual.priority = UILayoutPriorityDefaultHigh;
      widthEqual.active = YES;

      NSLayoutConstraint *heightEqual = [wrapperView.heightAnchor constraintEqualToAnchor:self.heightAnchor];
      heightEqual.priority = UILayoutPriorityDefaultHigh;
      heightEqual.active = YES;

      // 2. Set content hugging priority.
      [self setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];
      [self setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisVertical];

      // 3. Set compression resistance to prevent shrinking below intrinsic size.
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
      react::RNSSplitHeaderItemState(RCTSizeFromCGSize(frameInNavBar.size), RCTPointFromCGPoint(frameInNavBar.origin));
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
  [_invalidationDelegate headerItemDidInvalidate];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];
  [_invalidationDelegate headerItemDidInvalidate];
}

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSSplitHeaderItemShadowNode::ConcreteState>(state);
}

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

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (_placement == react::RNSSplitHeaderItemIOSPlacement::Left ||
        _placement == react::RNSSplitHeaderItemIOSPlacement::Right) {
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
  const auto &newItemProps = *std::static_pointer_cast<const react::RNSSplitHeaderItemIOSProps>(props);
  const auto &oldItemProps = *std::static_pointer_cast<const react::RNSSplitHeaderItemIOSProps>(_props);

  bool needsUpdate = NO;

  if (oldItemProps.placement != newItemProps.placement) {
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
  return react::concreteComponentDescriptorProvider<react::RNSSplitHeaderItemComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

@end

Class<RCTComponentViewProtocol> RNSSplitHeaderItemComponentViewCls(void)
{
  return RNSSplitHeaderItemComponentView.class;
}
