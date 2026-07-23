#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackHeaderItemComponentView;

/**
 * @class RNSStackHeaderItemShadowStateProxy
 * @brief Tracks frame changes for stack header item shadow state updates.
 */
@interface RNSStackHeaderItemShadowStateProxy : NSObject

- (instancetype)initWithHeaderItemView:(RNSStackHeaderItemComponentView *)headerItemView;

/**
 * Updates header item's frame in ShadowTree if new frame is different than previously sent frame.
 */
- (void)updateShadowStateWithFrame:(CGRect)frame;

/**
 * Resets internal properties.
 */
- (void)invalidate;

@end

NS_ASSUME_NONNULL_END
