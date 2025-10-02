#import "RNSBottomAccessoryHelper.h"

@implementation RNSBottomAccessoryHelper {
  CADisplayLink *_displayLink;    
  CGRect _previousFrame;
  CGRect _destinationFrame;
  RNSBottomTabsAccessoryComponentView *_bottomAccessoryView;
  RNSBottomTabsAccessoryWrapperView *_wrapperView;
}

- (instancetype)initWithWrapperView: (RNSBottomTabsAccessoryWrapperView*)wrapperView bottomAccessoryView:(RNSBottomTabsAccessoryComponentView *)bottomAccessoryView
{
  if (self = [super init]) {
    _bottomAccessoryView = bottomAccessoryView;
    _wrapperView = wrapperView;
    [_bottomAccessoryView registerForTraitChanges:@[[UITraitTabAccessoryEnvironment class]] withHandler:^(__kindof id<UITraitEnvironment>, UITraitCollection *previousTrairCollection){
//      [self setupDisplayLink];
    }];
  }
  
  return self;
}

- (void)setDestinationFrame:(CGRect)destinationFrame
{
  if (!CGRectEqualToRect(destinationFrame, _destinationFrame)) {
    _destinationFrame = destinationFrame;
    [self setupDisplayLink];
  }
}

- (void)setupDisplayLink
{
  NSLog(@"[bottomaccessory] setupDisplayLink");
  _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(handleDisplayLink:)];
  [_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)handleDisplayLink:(CADisplayLink *)sender {
  CGRect bottomAccessoryFrame = _bottomAccessoryView.superview.layer.presentationLayer.frame;
  if (!CGRectEqualToRect(bottomAccessoryFrame, _previousFrame)) {
    // TODO: update
    NSLog(@"[bottomaccessory] %@", NSStringFromCGRect(bottomAccessoryFrame));
    _previousFrame = bottomAccessoryFrame;
  }
  
  if (CGRectEqualToRect(bottomAccessoryFrame, _bottomAccessoryView.superview.frame)) {
    [self invalidateDisplayLink];
  }
}

- (void)invalidateDisplayLink {
  NSLog(@"[bottomaccessory] invalidate display link");
  [_displayLink invalidate];
  _displayLink = nil;
  _previousFrame = CGRectZero;
}

@end
