#pragma once

#import <Foundation/Foundation.h>
#import "RNSSheetPresentationState.h"
#import "RNSSheetProviders.h"

@class RNSSheetContentController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSSheetPresentationManager : NSObject

/// Current step of the present / dismiss cycle.
@property (nonatomic, readonly) RNSSheetPresentationState state;

- (void)updatePresentationIfNeededWithProvider:(id<RNSSheetPresentationProvider>)provider
                                    controller:(RNSSheetContentController *)controller;

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
