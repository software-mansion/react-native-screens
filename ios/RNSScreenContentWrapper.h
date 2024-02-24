#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import "RCTView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSScreenContentWrapper;

@protocol RNSScreenContentWrapperDelegate <NSObject>

- (void)reactDidSetFrame:(CGRect)reactFrame forContentWrapper:(RNSScreenContentWrapper *)contentWrapepr;

@end

@interface RNSScreenContentWrapper : RCTView

@property (nonatomic, nullable, weak) id<RNSScreenContentWrapperDelegate> delegate;

@end

@interface RNSScreenContentWrapperManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
