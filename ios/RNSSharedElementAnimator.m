#import "RNSSharedElementAnimator.h"
#import "RNSScreen.h"

#import <React/RCTUIManager.h>

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

+ (NSMutableArray<NSArray *> *)prepareSharedElementsArrayForVC:(UIViewController *)vc
{
  NSMutableArray<NSArray *> *sharedElementsArray = [NSMutableArray new];

  NSArray<__kindof UIViewController *> *viewControllers = vc.navigationController.viewControllers;
  RNSScreenView *screenView = (RNSScreenView *)vc.view;

  for (NSDictionary *sharedElementDict in screenView.sharedElements) {
    UIView *fromView = [[screenView bridge].uiManager viewForNativeID:sharedElementDict[@"fromID"]
                                                          withRootTag:[screenView rootTag]];
    UIView *toView = [[screenView bridge].uiManager viewForNativeID:sharedElementDict[@"toID"]
                                                        withRootTag:[screenView rootTag]];

    if (fromView == nil || toView == nil) {
      break;
    }

    UIView *start;
    UIView *end;
    if ([viewControllers containsObject:vc]) {
      // we are in previous vc and going forward
      start = fromView;
      end = toView;
    } else {
      // we are in next vc and going back
      start = toView;
      end = fromView;
    }

    // we reparent starting view and animate it, then reparent it back after the transition
    UIView *startContainer = start.reactSuperview;
    int startIndex = (int)[[startContainer reactSubviews] indexOfObject:start];
    [start removeFromSuperview];

    end.hidden = YES;
    if (start != nil && end != nil) {
      [sharedElementsArray addObject:@[ start, end, startContainer, @(startIndex) ]];
    }
  }

  return sharedElementsArray;
}

@end
