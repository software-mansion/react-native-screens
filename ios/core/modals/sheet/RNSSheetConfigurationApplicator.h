#pragma once

#import <Foundation/Foundation.h>
#import "RNSSheetProviders.h"

@class RNSSheetUpdateCoordinator;
@class RNSSheetContentController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSSheetConfigurationApplicator : NSObject

+ (void)applyConfigurationIfNeededWithAppearanceProvider:(id<RNSSheetAppearanceProvider>)appearanceProvider
                                        behaviorProvider:(id<RNSSheetBehaviorProvider>)behaviorProvider
                                              controller:(RNSSheetContentController *)controller
                                             coordinator:(RNSSheetUpdateCoordinator *)coordinator;

@end

NS_ASSUME_NONNULL_END
