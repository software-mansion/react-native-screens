#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import "RCTViewComponentView.h"

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@interface RNSHeaderSubviewContentWrapper : RCTViewComponentView

@end

@interface RNSHeaderSubviewContentWrapperManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
