#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenController : UIViewController

- (instancetype)initWithView:(UIView *)view;
- (void)setViewToSnapshot;
- (void)resetViewToScreen;

@end

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
