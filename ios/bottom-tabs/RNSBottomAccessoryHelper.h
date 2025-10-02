#import <UIKit/UIKit.h>
#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomTabsAccessoryWrapperView.h"

NS_ASSUME_NONNULL_BEGIN

API_AVAILABLE(ios(26.0))
@interface RNSBottomAccessoryHelper : NSObject

- (instancetype)initWithWrapperView: (RNSBottomTabsAccessoryWrapperView*)wrapperView bottomAccessoryView:(RNSBottomTabsAccessoryComponentView *)bottomAccessoryView;
- (void)setDestinationFrame:(CGRect)destinationFrame;

@end

NS_ASSUME_NONNULL_END
