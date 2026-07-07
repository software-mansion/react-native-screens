#import "RNSStackHeaderItemComponentView.h"
#import "RNSConversions-Stack.h"
#import "RNSConversions.h"
#import "RNSDefines.h"
#import "RNSStackHeaderItemEventEmitter.h"
#import "RNSStackHeaderItemShadowStateProxy.h"
#import "RNSStackHeaderMenuData.h"
#import "RNSStackHeaderMenuMapper.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSStackHeaderItemComponentDescriptor.h>

namespace react = facebook::react;

@implementation RNSStackHeaderItemComponentView {
  BOOL _didSetHeaderItemPlacement;

  std::shared_ptr<const react::RNSStackHeaderItemShadowNode::ConcreteState> _state;
  RNSStackHeaderItemShadowStateProxy *_Nonnull _shadowStateProxy;
  RNSStackHeaderItemEventEmitter *_Nonnull _headerItemEventEmitter;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSStackHeaderItemIOSProps>();
    _props = defaultProps;
    [self resetProps];
    _shadowStateProxy = [[RNSStackHeaderItemShadowStateProxy alloc] initWithHeaderItemView:self];
    _headerItemEventEmitter = [RNSStackHeaderItemEventEmitter new];

    // For custom items (header subviews), we rely on `intrinsicContentSize`
    // which passes correct view size from layoutMetrics to iOS
    // `intrinsicContentSize` is queried only when opted out of default constraints
    self.translatesAutoresizingMaskIntoConstraints = NO;
  }
  return self;
}

- (void)resetProps
{
  _itemId = nil;
  _title = nil;
  _menu = nil;
  _placement = RNSHeaderItemPlacementTrailing;
  _didSetHeaderItemPlacement = NO;
  _respondsToOnPress = NO;
}

- (void)emitOnPress
{
  [_headerItemEventEmitter emitOnPress];
}

#pragma mark - RNSStackHeaderItemDataProviding

- (nullable UIView *)customView
{
  return self.subviews.count > 0 ? self : nil;
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
  [_invalidationDelegate headerItemDidInvalidateWithId:_itemId];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];

  // An existing item may have transitioned from custom view to label-only,
  // and needs to be rebuilt.
  [_invalidationDelegate headerItemDidInvalidateWithId:_itemId];
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
  BOOL menuDidChange = NO;

  if (oldItemProps.itemId != newItemProps.itemId) {
    _itemId = RCTNSStringFromStringNilIfEmpty(newItemProps.itemId);
  }

  if (oldItemProps.placement != newItemProps.placement) {
    if (_didSetHeaderItemPlacement) {
      RCTLogWarn(@"[RNScreens] Changing header item placement at runtime is not supported");
    } else {
      _placement = rnscreens::conversion::convert<RNSHeaderItemPlacement>(newItemProps.placement);
    }
  }
  _didSetHeaderItemPlacement = YES;

  if (oldItemProps.title != newItemProps.title) {
    _title = RCTNSStringFromStringNilIfEmpty(newItemProps.title);
    needsUpdate = YES;
  }

  if (oldItemProps.menu != newItemProps.menu) {
    _menu = [RNSStackHeaderMenuMapper
        menuFromDictionary:rnscreens::conversion::RNSConvertFollyDynamicToId(newItemProps.menu)];
    menuDidChange = YES;
  }

  if (oldItemProps.respondsToOnPress != newItemProps.respondsToOnPress) {
    _respondsToOnPress = newItemProps.respondsToOnPress;
    needsUpdate = YES;
  }

  [super updateProps:props oldProps:oldProps];

  if (needsUpdate) {
    // rebuilds the item; needs to rebuilds the menu, but keeps its state
    [_invalidationDelegate headerItemDidInvalidateWithId:_itemId];
  }

  if (menuDidChange) {
    // there are 3 distinct cases for rebuilding the menu
    // 1. only menu changed -- no item rebuilding, menu state reset
    // 2. some different prop changed -- item rebuilds, but menu should keep its state
    // 3. both menu and some other prop changed -- both item and menu rebuilds + menu state should be reset
    // If we don't have separate if-s, we won't cover all cases,
    // but unfortunately we're rebuilding the menu twice for 3. case.
    [_invalidationDelegate headerItemMenuDidChangeWithId:_itemId];
  }
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_headerItemEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSStackHeaderItemIOSEventEmitter>(eventEmitter)];
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
