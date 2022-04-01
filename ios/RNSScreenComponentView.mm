#import "RNSScreenComponentView.h"
#import "RNSScreenStackHeaderConfigComponentView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSScreenComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTRootComponentView.h>
#import <React/RCTSurfaceTouchHandler.h>

using namespace facebook::react;

@interface RNSScreenComponentView () <RCTRNSScreenViewProtocol>
@end

@implementation RNSScreenComponentView {
  RNSScreenController *_controller;
  RNSScreenShadowNode::ConcreteState::Shared _state;
  RCTSurfaceTouchHandler *_touchHandler;
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
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfigComponentView class]]) {
    _config = nil;
  }
  [super unmountChildComponentView:childComponentView index:index];
}

- (void)updateBounds
{
  if (_state != nullptr) {
    auto newState = RNSScreenState{RCTSizeFromCGSize(self.bounds.size)};
    _state->updateState(std::move(newState));
    UINavigationController *navctr = _controller.navigationController;
    [navctr.view setNeedsLayout];
  }
}

- (UIView *)reactSuperview
{
  return _reactSuperview;
}

- (UIViewController *)reactViewController
{
  return _controller;
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

- (void)setGestureEnabled:(BOOL)gestureEnabled
{
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, tvOS 13.0, *)) {
    _controller.modalInPresentation = !gestureEnabled;
  }
#endif
  _gestureEnabled = gestureEnabled;
}

- (BOOL)isMountedUnderScreenOrReactRoot
{
  for (UIView *parent = self.superview; parent != nil; parent = parent.superview) {
    if ([parent isKindOfClass:[RCTRootComponentView class]] || [parent isKindOfClass:[RNSScreenComponentView class]]) {
      return YES;
    }
  }
  return NO;
}

- (void)didMoveToWindow
{
  if (self.window != nil && ![self isMountedUnderScreenOrReactRoot]) {
    if (_touchHandler == nil) {
      _touchHandler = [RCTSurfaceTouchHandler new];
    }
    [_touchHandler attachToView:self];
  } else {
    [_touchHandler detachFromView:self];
  }
}

- (RCTSurfaceTouchHandler *)touchHandler
{
  if (_touchHandler != nil) {
    return _touchHandler;
  }
  UIView *parent = [self superview];
  while (parent != nil && ![parent respondsToSelector:@selector(touchHandler)])
    parent = parent.superview;

  if (parent != nil) {
    return [parent performSelector:@selector(touchHandler)];
  }
  return nil;
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

  _fullScreenSwipeEnabled = newScreenProps.fullScreenSwipeEnabled;
  _gestureEnabled = newScreenProps.gestureEnabled;
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
