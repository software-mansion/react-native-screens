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

      if ([start isKindOfClass:[RCTImageView class]]) {
        //        snapshot = [[RCTImageView alloc] initWithBridge:[screenView bridge]];
        //        ((RCTImageView *)snapshot).defaultImage = ((RCTImageView *)start).image;
        snapshot = [[UIImageView alloc] initWithImage:((RCTImageView *)start).image];
        snapshot.contentMode = (UIViewContentMode)((RCTImageView *)start).resizeMode;
        snapshot.frame = start.frame;
      } else if ([start isKindOfClass:[RCTTextView class]]) {
        NSTextStorage *fromTextStorage = [start valueForKey:@"textStorage"];
        NSTextContainer *fromTextContainer = fromTextStorage.layoutManagers.firstObject.textContainers.firstObject;
        snapshot = [[UITextView alloc] initWithFrame:start.frame textContainer:fromTextContainer];
      } else {
        snapshot = [[UIView alloc] initWithFrame:start.frame];
      }

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
      start.hidden = YES;
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
  if ([snapshot isKindOfClass:[UITextView class]]) {
    NSTextStorage *fromTextStorage = [view valueForKey:@"textStorage"];
    NSTextContainer *fromTextContainer = fromTextStorage.layoutManagers.firstObject.textContainers.firstObject;
    CGSize fromSize = fromTextContainer.size;

    NSTextStorage *snapshotTextStorage = [snapshot valueForKey:@"textStorage"];
    NSTextContainer *snapshotTextContainer = snapshotTextStorage.layoutManagers.firstObject.textContainers.firstObject;
    snapshotTextContainer.size = fromSize;
  } else if ([snapshot isKindOfClass:[UIImageView class]]) {
  }
  snapshot.layer.backgroundColor = view.backgroundColor.CGColor;
}

+ (void)calculateFramesOfSharedElementsWithProgress:(double)progress
                                          container:(UIView *)container
                                     sharedElements:(NSMutableArray<NSArray *> *)sharedElements
                                             toView:(UIView *)toView
{
  for (NSArray *sharedElement in sharedElements) {
    UIView *endingView = sharedElement[1];
    UIView *snapshotView = sharedElement[2];
    NSDictionary *originalValues = sharedElement[3];
    CGRect startFrame = [[originalValues objectForKey:@"convertedStartFrame"] CGRectValue];
    CGRect toFrame = [container convertRect:endingView.frame fromView:toView];
    snapshotView.frame = CGRectMake(
        [RNSSharedElementAnimator interpolateWithFrom:startFrame.origin.x to:toFrame.origin.x progress:progress],
        [RNSSharedElementAnimator interpolateWithFrom:startFrame.origin.y to:toFrame.origin.y progress:progress],
        [RNSSharedElementAnimator interpolateWithFrom:startFrame.size.width to:toFrame.size.width progress:progress],
        [RNSSharedElementAnimator interpolateWithFrom:startFrame.size.height to:toFrame.size.height progress:progress]);
    if ([snapshotView isKindOfClass:[UITextView class]]) {
      UIView *fromView = sharedElement[0];
      NSTextStorage *fromTextStorage = [fromView valueForKey:@"textStorage"];
      NSRange range1;
      NSAttributedString *fromAttributes =
          [fromTextStorage attributedSubstringFromRange:NSMakeRange(0, fromTextStorage.string.length)];
      UIFont *fromFont = [fromAttributes attribute:NSFontAttributeName
                                           atIndex:0
                             longestEffectiveRange:&range1
                                           inRange:NSMakeRange(0, fromTextStorage.string.length)];

      NSTextStorage *toTextStorage = [endingView valueForKey:@"textStorage"];
      NSAttributedString *toAttributes =
          [toTextStorage attributedSubstringFromRange:NSMakeRange(0, toTextStorage.string.length)];
      UIFont *toFont = [toAttributes attribute:NSFontAttributeName
                                       atIndex:0
                         longestEffectiveRange:&range1
                                       inRange:NSMakeRange(0, toTextStorage.string.length)];

      NSRange range = NSMakeRange(0, fromTextStorage.string.length);
      CGFloat pointSize = [RNSSharedElementAnimator interpolateWithFrom:fromFont.pointSize
                                                                     to:toFont.pointSize
                                                               progress:progress];
      NSTextStorage *snapshotTextStorage = [snapshotView valueForKey:@"textStorage"];
      NSAttributedString *snapshotAttributes =
          [snapshotTextStorage attributedSubstringFromRange:NSMakeRange(0, snapshotTextStorage.string.length)];
      UIFont *snapshotFont = [snapshotAttributes attribute:NSFontAttributeName
                                                   atIndex:0
                                     longestEffectiveRange:&range1
                                                   inRange:NSMakeRange(0, snapshotTextStorage.string.length)];

      [snapshotTextStorage addAttribute:NSFontAttributeName value:[snapshotFont fontWithSize:pointSize] range:range];
    }
  }
}

@end
