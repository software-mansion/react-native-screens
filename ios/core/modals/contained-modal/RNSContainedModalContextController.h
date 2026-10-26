#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * The presentation context for contained modals: the controller contained
 * modals are presented from. Its view, an `RNSContainedModalContextView`, holds
 * the provider's React children; `definesPresentationContext == YES` makes
 * UIKit anchor contained presentations here instead of walking further up.
 * Owned by `RNSContainedModalProviderView`, which keeps this controller's view
 * as its direct, exactly-filling subview; see that class for why the attach
 * point matters.
 */
@interface RNSContainedModalContextController : UIViewController

@end

NS_ASSUME_NONNULL_END
