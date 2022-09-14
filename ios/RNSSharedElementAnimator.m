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

+ (NSMutableArray<SharedElementConfig *> *)
    getSharedElementsForCurrentTransition:(UIViewController *)currentViewController
                     targetViewController:(UIViewController *)targetViewController
{
  NSMutableArray<SharedElementConfig *> *sharedElementsArray = [NSMutableArray new];
  RNSScreenView *screenView = (RNSScreenView *)currentViewController.view;

  RCTUIManager *uiManager = [screenView bridge].uiManager;
  NSNumber *rootTag = screenView.rootTag;
  for (NSString *key in [_delegate.sharedElementsIterationOrder reverseObjectEnumerator]) {
    NSArray<SharedViewConfig *> *sharedViewConfigs = _delegate.sharedTransitionsItems[key];
    UIView *fromView, *toView;
    for (SharedViewConfig *sharedViewConfig in sharedViewConfigs) {
      UIView *view = [uiManager viewForReactTag:sharedViewConfig.viewTag];
      if (view == nil) {
        view = [sharedViewConfig getView];
      } else {
        [sharedViewConfig setView:view];
      }
      UIViewController *viewViewController = view.reactViewController;
      if (viewViewController == currentViewController) {
        fromView = view;
      }
      if (viewViewController == targetViewController) {
        toView = view;
      }
    }

    BOOL isAnyNull = fromView == nil || toView == nil;
    BOOL hasCorrectRootTag = [fromView rootTag] == rootTag && [toView rootTag] == rootTag;
    if (isAnyNull || !hasCorrectRootTag) {
      continue;
    }

    if (fromView != nil && toView != nil) {
      SharedElementConfig *sharedElementConfig = [[SharedElementConfig alloc] initWithFromView:fromView
                                                                                        toView:toView
                                                                                 fromContainer:fromView.reactSuperview
                                                                                 fromViewFrame:fromView.frame];
      [sharedElementsArray addObject:sharedElementConfig];
    }
  }

  // we reparent starting view and animate it, then reparent it back after the transition
  for (SharedElementConfig *sharedElementConfig in [sharedElementsArray reverseObjectEnumerator]) {
    UIView *start = sharedElementConfig.fromView;
    UIView *end = sharedElementConfig.toView;
    [_delegate makeSnapshot:start withViewController:sharedElementConfig.fromContainer];
    [_delegate makeSnapshot:end withViewController:end.superview];

    UIView *startContainer = start.reactSuperview;
    int startIndex = (int)[[startContainer reactSubviews] indexOfObject:start];
    [start removeFromSuperview];
    end.hidden = YES;
    sharedElementConfig.fromViewIndex = startIndex;
  }

  [_delegate afterPreparingCallback];

  return sharedElementsArray;
}

+ (void)notifyAboutViewDidDisappear:(UIView *)screeen
{
  [_delegate notifyAboutViewDidDisappear:screeen];
}

@end
