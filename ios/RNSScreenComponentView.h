#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>
#import "RNSScreenController.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenComponentView : RCTViewComponentView

@property (weak, nonatomic) UIView *reactSuperview;
@property (weak, nonatomic) UIView *config;
@property (nonatomic, retain) RNSScreenController *controller;

- (void)notifyWillAppear;
- (void)notifyWillDisappear;
- (void)notifyAppear;
- (void)notifyDisappear;
- (void)updateBounds;
- (void)notifyDismissedWithCount:(int)dismissCount;

@end

NS_ASSUME_NONNULL_END
