#pragma once

#if defined(__cplusplus)
#import <React/RCTViewManager.h>
#endif // __cplusplus
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

#if defined(__cplusplus)
@interface RNSScreenFooterManager : RCTViewManager
#else
@interface RNSScreenFooterManager : NSObject
#endif // __cplusplus

@end

NS_ASSUME_NONNULL_END
