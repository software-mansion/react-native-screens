// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#import "RNSSafeAreaViewComponentView.h"
#import <React/RCTConversions.h>
#import <React/RCTUtils.h>
#import "RNSSafeAreaProviding.h"
#import "RNSSafeAreaViewNotifications.h"

#if RCT_NEW_ARCH_ENABLED
#import <cxxreact/ReactNativeVersion.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <rnscreens/RNSSafeAreaViewComponentDescriptor.h>
#import <rnscreens/RNSSafeAreaViewState.h>
#else
#import <React/RCTUIManager.h>
#import "RNSSafeAreaViewEdges.h"
#import "RNSSafeAreaViewLocalData.h"
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

static BOOL UIEdgeInsetsEqualToEdgeInsetsWithThreshold(UIEdgeInsets insets1, UIEdgeInsets insets2, CGFloat threshold);

#pragma mark - View implementation

@implementation RNSSafeAreaViewComponentView {
#if RCT_NEW_ARCH_ENABLED
  facebook::react::RNSSafeAreaViewShadowNode::ConcreteState::Shared _state;
#else
  __weak RCTBridge *_bridge;
  RNSSafeAreaViewEdges _edges;
#endif // RCT_NEW_ARCH_ENABLED
  UIEdgeInsets _currentSafeAreaInsets;
  __weak UIView<RNSSafeAreaProviding> *_Nullable _providerView;
}

#if RCT_NEW_ARCH_ENABLED
// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}
#else
- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super initWithFrame:CGRectZero]) {
    _bridge = bridge;
    [self initState];
  }

  return self;
}

RCT_NOT_IMPLEMENTED(-(instancetype)initWithCoder : (NSCoder *)decoder)
RCT_NOT_IMPLEMENTED(-(instancetype)initWithFrame : (CGRect)frame)
#endif // RCT_NEW_ARCH_ENABLED

- (void)initState
{
#if RCT_NEW_ARCH_ENABLED
  static const auto defaultProps = std::make_shared<const react::RNSSafeAreaViewProps>();
  _props = defaultProps;
#else
  _edges = RNSSafeAreaViewEdgesMake(false, false, false, false);
#endif // RCT_NEW_ARCH_ENABLED
}

- (void)didMoveToWindow
{
  UIView *previousProviderView = _providerView;

  if (self.window != nil) {
    _providerView = [self findNearestAncestorProvider];
    [self updateStateIfNeeded];
  } else {
    _providerView = nil;
  }

  if (previousProviderView != _providerView) {
    if (previousProviderView != nil) {
      [NSNotificationCenter.defaultCenter removeObserver:self name:RNSSafeAreaDidChange object:previousProviderView];
    }
    if (_providerView != nil) {
      [NSNotificationCenter.defaultCenter addObserver:self
                                             selector:@selector(safeAreaProviderInsetsDidChange:)
                                                 name:RNSSafeAreaDidChange
                                               object:_providerView];
    }
  }
}

- (UIView<RNSSafeAreaProviding> *_Nullable)findNearestAncestorProvider
{
  UIView *current = self.superview;
  while (current != nil) {
    if ([current respondsToSelector:@selector(providerSafeAreaInsets)]) {
      return static_cast<UIView<RNSSafeAreaProviding> *>(current);
    }
    current = current.superview;
  }
  return nil;
}

- (void)safeAreaProviderInsetsDidChange:(NSNotification *)notification
{
  [self updateStateIfNeeded];
}

- (void)updateStateIfNeeded
{
  if (_providerView == nil) {
    return;
  }

  UIEdgeInsets safeAreaInsets = _providerView.providerSafeAreaInsets;

  if (UIEdgeInsetsEqualToEdgeInsetsWithThreshold(safeAreaInsets, _currentSafeAreaInsets, 1.0 / RCTScreenScale())) {
    return;
  }

  _currentSafeAreaInsets = safeAreaInsets;
#if RCT_NEW_ARCH_ENABLED
  [self updateState];
#else
  [self updateLocalData];
#endif // RCT_NEW_ARCH_ENABLED
}

#if RCT_NEW_ARCH_ENABLED
- (void)updateState
{
  using facebook::react::RNSSafeAreaViewShadowNode;

  if (!_state) {
    return;
  }

  auto newData = facebook::react::RNSSafeAreaViewState{RCTEdgeInsetsFromUIEdgeInsets(_currentSafeAreaInsets)};
  _state->updateState(
      std::move(newData)
#if REACT_NATIVE_VERSION_MINOR >= 82
          ,
      facebook::react::EventQueue::UpdateMode::unstable_Immediate
#endif // REACT_NATIVE_VERSION_MINOR >= 82
  );
}
#else
- (void)updateLocalData
{
  RNSSafeAreaViewLocalData *localData = [[RNSSafeAreaViewLocalData alloc] initWithInsets:_currentSafeAreaInsets
                                                                                   edges:_edges];
  [_bridge.uiManager setLocalData:localData forView:self];
}
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED
#pragma mark - RCTComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSafeAreaViewComponentDescriptor>();
}

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState
{
  using facebook::react::RNSSafeAreaViewShadowNode;
  _state = std::static_pointer_cast<RNSSafeAreaViewShadowNode::ConcreteState const>(state);
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];

  if (updateMask & RNComponentViewUpdateMaskProps) {
    [self updateStateIfNeeded];
  }
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];

  [NSNotificationCenter.defaultCenter removeObserver:self];
  _state.reset();
  _providerView = nil;
  _currentSafeAreaInsets = UIEdgeInsetsZero;
}

#else
#pragma mark - Paper props / LEGACY RCTComponent protocol

- (void)setEdges:(RNSSafeAreaViewEdges)edges
{
  _edges = edges;
  [self updateLocalData];
}
#endif
@end

#pragma mark - Utility functions

static BOOL UIEdgeInsetsEqualToEdgeInsetsWithThreshold(UIEdgeInsets insets1, UIEdgeInsets insets2, CGFloat threshold)
{
  return ABS(insets1.left - insets2.left) <= threshold && ABS(insets1.right - insets2.right) <= threshold &&
      ABS(insets1.top - insets2.top) <= threshold && ABS(insets1.bottom - insets2.bottom) <= threshold;
}

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSSafeAreaView(void)
{
  return RNSSafeAreaViewComponentView.class;
}
#endif // RCT_NEW_ARCH_ENABLED
