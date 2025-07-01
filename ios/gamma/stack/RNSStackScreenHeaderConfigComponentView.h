#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackScreenHeaderConfigComponentView : RNSReactBaseView

@property (nonatomic, strong, readonly, nullable) NSString *title;

@end

@interface RNSStackScreenHeaderConfigComponentView()

- (void)setNavigationItem:(UINavigationItem *_Nullable)navigationItem;

@end

NS_ASSUME_NONNULL_END
