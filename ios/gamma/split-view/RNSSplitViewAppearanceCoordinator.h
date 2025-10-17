#import <Foundation/Foundation.h>
#import "RNSSplitViewAppearanceUpdateFlags.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * @brief A class that coordinates appearance updates for SplitViewHost.
 */
@interface RNSSplitViewAppearanceCoordinator : NSObject

- (void)needsUpdateForFlag:(RNSSplitViewAppearanceUpdateFlags)updateFlag;

/// If update is needed for flag, it triggers the block and clears the flag
- (void)updateIfNeeded:(RNSSplitViewAppearanceUpdateFlags)flag callback:(void (^)(void))callback;

/// Returns whether the given flag is marked for update
- (BOOL)isUpdateNeeded:(RNSSplitViewAppearanceUpdateFlags)flag;

@end

NS_ASSUME_NONNULL_END
