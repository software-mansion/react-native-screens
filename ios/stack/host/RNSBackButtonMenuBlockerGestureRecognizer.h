#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Passive recognizer that never recognizes: it stays in the Possible state
 * for as long as any touch it received is down and fails once they all end.
 * Recognizers that are made to require its failure (via a dynamic failure
 * requirement established in a delegate) therefore cannot fire while
 * a touch is down.
 */
@interface RNSBackButtonMenuBlockerGestureRecognizer : UIGestureRecognizer
@end

NS_ASSUME_NONNULL_END
