#import "RNSStackNavigationBar.h"
#import "RNSStackHeaderItemWrapperView.h"
#import "UINavigationBar+RNSUtility.h"

static void *const RNSBackButtonMenuEnabledKVOContext = (void *)&RNSBackButtonMenuEnabledKVOContext;

@implementation RNSStackNavigationBar
#if !TARGET_OS_TV
{
  UIControl *_Nullable _observedBackButtonWrapper;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _backButtonMenuEnabled = YES;
  }
  return self;
}

- (void)setBackButtonMenuEnabled:(BOOL)backButtonMenuEnabled
{
  _backButtonMenuEnabled = backButtonMenuEnabled;
  [self enforceBackButtonMenuState];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  // The back button wrapper may have been replaced by this layout pass
  [self enforceBackButtonMenuState];
}

- (void)enforceBackButtonMenuState
{
  UIView *wrapperView = [self rnscreens_findBackButtonWrapperView];
  if (wrapperView != _observedBackButtonWrapper) {
    [_observedBackButtonWrapper removeObserver:self
                                    forKeyPath:@"contextMenuInteractionEnabled"
                                       context:RNSBackButtonMenuEnabledKVOContext];
    _observedBackButtonWrapper = nil;

    if ([wrapperView isKindOfClass:UIControl.class]) {
      _observedBackButtonWrapper = (UIControl *)wrapperView;
      [_observedBackButtonWrapper addObserver:self
                                   forKeyPath:@"contextMenuInteractionEnabled"
                                      options:NSKeyValueObservingOptionNew
                                      context:RNSBackButtonMenuEnabledKVOContext];
    }
  }

  _observedBackButtonWrapper.contextMenuInteractionEnabled = _backButtonMenuEnabled;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  if (context != RNSBackButtonMenuEnabledKVOContext) {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    return;
  }

  // UIKit re-asserts the interaction on every back button reconfigure
  // - flip it back off immediately.
  if (!_backButtonMenuEnabled && [change[NSKeyValueChangeNewKey] boolValue] && object == _observedBackButtonWrapper) {
    _observedBackButtonWrapper.contextMenuInteractionEnabled = NO;
  }
}

- (void)dealloc
{
  [_observedBackButtonWrapper removeObserver:self
                                  forKeyPath:@"contextMenuInteractionEnabled"
                                     context:RNSBackButtonMenuEnabledKVOContext];
}

#pragma mark - Hit testing

/**
 * The content of a header item can reach outside the view that wraps it, and it would not
 * receive touches there. So the bar hit-tests that content itself first.
 */
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  if (CGRectContainsPoint(self.bounds, point)) {
    UIView *contentHitView = [self hitTestHeaderItemContentInView:self atPoint:point withEvent:event];
    if (contentHitView != nil) {
      return contentHitView;
    }
  }
  return [super hitTest:point withEvent:event];
}

- (nullable UIView *)hitTestHeaderItemContentInView:(UIView *)view atPoint:(CGPoint)point withEvent:(UIEvent *)event
{
  if ([view isKindOfClass:RNSStackHeaderItemWrapperView.class]) {
    return [self hitTestContentOfHeaderItemWrapperView:view atPoint:point withEvent:event];
  }

  for (UIView *subview in [view.subviews reverseObjectEnumerator]) {
    UIView *hitView = [self hitTestHeaderItemContentInView:subview atPoint:point withEvent:event];
    if (hitView != nil) {
      return hitView;
    }
  }
  return nil;
}

- (nullable UIView *)hitTestContentOfHeaderItemWrapperView:(UIView *)wrapperView
                                                   atPoint:(CGPoint)point
                                                 withEvent:(UIEvent *)event
{
  UIView *contentView = wrapperView.subviews.firstObject;
  for (UIView *hitableView in [contentView.subviews reverseObjectEnumerator]) {
    UIView *hitView = [hitableView hitTest:[self convertPoint:point toView:hitableView] withEvent:event];
    if (hitView != nil) {
      return hitView;
    }
  }
  return nil;
}

#endif // !TARGET_OS_TV

@end
