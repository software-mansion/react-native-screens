#import "RNSBottomAccessoryHelper.h"
#import <React/RCTConversions.h>
#import <React/RCTAssert.h>
#import <rnscreens/RNSBottomTabsAccessoryShadowNode.h>

namespace react = facebook::react;

@implementation RNSBottomAccessoryHelper {
  CADisplayLink *_displayLink;
  CGRect _previousFrame;
  CGRect _destinationFrame;
  RNSBottomTabsAccessoryComponentView *_bottomAccessoryView;
  react::RNSBottomTabsAccessoryShadowNode::ConcreteState::Shared _state;
  BOOL _initial;
}

- (instancetype)initWithBottomAccessoryView:(RNSBottomTabsAccessoryComponentView *)bottomAccessoryView
{
  if (self = [super init]) {
    _bottomAccessoryView = bottomAccessoryView;
    _initial = YES;
    [_bottomAccessoryView
        registerForTraitChanges:@[ [UITraitTabAccessoryEnvironment class] ]
                    withHandler:^(__kindof id<UITraitEnvironment>, UITraitCollection *previousTrairCollection){
                        //      [self setupDisplayLink];
                    }];
  }

  return self;
}

- (RNSBottomTabsAccessoryWrapperView *)wrapperView {
  // TODO: message
  RCTAssert([_bottomAccessoryView.superview isKindOfClass:[RNSBottomTabsAccessoryWrapperView class]], @"");
  return static_cast<RNSBottomTabsAccessoryWrapperView *>(_bottomAccessoryView.superview);
}

- (void)notifyTransitionStart
{
  if (_initial) {
    CGRect frame = CGRectMake(0, 0, self.wrapperView.superview.frame.size.width, self.wrapperView.superview.frame.size.height);
    [self updateShadowStateWithFrame:frame];
    _initial = NO;
  }
  if (_displayLink == nil && !CGRectEqualToRect(_previousFrame, self.wrapperView.superview.frame)) {
    [self setupDisplayLink];
  }
}

- (void)setupDisplayLink
{
  NSLog(@"[bottomaccessory] setupDisplayLink");
  _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(handleDisplayLink:)];
  [_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)handleDisplayLink:(CADisplayLink *)sender
{
  CGRect presentationFrame = self.wrapperView.superview.layer.presentationLayer.frame;
  if (CGRectEqualToRect(presentationFrame, CGRectZero)) {
    return;
  }
  
  [self updateShadowStateWithFrame:presentationFrame];

  if (CGRectEqualToRect(presentationFrame, self.wrapperView.superview.frame)) {
    [self invalidateDisplayLink];
  }
}

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (!CGRectEqualToRect(frame, _previousFrame)) {
    if (_state != nullptr) {
      auto newState = react::RNSBottomTabsAccessoryState{
          RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin)};
      _state->updateState(std::move(newState));
      _previousFrame = frame;
    }
  }
}

- (void)invalidateDisplayLink
{
  NSLog(@"[bottomaccessory] invalidate display link");
  [_displayLink invalidate];
  _displayLink = nil;
}

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSBottomTabsAccessoryShadowNode::ConcreteState>(state);
}

@end
