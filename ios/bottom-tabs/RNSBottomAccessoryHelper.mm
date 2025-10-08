#import "RNSBottomAccessoryHelper.h"
#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#include <cxxreact/ReactNativeVersion.h>

#if RCT_NEW_ARCH_ENABLED
#import <rnscreens/RNSBottomTabsAccessoryShadowNode.h>
#else // RCT_NEW_ARCH_ENABLED
#import <React/RCTUIManager.h>
#endif // RCT_NEW_ARCH_ENABLED

namespace react = facebook::react;

@implementation RNSBottomAccessoryHelper {
  RNSBottomTabsAccessoryComponentView *_bottomAccessoryView;

#if RCT_NEW_ARCH_ENABLED
  react::RNSBottomTabsAccessoryShadowNode::ConcreteState::Shared _state;
#endif // RCT_NEW_ARCH_ENABLED

#if !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  BOOL _initialStateUpdateSent;
  CADisplayLink *_displayLink;
#endif // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82

  CGRect _previousFrame;
  id<UITraitChangeRegistration> _traitChangeRegistration;
}

- (instancetype)initWithBottomAccessoryView:(RNSBottomTabsAccessoryComponentView *)bottomAccessoryView
{
  if (self = [super init]) {
    _bottomAccessoryView = bottomAccessoryView;
    [self initState];
    _traitChangeRegistration = [self registerForAccessoryEnvironmentChanges];
  }

  return self;
}

- (void)initState
{
#if !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  _initialStateUpdateSent = NO;
  _displayLink = nil;
#endif // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  _previousFrame = CGRectZero;
}

- (id<UITraitChangeRegistration>)registerForAccessoryEnvironmentChanges
{
  return [_bottomAccessoryView
      registerForTraitChanges:@[ [UITraitTabAccessoryEnvironment class] ]
                  withHandler:^(__kindof id<UITraitEnvironment>, UITraitCollection *previousTraitCollection) {
                    [self->_bottomAccessoryView.reactEventEmitter
                        emitOnEnvironmentChangeIfNecessary:self->_bottomAccessoryView.traitCollection
                                                               .tabAccessoryEnvironment];
                  }];
}

- (void)registerForAccessoryFrameChanges
{
  [self.wrapperView.superview addObserver:self
                               forKeyPath:@"center"
                                  options:NSKeyValueObservingOptionInitial
                                  context:nil];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
  [self notifyFrameUpdate];
}

- (RNSBottomTabsAccessoryWrapperView *)wrapperView
{
  RCTAssert(
      [_bottomAccessoryView.superview isKindOfClass:[RNSBottomTabsAccessoryWrapperView class]],
      @"[RNScreens] RNSBottomTabsAccessoryWrapperView must be the parent of RNSBottomTabsAccessoryCompomentView");
  return static_cast<RNSBottomTabsAccessoryWrapperView *>(_bottomAccessoryView.superview);
}

- (void)notifyFrameUpdate
{
#if !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  // Make sure that bottom accessory's size is sent to ShadowNode as soon as possible.
  // We set origin to (0,0) because initially self.wrapperView.superview's origin is incorrect.
  // We want the enable the display link as well so that it takes over later with correct origin.
  if (!_initialStateUpdateSent) {
    CGRect frame =
        CGRectMake(0, 0, self.wrapperView.superview.frame.size.width, self.wrapperView.superview.frame.size.height);
    [self updateShadowStateWithFrame:frame];
    _initialStateUpdateSent = YES;
  }

  if (_displayLink == nil && !CGRectEqualToRect(_previousFrame, self.wrapperView.superview.frame)) {
    [self setupDisplayLink];
  }
#else // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  // We use self.wrapperView.superview because it has both the size and the origin
  // that we want to send to the ShadowNode.
  [self updateShadowStateWithFrame:self.wrapperView.superview.frame];
#endif // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
}

#if !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
- (void)setupDisplayLink
{
  _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(handleDisplayLink:)];
  [_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)handleDisplayLink:(CADisplayLink *)sender
{
  // We use self.wrapperView.superview because it has both the size and the origin
  // that we want to send to the ShadowNode.
  CGRect presentationFrame = self.wrapperView.superview.layer.presentationLayer.frame;
  if (CGRectEqualToRect(presentationFrame, CGRectZero)) {
    return;
  }

  [self updateShadowStateWithFrame:presentationFrame];

  // self.wrapperView.superview.frame is set to final value at the beginning of the transition.
  // When frame from presentation layer matches self.wrapperView.superview.frame, it indicates that
  // the transition is over and we can disable the display link.
  if (CGRectEqualToRect(presentationFrame, self.wrapperView.superview.frame)) {
    [self invalidateDisplayLink];
  }
}

- (void)invalidateDisplayLink
{
  [_displayLink invalidate];
  _displayLink = nil;
}
#endif // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (!CGRectEqualToRect(frame, _previousFrame)) {
#if RCT_NEW_ARCH_ENABLED
    if (_state != nullptr) {
      auto newState =
          react::RNSBottomTabsAccessoryState{RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin)};
      _state->updateState(
          std::move(newState)
#if REACT_NATIVE_VERSION_MINOR >= 82
              ,
          facebook::react::EventQueue::UpdateMode::unstable_Immediate
#endif // REACT_NATIVE_VERSION_MINOR >= 82
      );
      _previousFrame = frame;
    }
#else // RCT_NEW_ARCH_ENABLED
    [_bottomAccessoryView.bridge.uiManager setSize:frame.size forView:_bottomAccessoryView];
    _previousFrame = frame;
#endif // RCT_NEW_ARCH_ENABLED
  }
}

#if RCT_NEW_ARCH_ENABLED

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSBottomTabsAccessoryShadowNode::ConcreteState>(state);
}

#endif // RCT_NEW_ARCH_ENABLED

- (void)invalidate
{
  [_bottomAccessoryView unregisterForTraitChanges:_traitChangeRegistration];
  _traitChangeRegistration = nil;
  [self.wrapperView.superview removeObserver:self forKeyPath:@"center"];
  _bottomAccessoryView = nil;
  _previousFrame = CGRectZero;
#if !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  [self invalidateDisplayLink];
#endif // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
}

@end
