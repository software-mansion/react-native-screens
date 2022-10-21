#import "RNSSharedElementAnimator.h"
#import "RNSScreen.h"

#import <React/RCTUIManager.h>

@implementation SharedElementConfig

- (instancetype)initWithFromView:(UIView *)fromView
                          toView:(UIView *)toView
                   fromContainer:(UIView *)fromContainer
                   fromViewFrame:(CGRect)fromViewFrame
{
  if (self = [super init]) {
    _fromView = fromView;
    _toView = toView;
    _fromContainer = fromContainer;
    _fromViewFrame = fromViewFrame;
  }

  return self;
}

@end

@implementation RNSSharedElementAnimator

static NSObject<RNSSharedElementTransitionsDelegate> *_delegate;

+ (void)setDelegate:(NSObject<RNSSharedElementTransitionsDelegate> *)delegate
{
  _delegate = delegate;
}

+ (NSObject<RNSSharedElementTransitionsDelegate> *)getDelegate
{
  return _delegate;
}

+ (void)notifyAboutViewDidDisappear:(UIView *)screeen
{
  [_delegate notifyAboutViewDidDisappear:screeen];
}

@end
