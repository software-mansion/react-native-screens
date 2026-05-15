#pragma once

#import <Foundation/Foundation.h>

@class RNSFormSheetAppearanceCoordinator;
@class RNSFormSheetContentController;
@class RNSFormSheetHostComponentView;

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetAppearanceApplicator : NSObject

- (void)updateAppearanceIfNeededForHost:(RNSFormSheetHostComponentView *)host
                             controller:(RNSFormSheetContentController *)controller
                            coordinator:(RNSFormSheetAppearanceCoordinator *)coordinator;

- (void)resetInitialDetent;

@end

NS_ASSUME_NONNULL_END
