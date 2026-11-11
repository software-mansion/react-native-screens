#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * The presented controller's root view. Children are mounted straight into it
 * with the UIKit subview API; it only presets the background and the
 * autoresizing mask so it keeps filling the presentation container.
 */
@interface RNSContainedModalContentView : UIView

@end

NS_ASSUME_NONNULL_END
