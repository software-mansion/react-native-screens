#pragma once

#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

#if defined(__cplusplus)
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTViewComponentView.h>
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

typedef void (^OnLayoutCallback)(CGRect frame);

#if defined(__cplusplus)
@interface RNSScreenFooter : RCTViewComponentView
#else
@interface RNSScreenFooter : UIView
#endif // __cplusplus

@property (nonatomic, copy, nullable) OnLayoutCallback onLayout;

@end

@interface RNSScreenFooterManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
