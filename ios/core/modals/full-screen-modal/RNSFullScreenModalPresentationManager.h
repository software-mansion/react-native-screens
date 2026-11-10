#pragma once

#import <Foundation/Foundation.h>
#import "RNSFullScreenModalPresentationState.h"
#import "RNSFullScreenModalProviders.h"

@class RNSFullScreenModalContentController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSFullScreenModalPresentationManager : NSObject

/// Current step of the present / dismiss cycle.
@property (nonatomic, readonly) RNSFullScreenModalPresentationState state;

- (void)updatePresentationIfNeededWithProvider:(id<RNSFullScreenModalPresentationProvider>)provider
                                    controller:(RNSFullScreenModalContentController *)controller;

/**
 * Marks the presentation as on-screen. Driven by the content controller's
 * `viewDidAppear` - the only reliable signal that a presentation request was
 * actually performed.
 */
- (void)handleDidPresent;

/**
 * Driven by the content controller's `viewDidDisappear` once it has left the
 * presentation hierarchy. Completes a programmatic dismissal, or reports a
 * dismissal this manager did not initiate as a native one.
 */
- (void)handleDidLeavePresentationHierarchyWithProvider:(nullable id<RNSFullScreenModalPresentationProvider>)provider
                                             controller:(RNSFullScreenModalContentController *)controller;

@end

NS_ASSUME_NONNULL_END
