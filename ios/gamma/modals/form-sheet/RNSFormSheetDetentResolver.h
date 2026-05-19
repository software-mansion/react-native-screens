#pragma once

#import <UIKit/UIKit.h>

#if defined(__cplusplus)
#import <vector>
#endif

NS_ASSUME_NONNULL_BEGIN

// Predefined values for `initialDetentIndex`.
static NSInteger const kRNSFormSheetLastDetent = -1;
// Predefined values for `largestUndimmedDetentIndex`.
static NSInteger const kRNSFormSheetAlwaysDimmed = -1;
static NSInteger const kRNSFormSheetNeverDimmed = -2;

@interface RNSFormSheetDetentResolver : NSObject

#if !TARGET_OS_TV && defined(__cplusplus)

+ (NSArray<UISheetPresentationControllerDetent *> *)buildSheetDetentsForFractions:(const std::vector<double> &)detents;

#endif // !TARGET_OS_TV && __cplusplus

#if !TARGET_OS_TV

+ (nullable UISheetPresentationControllerDetentIdentifier)initialDetentIdentifierForDetents:
                                                              (NSArray<UISheetPresentationControllerDetent *> *)detents
                                                                           atRequestedIndex:(NSInteger)requestedIndex;

+ (nullable UISheetPresentationControllerDetentIdentifier)
    largestUndimmedDetentIdentifierForDetents:(NSArray<UISheetPresentationControllerDetent *> *)detents
                             atRequestedIndex:(NSInteger)requestedIndex;

#endif // !TARGET_OS_TV

@end

NS_ASSUME_NONNULL_END
