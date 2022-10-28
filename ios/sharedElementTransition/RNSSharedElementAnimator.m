#if __cplusplus
#import <RNScreens/RNSScreen.h>
#endif // __cplusplus
#import <RNScreens/RNSSharedElementAnimator.h>
#import <RNScreens/RNSSharedElementAnimatorDelegateMock.h>

#import <React/RCTUIManager.h>

@implementation RNSSharedElementAnimator

static NSObject<RNSSharedElementAnimatorDelegate> *_delegate;

+ (void)setDelegate:(NSObject<RNSSharedElementAnimatorDelegate> *)delegate
{
  _delegate = delegate;
}

+ (NSObject<RNSSharedElementAnimatorDelegate> *)getDelegate
{
  if (_delegate == nil) {
    _delegate = [RNSSharedElementAnimatorDelegateMock alloc];
  }
  return _delegate;
}

@end
