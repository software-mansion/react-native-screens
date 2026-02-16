#import <UIKit/UIKit.h>

#import "RNSReactBaseView.h"

@class RNSBarView;

NS_ASSUME_NONNULL_BEGIN

@interface RNSBarSpacerView : RNSReactBaseView

@property (nonatomic, weak, nullable) RNSBarView *barParent;
@property (nonatomic, strong, nullable) NSNumber *size;

@end

NS_ASSUME_NONNULL_END
