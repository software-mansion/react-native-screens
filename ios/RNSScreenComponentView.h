#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>
#import "RNSScreenController.h"

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSScreenSwipeDirection) {
  RNSScreenSwipeDirectionHorizontal,
  RNSScreenSwipeDirectionVertical,
};

@interface RNSScreenComponentView : RCTViewComponentView

@property (weak, nonatomic) UIView *reactSuperview;
@property (weak, nonatomic) UIView *config;
@property (nonatomic, retain) RNSScreenController *controller;

@property (nonatomic) BOOL fullScreenSwipeEnabled;
@property (nonatomic) BOOL gestureEnabled;
@property (nonatomic) RNSScreenSwipeDirection swipeDirection;

- (void)notifyWillAppear;
- (void)notifyWillDisappear;
- (void)notifyAppear;
- (void)notifyDisappear;
- (void)updateBounds;
- (void)notifyDismissedWithCount:(int)dismissCount;

@end

NS_ASSUME_NONNULL_END
