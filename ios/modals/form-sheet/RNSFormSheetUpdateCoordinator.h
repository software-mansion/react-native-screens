#pragma once

#import <Foundation/Foundation.h>

#import "RNSFormSheetUpdateFlags.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetUpdateCoordinator : NSObject

- (void)setNeeds:(RNSFormSheetUpdateFlags)flags;

- (BOOL)needsAll:(RNSFormSheetUpdateFlags)flags;
- (BOOL)needsAny:(RNSFormSheetUpdateFlags)flags;

- (void)updateIfNeeded:(RNSFormSheetUpdateFlags)flags performOperations:(dispatch_block_t)block;
- (void)updateIfAnyNeeded:(RNSFormSheetUpdateFlags)flags performOperations:(dispatch_block_t)block;

@end

NS_ASSUME_NONNULL_END
