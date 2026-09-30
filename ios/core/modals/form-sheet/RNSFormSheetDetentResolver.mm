#import "RNSFormSheetDetentResolver.h"
#import "RNSDefines.h"
#import "RNSFormSheetProviders.h"

#import "RNSLog.h"

#if !TARGET_OS_TV

static BOOL RNSAreDetentsValid(NSArray<NSNumber *> *detents)
{
  if (detents.count == 1 && detents[0].doubleValue == kRNSFormSheetFitToContents) {
    return YES;
  }

  for (NSNumber *detent in detents) {
    double currentDetent = detent.doubleValue;
    if (isnan(currentDetent)) {
      return NO;
    }
    if (currentDetent < 0.0 || currentDetent > 1.0) {
      return NO;
    }
  }
  return YES;
}

static BOOL RNSAreDetentsStrictlyAscending(NSArray<NSNumber *> *detents)
{
  for (NSUInteger i = 1; i < detents.count; i++) {
    if (detents[i - 1].doubleValue >= detents[i].doubleValue) {
      return NO;
    }
  }
  return YES;
}

@implementation RNSFormSheetDetentResolver

+ (NSArray<UISheetPresentationControllerDetent *> *)buildSheetDetentsWithBehaviorProvider:
    (id<RNSFormSheetBehaviorProvider>)provider
{
  NSArray<NSNumber *> *detents = provider.detents;
  NSUInteger detentsCount = detents.count;

  // Defaults to large detent across all iOS versions
  if (detentsCount == 0) {
    return @[ [UISheetPresentationControllerDetent largeDetent] ];
  }

  if (!RNSAreDetentsValid(detents)) {
    RNSLogError(
        @"[RNScreens] The values in the detents array must fall within the 0.0 to 1.0 range. Falling back to large detent.");
    return @[ [UISheetPresentationControllerDetent largeDetent] ];
  }

  if (!RNSAreDetentsStrictlyAscending(detents)) {
    RNSLogError(
        @"[RNScreens] The values in the detents array must be in strictly ascending order. Falling back to large detent.");
    return @[ [UISheetPresentationControllerDetent largeDetent] ];
  }

  NSMutableArray<UISheetPresentationControllerDetent *> *nativeDetents =
      [[NSMutableArray alloc] initWithCapacity:detentsCount];

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  if (@available(iOS 16.0, *)) {
    __weak id<RNSFormSheetBehaviorProvider> weakProvider = provider;

    for (NSUInteger i = 0; i < detentsCount; i++) {
      double fraction = detents[i].doubleValue;
      NSString *ident = [NSString stringWithFormat:@"%lu", (unsigned long)i];
      if (fraction == kRNSFormSheetFitToContents) {
        [nativeDetents
            addObject:[UISheetPresentationControllerDetent
                          customDetentWithIdentifier:ident
                                            resolver:^CGFloat(
                                                id<UISheetPresentationControllerDetentResolutionContext> context) {
                                              CGFloat currentHeight =
                                                  weakProvider ? [weakProvider contentsHeight] : 0.0;

                                              // Safe fallback for uncalculated layout or deallocated provider
                                              if (currentHeight <= 0.0) {
                                                currentHeight = context.maximumDetentValue;
                                              }

                                              return MIN(context.maximumDetentValue, currentHeight);
                                            }]];
      } else {
        [nativeDetents
            addObject:[UISheetPresentationControllerDetent
                          customDetentWithIdentifier:ident
                                            resolver:^CGFloat(
                                                id<UISheetPresentationControllerDetentResolutionContext> context) {
                                              return context.maximumDetentValue * fraction;
                                            }]];
      }
    }
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  {
    // iOS 15 Legacy Fallback
    if (detentsCount == 1) {
      double firstDetentFraction = detents[0].doubleValue;
      if (firstDetentFraction == kRNSFormSheetFitToContents) {
        RNSLogError(
            @"[RNScreens] 'fitToContents' is unsupported on iOS versions below 16. Falling back to large detent.");
        [nativeDetents addObject:UISheetPresentationControllerDetent.largeDetent];
      } else if (firstDetentFraction < 1.0) {
        [nativeDetents addObject:UISheetPresentationControllerDetent.mediumDetent];
      } else {
        [nativeDetents addObject:UISheetPresentationControllerDetent.largeDetent];
      }
    } else {
      // Handles detentsCount > 1
      [nativeDetents addObject:UISheetPresentationControllerDetent.mediumDetent];
      [nativeDetents addObject:UISheetPresentationControllerDetent.largeDetent];
    }
  }

  return nativeDetents;
}

+ (nullable UISheetPresentationControllerDetentIdentifier)initialDetentIdentifierForDetents:
                                                              (NSArray<UISheetPresentationControllerDetent *> *)detents
                                                                           atRequestedIndex:(NSInteger)requestedIndex
{
  NSInteger initialIndex = requestedIndex == kRNSFormSheetLastDetent ? (NSInteger)detents.count - 1 : requestedIndex;

  if (initialIndex < 0 || initialIndex >= (NSInteger)detents.count) {
    RNSLogError(@"[RNScreens] initialDetentIndex (%ld) exceeds effective detents count (%lu). Falling back to 0.",
                (long)requestedIndex,
                (unsigned long)detents.count);
    initialIndex = 0;
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  if (@available(iOS 16.0, *)) {
    return detents[(NSUInteger)initialIndex].identifier;
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  {
    // iOS 15 Fallback - mirroring buildSheetDetentsForFractions:
    UISheetPresentationControllerDetent *targetDetent = detents[(NSUInteger)initialIndex];

    if ([targetDetent isEqual:[UISheetPresentationControllerDetent mediumDetent]]) {
      return UISheetPresentationControllerDetentIdentifierMedium;
    }

    return UISheetPresentationControllerDetentIdentifierLarge;
  }
}

+ (nullable UISheetPresentationControllerDetentIdentifier)
    largestUndimmedDetentIdentifierForDetents:(NSArray<UISheetPresentationControllerDetent *> *)detents
                             atRequestedIndex:(NSInteger)requestedIndex
{
  if (requestedIndex == kRNSFormSheetAlwaysDimmed) {
    return nil;
  }

  NSInteger ludIndex = requestedIndex == kRNSFormSheetNeverDimmed ? (NSInteger)detents.count - 1 : requestedIndex;

  if (ludIndex < 0 || ludIndex >= (NSInteger)detents.count) {
    RNSLogError(
        @"[RNScreens] largestUndimmedDetentIndex (%ld) exceeds effective detents count (%lu). Falling back to the default behavior (always dimmed).",
        (long)requestedIndex,
        (unsigned long)detents.count);
    return nil;
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  if (@available(iOS 16.0, *)) {
    return detents[(NSUInteger)ludIndex].identifier;
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  {
    // iOS 15 Fallback - mirroring buildSheetDetentsForFractions:
    UISheetPresentationControllerDetent *targetDetent = detents[(NSUInteger)ludIndex];

    if ([targetDetent isEqual:[UISheetPresentationControllerDetent mediumDetent]]) {
      return UISheetPresentationControllerDetentIdentifierMedium;
    }

    return UISheetPresentationControllerDetentIdentifierLarge;
  }
}

+ (NSInteger)detentIndexFromDetentIdentifier:(nullable UISheetPresentationControllerDetentIdentifier)identifier
                               forRawDetents:(NSArray<NSNumber *> *)detents
{
  if (identifier == nil) {
    return -1;
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  if (@available(iOS 16.0, *)) {
    if (detents.count > 0) {
      return [identifier integerValue];
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)

  // Legacy Fallback for iOS 15 or when no custom detents are provided -
  // mirroring buildSheetDetentsForFractions:
  if ([identifier isEqualToString:UISheetPresentationControllerDetentIdentifierMedium]) {
    return 0;
  } else if ([identifier isEqualToString:UISheetPresentationControllerDetentIdentifierLarge]) {
    return detents.count > 1 ? 1 : 0;
  }

  return 0;
}

@end

#endif // !TARGET_OS_TV
