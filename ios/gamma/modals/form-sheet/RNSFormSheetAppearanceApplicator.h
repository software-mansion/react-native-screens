#pragma once

#import <Foundation/Foundation.h>
#import "RNSFormSheetProviders.h"

@class RNSFormSheetUpdateCoordinator;
@class RNSFormSheetContentController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetAppearanceApplicator : NSObject

- (void)updateAppearanceIfNeededWithAppearanceProvider:(id<RNSFormSheetAppearanceProvider>)appearanceProvider
                                      behaviorProvider:(id<RNSFormSheetBehaviorProvider>)behaviorProvider
                                            controller:(RNSFormSheetContentController *)controller
                                           coordinator:(RNSFormSheetAppearanceCoordinator *)coordinator;

- (void)resetInitialDetent;

@end

NS_ASSUME_NONNULL_END
