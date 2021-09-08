#import <UIKit/UIKit.h>

#import "RNSOverlayView.h"

#import <React/RCTTouchHandler.h>

@implementation RNSOverlayViewContainer

- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event
{
  for (UIView *view in [self subviews]) {
    if (view.userInteractionEnabled && [view pointInside:[self convertPoint:point toView:view] withEvent:event]) {
      return YES;
    }
  }
  return NO;
}

@end

@implementation RNSOverlayView {
  __weak RCTBridge *_bridge;
  RNSOverlayViewContainer *_container;
  CGRect _reactFrame;
  RCTTouchHandler *_touchHandler;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    _reactFrame = CGRectNull;
    _container = self.container;
    [self show];
  }

  return self;
}

- (void)reactSetFrame:(CGRect)frame
{
  _reactFrame = frame;
  [_container setFrame:frame];
}

- (void)addSubview:(UIView *)view
{
  [_container addSubview:view];
}

- (RNSOverlayViewContainer *)container
{
  if (_container == nil) {
    _container = [[RNSOverlayViewContainer alloc] initWithFrame:_reactFrame];
  }

  return _container;
}

- (void)show
{
  UIWindow *window = RCTSharedApplication().delegate.window;
  [window addSubview:_container];
}

- (void)hide
{
  if (!_container) {
    return;
  }

  [_container removeFromSuperview];
}

- (void)didMoveToWindow
{
  if (self.window == nil) {
    [self hide];
    [_touchHandler detachFromView:_container];
  } else {
    if (_touchHandler == nil) {
      _touchHandler = [[RCTTouchHandler alloc] initWithBridge:_bridge];
    }
    [_touchHandler attachToView:_container];
  }
}

- (void)invalidate
{
  [self hide];
  _container = nil;
}

@end

@implementation RNSOverlayViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RNSOverlayView alloc] initWithBridge:self.bridge];
}

@end
