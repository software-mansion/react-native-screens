#pragma once

#import <UIKit/UIKit.h>

@protocol RNSSheetBehaviorProvider;

NS_ASSUME_NONNULL_BEGIN

// Predefined value for `fitToContents` detent.
static const double kRNSSheetFitToContents = -1.0;
// Predefined values for `initialDetentIndex`.
static NSInteger const kRNSSheetLastDetent = -1;
// Predefined values for `largestUndimmedDetentIndex`.
static NSInteger const kRNSSheetAlwaysDimmed = -1;
static NSInteger const kRNSSheetNeverDimmed = -2;

@interface RNSSheetDetentResolver : NSObject

#if !TARGET_OS_TV

+ (NSArray<UISheetPresentationControllerDetent *> *)buildSheetDetentsWithBehaviorProvider:
    (id<RNSSheetBehaviorProvider>)provider;

+ (nullable UISheetPresentationControllerDetentIdentifier)initialDetentIdentifierForDetents:
                                                              (NSArray<UISheetPresentationControllerDetent *> *)detents
                                                                           atRequestedIndex:(NSInteger)requestedIndex;

+ (nullable UISheetPresentationControllerDetentIdentifier)
    largestUndimmedDetentIdentifierForDetents:(NSArray<UISheetPresentationControllerDetent *> *)detents
                             atRequestedIndex:(NSInteger)requestedIndex;

+ (NSInteger)detentIndexFromDetentIdentifier:(nullable UISheetPresentationControllerDetentIdentifier)identifier
                               forRawDetents:(NSArray<NSNumber *> *)detents;

#endif // !TARGET_OS_TV

@end

NS_ASSUME_NONNULL_END
