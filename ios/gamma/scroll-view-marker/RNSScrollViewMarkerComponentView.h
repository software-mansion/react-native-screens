#import <React/RCTMountingTransactionObserving.h>
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSScrollViewMarkerComponentView;

@protocol RNSScrollViewSeeking <NSObject>

/**
 *  Call this method to register a ScrollView wrapped by marker with an interested component (receiver).
 */
- (void)registerDescendantScrollView:(nonnull UIScrollView *)scrollView
                          fromMarker:(nonnull RNSScrollViewMarkerComponentView *)marker;

@end

@interface RNSScrollViewMarkerComponentView : RNSReactBaseView <RCTMountingTransactionObserving>

@end

NS_ASSUME_NONNULL_END
