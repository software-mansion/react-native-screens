#import "RNSSharedElementAnimator.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTImageView.h>
#import <React/RCTShadowView.h>
#import <React/RCTTextView.h>
#import <React/RCTTouchHandler.h>
#import <React/RCTUIManager.h>
#import "RNSScreen.h"

// same hack as in header
@interface RCTImageView (Private)
- (UIImage *)image;
@end

@implementation RNSSharedElementAnimator

static NSObject<RNSSEA> *_delegate;

+ (void)setDelegate:(NSObject<RNSSEA> *)delegate
{
  _delegate = delegate;
}

+ (NSObject<RNSSEA> *)getDelegate
{
  return _delegate;
}

+ (NSMutableArray<NSArray *> *)prepareSharedElementsArrayForVC:(UIViewController *)vc closing:(BOOL)closing
{
  NSMutableArray<NSArray *> *sharedElementsArray = [NSMutableArray new];

  if (closing) {
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
  }
  return sharedElementsArray;
}

@end
