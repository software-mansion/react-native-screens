#pragma once

#import <Foundation/Foundation.h>

@class RNSScrollViewMarkerComponentView;

@protocol RNSScrollViewSeeking <NSObject>

/**
 *  Call this method to register a ScrollView wrapped by marker with an interested component (receiver).
 */
- (void)registerDescendantScrollView:(nonnull UIScrollView *)scrollView
                          fromMarker:(nonnull RNSScrollViewMarkerComponentView *)marker;

@optional

/**
 *  Called when the marker that registered `scrollView` is removed. Implementations should drop the registration
 *  only if `scrollView` is still the one they use, as another marker might have registered since.
 */
- (void)unregisterDescendantScrollView:(nonnull UIScrollView *)scrollView
                            fromMarker:(nonnull RNSScrollViewMarkerComponentView *)marker;

@end
