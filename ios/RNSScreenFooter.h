#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

typedef void (^OnLayoutCallback)(CGRect frame);

@interface RNSScreenFooter :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    RCTView
#endif

@property (nonatomic, copy, nullable) OnLayoutCallback onLayout;

@end

@interface RNSScreenFooterManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
