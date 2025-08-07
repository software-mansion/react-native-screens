#if RNS_GAMMA_ENABLED

#import <Foundation/Foundation.h>
#import "RNSFrameCorrectionProvider3097.h"
#import "RNSSplitViewScreenComponentView.h"

@interface RNSFrameCorrector3097 : NSObject

/**
 * @brief Responsible for correcting the layout within the context of the SplitViewScreen
 *
 * SplitViewScreen should be an ancestor of the view for which we're applying the correction.
 * It works with an assumption that the target width of view for which we're
 * applying correction should be the same as the width of the SplitView column.
 *
 * @param view - view for which we're applying a correction (assuming that the view's width
 * should be equal with the SplitViewScreen width)
 * @param splitViewScreen - ancestor representing SplitView column for which we're applying layout correction
 */
+ (void)applyFrameCorrectionFor:(UIView *)view
     inContextOfSplitViewColumn:(RNSSplitViewScreenComponentView *)splitViewScreen;

@end

#endif // RNS_GAMMA_ENABLED
