#import "RNSFormSheetContentView.h"
#import <React/RCTSurfaceTouchHandler.h>

@implementation RNSFormSheetContentView {
  RCTSurfaceTouchHandler *_Nullable _touchHandler;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // Explicitly set to clearColor since this UIView is manually added
    // into the view hierarchy. This ensures it doesn't interfere with
    // any background colors defined by child React subviews.
    self.backgroundColor = [UIColor clearColor];
  }
  return self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    [self attachTouchHandler];
  } else {
    [self detachTouchHandler];
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];

  if (_touchHandler != nil) {
    // Touch handler requires absolute positioning coordinates, relatively to root (UIWindow)
    CGPoint contentViewOriginInWindow = [self convertPoint:CGPointZero toView:nil];
    _touchHandler.viewOriginOffset = contentViewOriginInWindow;
  }
}

- (void)invalidate
{
  [self detachTouchHandler];
}

#pragma mark - Touch handling

- (void)attachTouchHandler
{
  if (_touchHandler == nil) {
    _touchHandler = [RCTSurfaceTouchHandler new];
    [_touchHandler attachToView:self];
  }
}

- (void)detachTouchHandler
{
  if (_touchHandler != nil) {
    [_touchHandler detachFromView:self];
    _touchHandler = nil;
  }
}

#pragma mark - RN Subviews Management

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)index
{
  [self insertSubview:subview atIndex:index];
}

- (void)removeReactSubview:(UIView *)subview
{
  [subview removeFromSuperview];
}

@end
