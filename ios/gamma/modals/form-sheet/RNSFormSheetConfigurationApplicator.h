#pragma once

#import <Foundation/Foundation.h>
#import "RNSFormSheetProviders.h"

@class RNSFormSheetUpdateCoordinator;
@class RNSFormSheetContentController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetConfigurationApplicator : NSObject

- (void)applyConfigurationIfNeededWithAppearanceProvider:(id<RNSFormSheetAppearanceProvider>)appearanceProvider
                                        behaviorProvider:(id<RNSFormSheetBehaviorProvider>)behaviorProvider
                                              controller:(RNSFormSheetContentController *)controller
                                             coordinator:(RNSFormSheetUpdateCoordinator *)coordinator;

- (void)resetInitialDetent;

@end

NS_ASSUME_NONNULL_END
