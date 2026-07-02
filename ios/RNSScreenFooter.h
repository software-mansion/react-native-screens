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

/**
 * Pins the footer to the bottom edge of its parent RNSScreenView, lifting it
 * above the keyboard when one overlaps the sheet. Idempotent - safe to call
 * from any layout pass (layout metrics updates, parent layoutSubviews,
 * keyboard frame changes).
 */
- (void)updateFooterPosition;

@end

@interface RNSScreenFooterManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
