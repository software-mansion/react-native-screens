#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackComponentView : RCTViewComponentView
- (void)screenWillGoOut;
@end

@interface RNSScreenStackView : UIView
- (instancetype)initWithComponentView:(RNSScreenStackComponentView *)component;
@end

NS_ASSUME_NONNULL_END
