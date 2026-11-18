#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackNavigationController.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSSplitNavigationController
 * @brief A subclass of RNSStackNavigationController, creates a view that wraps view associated with
 * RNSSplitScreenController.
 */
@interface RNSSplitNavigationController : RNSStackNavigationController

@end

NS_ASSUME_NONNULL_END
