#pragma once

#import <Foundation/Foundation.h>
#import "RNSContainedModalProviders.h"

@class RNSContainedModalContentController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSContainedModalPresentationManager : NSObject

- (void)updatePresentationIfNeededWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                                    controller:(RNSContainedModalContentController *)controller;

/**
 * Marks the presentation as on-screen. Driven by the content controller's
 * `viewDidAppear` - the only reliable signal that a presentation request was
 * actually performed (UIKit may defer a request past a parent transition and
 * never call its completion).
 */
- (void)handleDidPresent;

@end

NS_ASSUME_NONNULL_END
