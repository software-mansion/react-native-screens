#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

@class RNSBarView;

NS_ASSUME_NONNULL_BEGIN

@interface RNSBarSpacerView : RCTViewComponentView

@property (nonatomic, weak, nullable) RNSBarView *barParent;
@property (nonatomic, strong, nullable) NSNumber *size;

@end

NS_ASSUME_NONNULL_END
