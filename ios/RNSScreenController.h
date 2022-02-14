#import <UIKit/UIKit.h>

@interface RNSScreenController : UIViewController

- (instancetype)initWithView:(UIView *)view;
- (void)takeSnapshot;
- (void)setViewToSnapshot;
- (void)resetViewToScreen;

@end
