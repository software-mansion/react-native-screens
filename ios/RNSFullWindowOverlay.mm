#import <UIKit/UIKit.h>

#import "RNSFullWindowOverlay.h"

#ifdef RN_FABRIC_ENABLED
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RCTFabricComponentsPlugins.h"
#else
#import <React/RCTTouchHandler.h>
#endif // RN_FABRIC_ENABLED

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
#ifdef RN_FABRIC_ENABLED
  RCTSurfaceTouchHandler *_touchHandler;
#else
  RCTTouchHandler *_touchHandler;
#endif // RN_FABRIC_ENABLED
}

- (instancetype)init
{
  if (self = [super init]) {
    [self _initCommon];
  }
  return self;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    [self _initCommon];
  }

  return self;
}

- (void)_initCommon
{
  _reactFrame = CGRectNull;
  _container = self.container;
  [self show];
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
#ifdef RN_FABRIC_ENABLED
      _touchHandler = [RCTSurfaceTouchHandler new];
#else
      _touchHandler = [[RCTTouchHandler alloc] initWithBridge:_bridge];
#endif
    }
    [_touchHandler attachToView:_container];
  }
}

#ifdef RN_FABRIC_ENABLED
#pragma mark - Fabric Specific

+ (facebook::react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return facebook::react::concreteComponentDescriptorProvider<
      facebook::react::RNSFullWindowOverlayComponentDescriptor>();
}

#else
#pragma mark - Paper specific

- (void)invalidate
{
  [_container removeFromSuperview];
  _container = nil;
}

#endif // RN_FABRIC_ENABLED

@end

#ifdef RN_FABRIC_ENABLED
Class<RCTComponentViewProtocol> RNSFullWindowOverlayCls(void)
{
  return RNSFullWindowOverlay.class;
}
#endif // RN_FABRIC_ENABLED

@implementation RNSFullWindowOverlayManager

RCT_EXPORT_MODULE()

#ifdef RN_FABRIC_ENABLED
#else
- (UIView *)view
{
  return [[RNSFullWindowOverlay alloc] initWithBridge:self.bridge];
}
#endif // RN_FABRIC_ENABLED

@end
