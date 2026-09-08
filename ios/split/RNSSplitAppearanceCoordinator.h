#pragma once

#import <Foundation/Foundation.h>
#import "RNSSplitAppearanceUpdateFlags.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * @brief - A class that is responsible for coordinating SplitHost appearance updates.
 *
 * It collects flags for Split appearance update actions and invalidates them.
 * It's also responsible for executing callbacks when the action is requested.
 */
@interface RNSSplitAppearanceCoordinator : NSObject

@property (nonatomic) RNSSplitAppearanceUpdateFlags updateFlags;

- (void)needs:(RNSSplitAppearanceUpdateFlags)updateFlag;

- (void)updateIfNeeded:(RNSSplitAppearanceUpdateFlags)updateFlag updateCallback:(void (^)(void))updateCallback;

- (BOOL)isNeeded:(RNSSplitAppearanceUpdateFlags)updateFlag;

@end

NS_ASSUME_NONNULL_END
