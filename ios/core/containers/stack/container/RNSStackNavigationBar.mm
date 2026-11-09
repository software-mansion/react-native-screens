#import "RNSStackNavigationBar.h"
#import "RNSDefines.h"
#import "RNSStackHeaderItemWrapperView.h"
#import "UINavigationBar+RNSUtility.h"

static void *const RNSBackButtonMenuEnabledKVOContext = (void *)&RNSBackButtonMenuEnabledKVOContext;

@implementation RNSStackNavigationBar
#if !TARGET_OS_TV
{
  UIControl *_Nullable _observedBackButtonWrapper;
}
#endif // !TARGET_OS_TV

#pragma mark - Hit testing

/**
 * UIKit stops hit-testing at the bounds of a bar button item, so React content of a header item that reaches
 * outside of them (hit slop, a custom view larger than the item) would not receive touches. The content is
 * hit-tested directly first.
 */
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  if (CGRectContainsPoint(self.bounds, point)) {
    UIView *contentHit = [self hitTestHeaderItemContentAtPoint:point withEvent:event];
    if (contentHit != nil) {
      return contentHit;
    }
  }
  return [super hitTest:point withEvent:event];
}

- (nullable UIView *)hitTestHeaderItemContentAtPoint:(CGPoint)point withEvent:(UIEvent *)event
{
  for (UIView *customView in [[self topItemCustomViews] reverseObjectEnumerator]) {
    if ([customView isKindOfClass:RNSStackHeaderItemWrapperView.class] && customView.window != nil) {
      // The wrapper holds the React item view as its only subview.
      UIView *itemView = customView.subviews.firstObject;
      for (UIView *hitableView in [itemView.subviews reverseObjectEnumerator]) {
        CGPoint convertedPoint = [self convertPoint:point toView:hitableView];
        UIView *hitTestResult = [hitableView hitTest:convertedPoint withEvent:event];

        if (hitTestResult != nil) {
          return hitTestResult;
        }
      }
    }
  }
  return nil;
}

/**
 * Custom views of the bar button items and the title views of the top navigation item.
 */
- (NSArray<UIView *> *)topItemCustomViews
{
  UINavigationItem *topItem = self.topItem;
  NSMutableArray<UIView *> *customViews = [NSMutableArray array];
  for (UIBarButtonItem *item in topItem.leftBarButtonItems) {
    if (item.customView != nil) {
      [customViews addObject:item.customView];
    }
  }
  for (UIBarButtonItem *item in topItem.rightBarButtonItems) {
    if (item.customView != nil) {
      [customViews addObject:item.customView];
    }
  }
  if (topItem.titleView != nil) {
    [customViews addObject:topItem.titleView];
  }
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (topItem.subtitleView != nil) {
      [customViews addObject:topItem.subtitleView];
    }
    if (topItem.largeSubtitleView != nil) {
      [customViews addObject:topItem.largeSubtitleView];
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  return customViews;
}

#if !TARGET_OS_TV

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

#endif // !TARGET_OS_TV

@end
