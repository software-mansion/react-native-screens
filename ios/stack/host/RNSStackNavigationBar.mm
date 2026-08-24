#import "RNSStackNavigationBar.h"
#import "RNSBackButtonMenuBlockerGestureRecognizer.h"
#import "UINavigationBar+RNSUtility.h"

@interface RNSStackNavigationBar () <UIGestureRecognizerDelegate>
@end

@implementation RNSStackNavigationBar
#if !TARGET_OS_TV
{
  RNSBackButtonMenuBlockerGestureRecognizer *_menuBlocker;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (!(self = [super initWithFrame:frame])) {
    return nil;
  }

  _backButtonMenuEnabled = YES;
  _menuBlocker = [RNSBackButtonMenuBlockerGestureRecognizer new];
  _menuBlocker.delegate = self;
  [self addGestureRecognizer:_menuBlocker];

  return self;
}

#pragma mark - UIGestureRecognizerDelegate

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
    shouldBeRequiredToFailByGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
  if (gestureRecognizer != _menuBlocker || _backButtonMenuEnabled) {
    return NO;
  }
  return [self isBackButtonMenuRecognizer:otherGestureRecognizer];
}

- (BOOL)isBackButtonMenuRecognizer:(UIGestureRecognizer *)recognizer
{
  NSString *cls = NSStringFromClass(recognizer.class);
  if (![cls isEqualToString:@"_UITouchDurationObservingGestureRecognizer"] &&
      ![cls isEqualToString:@"_UISecondaryClickDriverGestureRecognizer"]) {
    return NO;
  }
  UIView *wrapperView = [self rnscreens_findBackButtonWrapperView];
  return wrapperView != nil && recognizer.view == wrapperView;
}

#endif // !TARGET_OS_TV

@end
