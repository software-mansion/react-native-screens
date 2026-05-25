#pragma once

#import <Foundation/Foundation.h>

#import "RNSFormSheetAppearanceUpdateFlags.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetAppearanceCoordinator : NSObject

- (void)setNeeds:(RNSFormSheetAppearanceUpdateFlags)flags;

- (BOOL)needsAll:(RNSFormSheetAppearanceUpdateFlags)flags;

- (void)updateIfNeeds:(RNSFormSheetAppearanceUpdateFlags)flags performOperations:(dispatch_block_t)block;

@end

NS_ASSUME_NONNULL_END
