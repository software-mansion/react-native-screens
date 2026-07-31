#pragma once

#import <Foundation/Foundation.h>

@class RNSStackHeaderMenuToggleStateTracker;

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuTrackerRegistry : NSObject

- (RNSStackHeaderMenuToggleStateTracker *)trackerForItemId:(NSString *)itemId;

- (void)resetTrackerForItemId:(NSString *)itemId;

- (void)clear;

@end

NS_ASSUME_NONNULL_END
