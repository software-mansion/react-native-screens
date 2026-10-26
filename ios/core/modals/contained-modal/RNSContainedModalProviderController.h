#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * The presentation context for contained modals. `definesPresentationContext
 * == YES` makes UIKit anchor contained presentations here instead of walking
 * further up. Owned by `RNSContainedModalProviderView`, which keeps this
 * controller's view as its direct, exactly-filling subview; see that class for
 * why the attach point matters.
 */
@interface RNSContainedModalProviderController : UIViewController

@end

NS_ASSUME_NONNULL_END
