#import <UIKit/UIKit.h>

#import "RNSFullWindowOverlay.h"

#import <React/RCTTouchHandler.h>

@implementation RNSFullWindowOverlayContainer

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

@implementation RNSFullWindowOverlay {
  __weak RCTBridge *_bridge;
  RNSFullWindowOverlayContainer *_container;
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

- (RNSFullWindowOverlayContainer *)container
{
  if (_container == nil) {
    _container = [[RNSFullWindowOverlayContainer alloc] initWithFrame:_reactFrame];
  }

  return _container;
}

- (void)show
{
  UIWindow *window = RCTSharedApplication().delegate.window;
  [window addSubview:_container];
}

- (void)didMoveToWindow
{
  if (self.window == nil) {
    if (_container != nil) {
      [_container removeFromSuperview];
      [_touchHandler detachFromView:_container];
    }
  } else {
    if (_touchHandler == nil) {
      _touchHandler = [[RCTTouchHandler alloc] initWithBridge:_bridge];
    }

    /**
     * Reattach the RNSFullWindowOverlayContainer to the current
     * window if it's not nil and has no superview. This scenario
     * happens when another UIWindow is opened, causing the
     * current RNSFullWindowOverlayContainer to be removed (see the 
     * `removeFromSuperview` logic above) from its superview.
     */
    if (_container != nil && _container.superview == nil) {
      [self show];
    }

    [_touchHandler attachToView:_container];
  }
}

- (void)invalidate
{
  [_container removeFromSuperview];
  _container = nil;
}

@end

@implementation RNSFullWindowOverlayManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RNSFullWindowOverlay alloc] initWithBridge:self.bridge];
}

@end
