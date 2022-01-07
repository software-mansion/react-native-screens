#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenController : UIViewController

- (instancetype)initWithView:(UIView *)view;

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
@end

NS_ASSUME_NONNULL_END
