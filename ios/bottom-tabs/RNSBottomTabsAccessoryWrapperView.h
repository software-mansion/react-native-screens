#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsAccessoryComponentView;
@class RNSBottomAccessoryHelper;

API_AVAILABLE(ios(26.0))
@interface RNSBottomTabsAccessoryWrapperView : UIView

- (instancetype)initWithAccessoryView:(RNSBottomTabsAccessoryComponentView *)accessoryView;
- (void)registerForAccessoryFrameChanges;

@end

NS_ASSUME_NONNULL_END
