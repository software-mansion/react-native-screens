#import <React/RCTViewManager.h>
#import <React/RCTView.h>
#import <React/RCTComponent.h>
#import "RNSScreenContainer.h"

@class RNSScreenContainerView;

typedef NS_ENUM(NSInteger, RNSScreenStackPresentation) {
  RNSScreenStackPresentationPush,
  RNSScreenStackPresentationModal,
  RNSScreenStackPresentationTransparentModal,
  RNSScreenStackPresentationPopover,
};

typedef NS_ENUM(NSInteger, RNSScreenStackAnimation) {
  RNSScreenStackAnimationDefault,
  RNSScreenStackAnimationNone,
  RNSScreenStackAnimationFade,
};

@interface RCTConvert (RNSScreen)

+ (RNSScreenStackPresentation)RNSScreenStackPresentation:(id)json;
+ (RNSScreenStackAnimation)RNSScreenStackAnimation:(id)json;

@end

@interface RNSScreenManager : RCTViewManager
@end

@interface RNSScreenView : RCTView <RCTInvalidating>

@property (nonatomic, copy) RCTDirectEventBlock onDismissed;
@property (weak, nonatomic) UIView<RNSScreenContainerDelegate> *reactSuperview;
@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic) BOOL active;
@property (nonatomic) RNSScreenStackAnimation stackAnimation;
@property (nonatomic) RNSScreenStackPresentation stackPresentation;

/**
 nativeID for the native view containing the anchor rectangle for the popover.
 
 @see https://developer.apple.com/documentation/uikit/uipopoverpresentationcontroller/1622313-sourceview
 @see https://facebook.github.io/react-native/docs/view.html#nativeid
 */
@property (nullable, nonatomic, strong) NSString *popoverSourceViewNativeID;

/**
 The rectangle in the specified view in which to anchor the popover.
 
 @example: {x: 0, y: 0, width: 44, height: 44}
 @see https://developer.apple.com/documentation/uikit/uipopoverpresentationcontroller/1622324-sourcerect
 */
@property (nonatomic, assign) CGRect popoverSourceRect;

/**
 The arrow directions that you prefer for the popover.
 
 up: UIPopoverArrowDirectionUp = 1UL << 0,
 down: UIPopoverArrowDirectionDown = 1UL << 1,
 left: UIPopoverArrowDirectionLeft = 1UL << 2,
 right: UIPopoverArrowDirectionRight = 1UL << 3,
 
 @default: [up, down, left, right]
 @see https://developer.apple.com/documentation/uikit/uipopoverpresentationcontroller/1622319-permittedarrowdirections
 */
@property (nullable, nonatomic, strong) NSArray *popoverPermittedArrowDirections;

/**
 The preferred size for the view controller’s view.
 
 @example: {width: 300, height: 500}
 @see https://developer.apple.com/documentation/uikit/uiviewcontroller/1621476-preferredcontentsize
 */
@property (nonatomic, assign) CGSize preferredContentSize;

@property (nonatomic, assign, readonly) UIPopoverArrowDirection realPopoverPermittedArrowDirections;

- (void)notifyFinishTransitioning;

@end

@interface UIView (RNSScreen)
- (UIViewController *)parentViewController;
@end
