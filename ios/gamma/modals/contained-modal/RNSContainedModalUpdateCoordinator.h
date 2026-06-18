#pragma once

#import <Foundation/Foundation.h>

#import "RNSContainedModalUpdateFlags.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSContainedModalUpdateCoordinator : NSObject

- (void)setNeeds:(RNSContainedModalUpdateFlags)flags;

- (BOOL)needsAll:(RNSContainedModalUpdateFlags)flags;
- (BOOL)needsAny:(RNSContainedModalUpdateFlags)flags;

- (void)updateIfNeeded:(RNSContainedModalUpdateFlags)flags performOperations:(dispatch_block_t)block;
- (void)updateIfAnyNeeded:(RNSContainedModalUpdateFlags)flags performOperations:(dispatch_block_t)block;

@end

NS_ASSUME_NONNULL_END
