#pragma once

#import <Foundation/Foundation.h>
#import "RNSFormSheetProviders.h"

@class RNSFormSheetContentController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetPresentationManager : NSObject

- (void)updatePresentationIfNeededWithProvider:(id<RNSFormSheetPresentationProvider>)provider
                                    controller:(RNSFormSheetContentController *)controller;

/**
 * Transitions the manager into the dismissed state in response to a dismissal that this manager
 * did not itself initiate (an interactive swipe, or a dismissal cascaded down from a lower sheet).
 *
 * @return NO if the manager was already dismissed or is mid programmatic dismissal.
 *         YES otherwise.
 */
- (BOOL)handleNativeDismiss;

@end

NS_ASSUME_NONNULL_END
