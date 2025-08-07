#import <Foundation/Foundation.h>

#import "RNSSplitViewHostComponentView.h"

/**
 * @protocol RNSFrameCorrectionProvider3097
 * @brief Temporal solution for registering view for being notified when the split view layout is changed
 *
 * It resolves problems with jumping content in the SplitView, until we'd have synchronous updates.
 */
@protocol RNSFrameCorrectionProvider3097 <NSObject>

/**
 * @brief Responsible for adding `view` to the SplitView set for observing views that need to adapt layout on SplitView
 * layout update.
 *
 * As for now, it should find a proper `RNSSplitViewScreenComponentView` and use
 * `RNSSplitViewScreenComponentView::registerForFrameUpdates`.
 */
- (void)registerForSplitView;

/**
 * @brief Responsible for removing `view` from the SplitView set for observing views that need to adapt layout on
 * SplitView layout update.
 *
 * As for now, it should find a proper `RNSSplitViewScreenComponentView` and use
 * `RNSSplitViewScreenComponentView::unregisterFromFrameUpdates`.
 */
- (void)unregisterFromSplitView;

@end
