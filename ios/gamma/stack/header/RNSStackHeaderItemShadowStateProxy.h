#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSStackHeaderItemShadowStateProxy
 * @brief Tracks frame changes for stack header item shadow state updates.
 */
@interface RNSStackHeaderItemShadowStateProxy : NSObject

/**
 * Updates the tracked frame if it differs from the previously recorded frame.
 *
 * @return YES if the frame was updated, NO if the frame is unchanged.
 */
- (BOOL)updateShadowStateWithFrame:(CGRect)frame;

/**
 * Resets internal properties.
 */
- (void)invalidate;

@end

NS_ASSUME_NONNULL_END
