// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/ios/Fabric/RNCSafeAreaViewComponentView.mm
#import "RNSSafeAreaViewComponentView.h"
#import <React/RCTConversions.h>
#import <React/RCTUtils.h>

#if RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <rnscreens/RNSSafeAreaViewComponentDescriptor.h>
#import <rnscreens/RNSSafeAreaViewState.h>
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

#pragma mark - View implementation

@implementation RNSSafeAreaViewComponentView {
  facebook::react::RNSSafeAreaViewShadowNode::ConcreteState::Shared _state;
  UIEdgeInsets _currentSafeAreaInsets;
  __weak UIView<RNSSafeAreaProviding> *_Nullable _providerView;
}

#if RCT_NEW_ARCH_ENABLED
// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}
#endif // RCT_NEW_ARCH_ENABLED

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
#if RCT_NEW_ARCH_ENABLED
  static const auto defaultProps = std::make_shared<const react::RNSSafeAreaViewProps>();
  _props = defaultProps;
#endif // RCT_NEW_ARCH_ENABLED
}

- (void)didMoveToWindow
{
  UIView *previousProviderView = _providerView;
  _providerView = [self findNearestProvider];

  [self updateStateIfNecessary];

  if (previousProviderView != _providerView) {
    [NSNotificationCenter.defaultCenter removeObserver:self name:RNSSafeAreaDidChange object:previousProviderView];
    [NSNotificationCenter.defaultCenter addObserver:self
                                           selector:@selector(safeAreaProviderInsetsDidChange:)
                                               name:RNSSafeAreaDidChange
                                             object:_providerView];
  }
}

- (UIView<RNSSafeAreaProviding> *_Nonnull)findNearestProvider
{
  UIView *current = self.superview;
  while (current != nil) {
    if ([current respondsToSelector:@selector(RNS_safeAreaInsets)]) {
      return static_cast<UIView<RNSSafeAreaProviding> *>(current);
    }
    current = current.superview;
  }
  return self;
}

- (void)safeAreaProviderInsetsDidChange:(NSNotification *)notification
{
  [self updateStateIfNecessary];
}

- (void)updateStateIfNecessary
{
  if (_providerView == nil) {
    return;
  }

  UIEdgeInsets safeAreaInsets = _providerView.RNS_safeAreaInsets;

  if (UIEdgeInsetsEqualToEdgeInsetsWithThreshold(safeAreaInsets, _currentSafeAreaInsets, 1.0 / RCTScreenScale())) {
    return;
  }

  _currentSafeAreaInsets = safeAreaInsets;
  [self updateState];
}

- (void)updateState
{
  using facebook::react::RNSSafeAreaViewShadowNode;

  if (!_state) {
    return;
  }

  _state->updateState(
      [=](RNSSafeAreaViewShadowNode::ConcreteState::Data const &oldData)
          -> RNSSafeAreaViewShadowNode::ConcreteState::SharedData {
        auto newData = oldData;
        newData.insets = RCTEdgeInsetsFromUIEdgeInsets(_currentSafeAreaInsets);
        return std::make_shared<RNSSafeAreaViewShadowNode::ConcreteState::Data const>(newData);
      });
}

BOOL UIEdgeInsetsEqualToEdgeInsetsWithThreshold(UIEdgeInsets insets1, UIEdgeInsets insets2, CGFloat threshold)
{
  return ABS(insets1.left - insets2.left) <= threshold && ABS(insets1.right - insets2.right) <= threshold &&
      ABS(insets1.top - insets2.top) <= threshold && ABS(insets1.bottom - insets2.bottom) <= threshold;
}

#pragma mark - RNSSafeAreaProviding

- (UIEdgeInsets)RNS_safeAreaInsets
{
  return self.safeAreaInsets;
}

#if RCT_NEW_ARCH_ENABLED
#pragma mark - RCTViewComponentViewProtocol

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
  [self updateStateIfNecessary];
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
#pragma mark - LEGACY RCTComponent protocol

#endif
@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSSafeAreaView(void)
{
  return RNSSafeAreaViewComponentView.class;
}
#endif // RCT_NEW_ARCH_ENABLED
