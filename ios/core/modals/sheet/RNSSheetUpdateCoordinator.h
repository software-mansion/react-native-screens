#pragma once

#import <Foundation/Foundation.h>

#import "RNSSheetUpdateFlags.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSheetUpdateCoordinator : NSObject

- (void)setNeeds:(RNSSheetUpdateFlags)flags;

- (BOOL)needsAll:(RNSSheetUpdateFlags)flags;
- (BOOL)needsAny:(RNSSheetUpdateFlags)flags;

- (void)updateIfNeeded:(RNSSheetUpdateFlags)flags performOperations:(dispatch_block_t)block;
- (void)updateIfAnyNeeded:(RNSSheetUpdateFlags)flags performOperations:(dispatch_block_t)block;

@end

NS_ASSUME_NONNULL_END
