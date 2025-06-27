#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackNavigationBarComponentView : RNSReactBaseView

@property (nonatomic, strong, readonly, nullable) NSString *title;

@end

@interface RNSScreenStackNavigationBarComponentView()

- (void)setNavigationItem:(UINavigationItem *)navigationItem;

@end

NS_ASSUME_NONNULL_END
