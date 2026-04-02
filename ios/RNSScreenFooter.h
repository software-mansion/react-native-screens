#pragma once

#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import "RNSReactBaseView.h"

#if defined(__cplusplus)
#import <React/RCTFabricComponentsPlugins.h>
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

typedef void (^OnLayoutCallback)(CGRect frame);

@interface RNSScreenFooter : RNSReactBaseView

@property (nonatomic, copy, nullable) OnLayoutCallback onLayout;

@end

@interface RNSScreenFooterManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
