#import <React/RCTViewManager.h>
#import <React/RCTView.h>
#import <React/RCTComponent.h>
#import "RNSScreenContainer.h"

@class RNSScreenContainerView;

typedef NS_ENUM(NSInteger, RNSScreenStackPresentation) {
  RNSScreenStackPresentationPush,
  RNSScreenStackPresentationModal,
  RNSScreenStackPresentationTransparentModal,
};

@interface RCTConvert (RNSScreen)

+ (RNSScreenStackPresentation)RNSScreenStackPresentation:(id)json;

@end

@interface RNSScreenManager : RCTViewManager
@end

@interface RNSScreenView : RCTView <RCTInvalidating>

@property (nonatomic, copy) RCTDirectEventBlock onDismissed;
@property (weak, nonatomic) UIView<RNSScreenContainerDelegate> *reactSuperview;
@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic) BOOL active;
@property (nonatomic) RNSScreenStackPresentation stackPresentation;
@property (nonatomic) BOOL animate;

- (void)notifyFinishTransitioning;

@end

@interface UIView (RNSScreen)
- (UIViewController *)parentViewController;
@end
