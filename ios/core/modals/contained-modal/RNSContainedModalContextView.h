#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * The context controller's root view: the provider's React children are
 * mounted straight into it with the UIKit subview API. It only presets the
 * background and the autoresizing mask; the provider component view (the
 * wrapper) owns its geometry, and the mask keeps it filling the wrapper between
 * explicit layout passes.
 */
@interface RNSContainedModalContextView : UIView

@end

NS_ASSUME_NONNULL_END
