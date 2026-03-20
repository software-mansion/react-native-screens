#pragma once

#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTViewComponentView.h>
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^OnLayoutCallback)(CGRect frame);

@interface RNSScreenFooter : RCTViewComponentView

@property (nonatomic, copy, nullable) OnLayoutCallback onLayout;

@end

@interface RNSScreenFooterManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
