#import <UIKit/UIKit.h>

#import "RNSOverlayView.h"

#import <React/RCTInvalidating.h>
#import <React/RCTTouchHandler.h>

@interface RNSOverlayView () <RCTInvalidating>
@end

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
  UIPanGestureRecognizer *_gestureRecognizer;
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
    [self setShown:YES];
    [self setInterceptTouches:NO];
  }

  return self;
}

- (void)setShown:(BOOL)shown
{
  if (_shown != shown) {
    _shown = shown;
    if (_shown) {
      [self show];
    } else {
      [self hide];
    }
  }
}

- (void)setDraggable:(BOOL)draggable
{
  if (_draggable != draggable) {
    _draggable = draggable;
    if (_draggable) {
      [_container addGestureRecognizer:self.gestureRecognizer];
    } else {
      [_container removeGestureRecognizer:self.gestureRecognizer];
    }
  }
}

- (void)setInterceptTouches:(BOOL)interceptTouches
{
  _interceptTouches = interceptTouches;
  _container.userInteractionEnabled = interceptTouches;
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

- (UIPanGestureRecognizer *)gestureRecognizer
{
  if (!_gestureRecognizer) {
    _gestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(gesture:)];
  }

  return _gestureRecognizer;
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

- (void)gesture:(UIPanGestureRecognizer *)gestureRecognizer
{
  CGPoint translation = [gestureRecognizer translationInView:_container.superview];
  _container.center = CGPointMake(_container.center.x + translation.x, _container.center.y + translation.y);
  [gestureRecognizer setTranslation:CGPointMake(0, 0) inView:_container.superview];
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

RCT_EXPORT_VIEW_PROPERTY(shown, BOOL)
RCT_EXPORT_VIEW_PROPERTY(draggable, BOOL)
RCT_EXPORT_VIEW_PROPERTY(interceptTouches, BOOL)

@end
