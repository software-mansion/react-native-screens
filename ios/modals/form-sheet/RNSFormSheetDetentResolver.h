#pragma once

#import <UIKit/UIKit.h>

@protocol RNSFormSheetBehaviorProvider;

NS_ASSUME_NONNULL_BEGIN

// Predefined value for `fitToContents` detent.
static const double kRNSFormSheetFitToContents = -1.0;
// Predefined values for `initialDetentIndex`.
static NSInteger const kRNSFormSheetLastDetent = -1;
// Predefined values for `largestUndimmedDetentIndex`.
static NSInteger const kRNSFormSheetAlwaysDimmed = -1;
static NSInteger const kRNSFormSheetNeverDimmed = -2;

@interface RNSFormSheetDetentResolver : NSObject

#if !TARGET_OS_TV

+ (NSArray<UISheetPresentationControllerDetent *> *)buildSheetDetentsWithBehaviorProvider:
    (id<RNSFormSheetBehaviorProvider>)provider;

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
