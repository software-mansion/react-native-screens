#import <Foundation/Foundation.h>

#import "RNSSplitViewHostComponentView.h"

/**
 * @protocol RNSFrameCorrectionProvider
 * @brief Temporal solution for registering view for being notified when the split view layout is changed
 *
 * @remarks - It's a workaround until we have synchronous updates:
 * https://github.com/software-mansion/react-native-screens-labs/issues/374
 *
 * It resolves problems with jumping content in the SplitView, until we'd have synchronous updates.
 */
@protocol RNSFrameCorrectionProvider <NSObject>

/**
 * @brief Responsible for adding `view` to the SplitView set for observing views that need to adapt layout on SplitView
 * layout update.
 *
 * @param view - UIView which subscribes for SplitViewScreen layout updates
 */
- (void)registerForFrameCorrection:(nonnull UIView *)view;

/**
 * @brief Responsible for removing `view` from the SplitView set for observing views that need to adapt layout on
 * SplitView layout update.
 *
 * @param view - UIView which unsubscribes for SplitViewScreen layout updates
 */
- (void)unregisterFromFrameCorrection:(nonnull UIView *)view;

@end
