#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@class RNSScreenContentWrapper;

@protocol RNSScreenContentWrapperDelegate <NSObject>

- (void)reactDidSetFrame:(CGRect)reactFrame forContentWrapper:(RNSScreenContentWrapper *)contentWrapepr;

@end

@interface RNSScreenContentWrapper :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    RCTView
#endif

@property (nonatomic, nullable, weak) id<RNSScreenContentWrapperDelegate> delegate;

@end

@interface RNSScreenContentWrapperManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
