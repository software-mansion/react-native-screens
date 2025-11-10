#import "RNSBottomAccessoryHelper.h"

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

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
  RNSBottomTabsAccessoryComponentView *__weak _bottomAccessoryView;

#if RCT_NEW_ARCH_ENABLED
  react::RNSBottomTabsAccessoryShadowNode::ConcreteState::Shared _state;
#endif // RCT_NEW_ARCH_ENABLED

#if !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  BOOL _initialStateUpdateSent;
  CADisplayLink *_displayLink;
#else // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  RNSBottomTabsAccessoryContentComponentView *__weak _regularContentView;
  RNSBottomTabsAccessoryContentComponentView *__weak _inlineContentView;
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
#else // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  _regularContentView = nil;
  _inlineContentView = nil;
#endif // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  _previousFrame = CGRectZero;
}

#pragma mark - Content view switching workaround

#if RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR >= 82

- (BOOL)isContentViewSwitchingWorkaroundActive
{
  return _regularContentView != nil && _inlineContentView != nil;
}

- (void)setContentView:(RNSBottomTabsAccessoryContentComponentView *)contentView
        forEnvironment:(RNSBottomTabsAccessoryEnvironment)environment
{
  switch (environment) {
    case RNSBottomTabsAccessoryEnvironmentRegular:
      _regularContentView = contentView;
      break;

    case RNSBottomTabsAccessoryEnvironmentInline:
      _inlineContentView = contentView;
      break;

    default:
      RCTLogError(@"[RNScreens] Unsupported BottomTabsAccessory environment");
  }

  [self handleContentViewVisibilityForEnvironmentIfNeeded];
}

- (void)handleContentViewVisibilityForEnvironmentIfNeeded
{
  if (!self.isContentViewSwitchingWorkaroundActive) {
    return;
  }

  switch (self->_bottomAccessoryView.traitCollection.tabAccessoryEnvironment) {
    case UITabAccessoryEnvironmentInline:
      _regularContentView.layer.opacity = 0.0;
      _inlineContentView.layer.opacity = 1.0;
      break;
    default:
      _regularContentView.layer.opacity = 1.0;
      _inlineContentView.layer.opacity = 0.0;
      break;
  }
}

#endif // RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR >= 82

#pragma mark - Observing environment changes

- (id<UITraitChangeRegistration>)registerForAccessoryEnvironmentChanges
{
  return [_bottomAccessoryView
      registerForTraitChanges:@[ [UITraitTabAccessoryEnvironment class] ]
                  withHandler:^(__kindof id<UITraitEnvironment>, UITraitCollection *previousTraitCollection) {
                    UITabAccessoryEnvironment environment =
                        self->_bottomAccessoryView.traitCollection.tabAccessoryEnvironment;
                    [self->_bottomAccessoryView.reactEventEmitter emitOnEnvironmentChangeIfNeeded:environment];
#if RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR >= 82
                    [self handleContentViewVisibilityForEnvironmentIfNeeded];
#endif // RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR >= 82
                  }];
}

#pragma mark - Observing frame changes

- (void)registerForAccessoryFrameChanges
{
  [self.nativeWrapperView addObserver:self forKeyPath:@"center" options:NSKeyValueObservingOptionInitial context:nil];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
  [self notifyFrameUpdate];
}

- (UIView *)nativeWrapperView
{
  RCTAssert(
      _bottomAccessoryView.superview.superview != nil,
      @"[RNScreens] RNSBottomTabsAccessoryComponentView must be the set as bottom accessory.");
  return _bottomAccessoryView.superview.superview;
}

- (void)notifyFrameUpdate
{
#if !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  // Make sure that bottom accessory's size is sent to ShadowNode as soon as possible.
  // We set origin to (0,0) because initially self.nativeWrapperView's origin is incorrect.
  // We want the enable the display link as well so that it takes over later with correct origin.
  if (!_initialStateUpdateSent) {
    CGRect frame = CGRectMake(0, 0, self.nativeWrapperView.frame.size.width, self.nativeWrapperView.frame.size.height);
    [self updateShadowStateWithFrame:frame];
    _initialStateUpdateSent = YES;
  }

  if (_displayLink == nil && !CGRectEqualToRect(_previousFrame, self.nativeWrapperView.frame)) {
    [self setupDisplayLink];
  }
#else // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  // We use self.nativeWrapperView because it has both the size and the origin
  // that we want to send to the ShadowNode.
  [self updateShadowStateWithFrame:self.nativeWrapperView.frame];
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
  // We use self.nativeWrapperView because it has both the size and the origin
  // that we want to send to the ShadowNode.
  CGRect presentationFrame = self.nativeWrapperView.layer.presentationLayer.frame;
  if (CGRectEqualToRect(presentationFrame, CGRectZero)) {
    return;
  }

  [self updateShadowStateWithFrame:presentationFrame];

  // self.nativeWrapperView.frame is set to final value at the beginning of the transition.
  // When frame from presentation layer matches self.nativeWrapperView.frame, it indicates that
  // the transition is over and we can disable the display link.
  if (CGRectEqualToRect(presentationFrame, self.nativeWrapperView.frame)) {
    [self invalidateDisplayLink];
  }
}

- (void)invalidateDisplayLink
{
  [_displayLink invalidate];
  _displayLink = nil;
}
#endif // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82

#pragma mark - Synchronization with ShadowNode

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
  // Using nativeWrapperView directly here to avoid failing RCTAssert in self.nativeWrapperView.
  // If we're called from didMoveToWindow, it's not a problem, but I'm not sure if this will always be the case.
  [_bottomAccessoryView.superview.superview removeObserver:self forKeyPath:@"center"];
  _bottomAccessoryView = nil;
  _previousFrame = CGRectZero;
#if !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  [self invalidateDisplayLink];
#else // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
  _regularContentView = nil;
  _inlineContentView = nil;
#endif // !RCT_NEW_ARCH_ENABLED || REACT_NATIVE_VERSION_MINOR < 82
}

@end

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
