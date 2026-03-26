#pragma once

#import <Foundation/Foundation.h>

@class RNSScrollViewMarkerComponentView;

@protocol RNSScrollViewSeeking <NSObject>

/**
 *  Call this method to register a ScrollView wrapped by marker with an interested component (receiver).
 */
- (void)registerDescendantScrollView:(nonnull UIScrollView *)scrollView
                          fromMarker:(nonnull RNSScrollViewMarkerComponentView *)marker;

/**
 * Updates which of the registered marker-wrapped ScrollViews should be preferred by the seeking ancestor.
 */
- (void)updateDescendantScrollView:(nonnull UIScrollView *)scrollView
                        fromMarker:(nonnull RNSScrollViewMarkerComponentView *)marker
                          isActive:(BOOL)isActive;

@end
