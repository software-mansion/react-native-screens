#import "RNSScreenComponentView.h"
#import "RNSScreenStackHeaderConfigComponentView.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>

#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSScreenComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNSScreenComponentView () <RCTRNSScreenViewProtocol, RCTMountingTransactionObserving>
@end

@implementation RNSScreenComponentView {
  RNSScreenController *_controller;
  RNSScreenShadowNode::ConcreteState::Shared _state;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSScreenProps>();
    _props = defaultProps;
    _controller = [[RNSScreenController alloc] initWithView:self];
  }

  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfigComponentView class]]) {
    _config = childComponentView;
    ((RNSScreenStackHeaderConfigComponentView *)childComponentView).screenView = self;
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [self.controller setViewToSnapshot];
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfigComponentView class]]) {
    _config = nil;
  }
  [super unmountChildComponentView:childComponentView index:index];
}

- (void)updateBounds
{
  if (_state != nullptr) {
    auto boundsSize = self.bounds.size;
    auto newState = RNSScreenState{RCTSizeFromCGSize(boundsSize)};
    _state->updateState(std::move(newState));
    UINavigationController *navctr = _controller.navigationController;
    [navctr.view setNeedsLayout];
  }
}

- (UIView *)reactSuperview
{
  return _reactSuperview;
}

- (void)notifyWillAppear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
        ->onWillAppear(RNSScreenEventEmitter::OnWillAppear{});
  }
}

- (void)notifyWillDisappear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
        ->onWillDisappear(RNSScreenEventEmitter::OnWillDisappear{});
  }
}

- (void)notifyAppear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)->onAppear(RNSScreenEventEmitter::OnAppear{});
  }
}

- (void)notifyDismissedWithCount:(int)dismissCount
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
        ->onDismissed(RNSScreenEventEmitter::OnDismissed{dismissCount : dismissCount});
  }
}

- (void)notifyDisappear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
        ->onDisappear(RNSScreenEventEmitter::OnDisappear{});
  }
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMountWithMetadata:(MountingTransactionMetadata const &)metadata
{
  [self.controller takeSnapshot];
}

#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  // TODO: Make sure that there is no edge case when this should be uncommented
  // _controller=nil;
  _state.reset();
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSScreenComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const RNSScreenProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const RNSScreenProps>(props);

  [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const RNSScreenShadowNode::ConcreteState>(state);
}

@end

Class<RCTComponentViewProtocol> RNSScreenCls(void)
{
  return RNSScreenComponentView.class;
}
