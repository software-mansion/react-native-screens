
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#endif

#import <React/RCTConvert.h>
#import <React/RCTViewManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSSearchBarBackground :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

@property (nonatomic, weak) UIView *reactSuperview;

@property (nonatomic, weak) RCTBridge *bridge;

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (instancetype)initWithBridge:(RCTBridge *)bridge;
#endif // RCT_NEW_ARCH_ENABLED

@end

@interface RNSSearchBarBackgroundManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
