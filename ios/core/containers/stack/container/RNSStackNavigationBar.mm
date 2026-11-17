#import "RNSStackNavigationBar.h"
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

#endif // !TARGET_OS_TV

@end
