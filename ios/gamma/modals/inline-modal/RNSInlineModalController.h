#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSInlineModalController;

@protocol RNSInlineModalControllerDelegate <NSObject>
- (UIView *_Nullable)providerViewForInlineModalController:(RNSInlineModalController *)controller;
- (void)inlineModalControllerDidLayoutWithBounds:(CGRect)bounds;
@end

@interface RNSInlineModalController : UIViewController
@property (nonatomic, weak, nullable) id<RNSInlineModalControllerDelegate> delegate;
@end

NS_ASSUME_NONNULL_END
