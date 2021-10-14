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

+ (float)interpolateWithFrom:(double)from to:(double)to progress:(double)progress
{
  return from + progress * (to - from);
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
      UIView *snapshot;

      if ([viewControllers containsObject:vc]) {
        // we are in previous vc and going forward
        start = fromView;
        end = toView;
      } else {
        // we are in next vc and going back
        start = toView;
        end = fromView;
      }

      snapshot = [[UIView alloc] initWithFrame:start.frame];

      snapshot.alpha = start.alpha;

      [RNSSharedElementAnimator copyValuesFromView:start toSnapshot:snapshot];

      UIViewController *lowestVC = vc;
      // containerView operates on current VCs, and we might transition from a screen in a nested stack
      // so we need to get to the lowest ScreenView for correct frames
      while ([[lowestVC childViewControllers] count] > 0) {
        lowestVC = lowestVC.childViewControllers[lowestVC.childViewControllers.count - 1];
      }

      // we are always the vc that is going to be closed so the starting rect must be converted from our perspective
      CGRect startFrame = [vc.transitionCoordinator.containerView convertRect:start.frame fromView:lowestVC.view];

      NSDictionary *originalValues = @{
        @"endAlpha" : @(end.alpha),
        @"convertedStartFrame" : @(startFrame),
      };

      // we hide those views for during the transition, hidden on ending view does not work for some reason
      start.alpha = 0;
      end.alpha = 0;
      if (start != nil && end != nil && snapshot != nil) {
        [sharedElementsArray addObject:@[ start, end, snapshot, originalValues ]];
      }
    }
  }
  return sharedElementsArray;
}

+ (void)copyValuesFromView:(UIView *)view toSnapshot:(UIView *)snapshot
{
  snapshot.layer.backgroundColor = view.backgroundColor.CGColor;
}

+ (void)calculateFramesOfSharedElementsWithProgress:(double)progress
                                          container:(UIView *)container
                                     sharedElements:(NSMutableArray<NSArray *> *)sharedElements
                                             toView:(UIView *)toView
{
  for (NSArray *sharedElement in sharedElements) {
    UIView *startingView = sharedElement[0];
    RNSScreenView *startingScreenView = (RNSScreenView *)startingView.reactViewController.view;
    UIView *endingView = sharedElement[1];
    //    UIView *endingScreenView = endingView.reactViewController.view;
    UIView *snapshotView = sharedElement[2];
    [RNSSharedElementAnimator reanimatedMockTransitionWithConverterView:container
                                                                 fromID:startingView.reactTag
                                                                   toID:endingView.reactTag
                                                            viewToApply:snapshotView
                                                               progress:progress
                                                                rootTag:[startingScreenView rootTag]];
    //    NSDictionary *originalValues = sharedElement[3];
    //    CGRect startFrame = [[originalValues objectForKey:@"convertedStartFrame"] CGRectValue];
    //    CGRect toFrame = [container convertRect:endingView.frame fromView:endingScreenView];
    //    snapshotView.frame = toFrame;
    //    snapshotView.backgroundColor = endingView.backgroundColor;
    //    snapshotView.frame = CGRectMake(
    //        [RNSSharedElementAnimator interpolateWithFrom:startFrame.origin.x to:toFrame.origin.x progress:progress],
    //        [RNSSharedElementAnimator interpolateWithFrom:startFrame.origin.y to:toFrame.origin.y progress:progress],
    //        [RNSSharedElementAnimator interpolateWithFrom:startFrame.size.width to:toFrame.size.width
    //        progress:progress], [RNSSharedElementAnimator interpolateWithFrom:startFrame.size.height
    //        to:toFrame.size.height progress:progress]);
  }
}

+ (void)reanimatedMockTransitionWithConverterView:(UIView *)converter
                                           fromID:(NSNumber *)fromID
                                             toID:(NSNumber *)toID
                                      viewToApply:(UIView *)view
                                         progress:(float)progress
                                          rootTag:(NSNumber *)rootTag
{
  // UIView *fromView = [uiManager viewForNativeID:fromID withRootTag:rootTag];
  // UIView *fromScreenView = fromView.reactViewController.view;
  // UIView *toID = [uiManager viewForNativeID:toID withRootTag:rootTag];
  // UIView *toScreenView = endingView.reactViewController.view;
  // get all important values from both views
  // CGRect fromFrame = [converter convertRect:fromView.frame fromView:fromScreenView]; // converting starting frame to
  // proper container CGRect toFrame = [converter convertRect:toView.frame fromView:toScreenView]; // converting ending
  // frame to proper container apply all transformations between the views into the `viewToApply` with taking into
  // account the progress
}

@end
