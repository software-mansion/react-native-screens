#import <RNScreens/RNSScreen.h>
#import <RNScreens/RNSSharedElementAnimator.h>
#import <RNScreens/RNSSharedElementAnimatorDelegateMock.h>

#import <React/RCTUIManager.h>

@implementation RNSSharedElementAnimator

static NSObject<RNSSharedElementTransitionsDelegate> *_delegate;

+ (void)setDelegate:(NSObject<RNSSharedElementTransitionsDelegate> *)delegate
{
  _delegate = delegate;
}

+ (NSObject<RNSSharedElementTransitionsDelegate> *)getDelegate
{
  if (_delegate == nil) {
    _delegate = [RNSSharedElementAnimatorDelegateMock alloc];
  }
  return _delegate;
}

@end
