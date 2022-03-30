#import <UIKit/UIKit.h>

@interface RNSScreenController : UIViewController

- (instancetype)initWithView:(UIView *)view;
- (void)setViewToSnapshot:(UIView *)snapshot;
- (void)resetViewToScreen;

@end
