#pragma once

#import <Foundation/Foundation.h>

#import "RNSFormSheetAppearanceUpdateFlags.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetAppearanceCoordinator : NSObject

- (void)needs:(RNSFormSheetAppearanceUpdateFlags)flag;

- (BOOL)isNeeded:(RNSFormSheetAppearanceUpdateFlags)flag;

- (void)updateIfNeeded:(RNSFormSheetAppearanceUpdateFlags)flag performOperations:(dispatch_block_t)block;

@end

NS_ASSUME_NONNULL_END
