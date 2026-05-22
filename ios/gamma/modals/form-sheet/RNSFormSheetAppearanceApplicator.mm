#import "RNSFormSheetAppearanceApplicator.h"

#import <React/RCTAssert.h>

#import "RNSFormSheetContentController.h"
#import "RNSFormSheetDetentResolver.h"
#import "RNSFormSheetUpdateCoordinator.h"
#import "RNSFormSheetUpdateFlags.h"

@implementation RNSFormSheetAppearanceApplicator {
  BOOL _initialDetentApplied;
}

- (instancetype)init
{
  if (self = [super init]) {
    _initialDetentApplied = NO;
  }
  return self;
}

- (void)resetInitialDetent
{
  _initialDetentApplied = NO;
}

- (void)updateAppearanceIfNeededWithAppearanceProvider:(id<RNSFormSheetAppearanceProvider>)appearanceProvider
                                      behaviorProvider:(id<RNSFormSheetBehaviorProvider>)behaviorProvider
                                            controller:(RNSFormSheetContentController *)controller
                                           coordinator:(RNSFormSheetAppearanceCoordinator *)coordinator
{
  [coordinator updateIfNeeds:RNSFormSheetAppearanceUpdateFlagsConfiguration
           performOperations:^{
             [self updateSheetConfigurationForAppearanceProvider:appearanceProvider
                                                behaviorProvider:behaviorProvider
                                                      controller:controller];
           }];
}

#pragma mark - Updaters

- (void)updateSheetConfigurationForAppearanceProvider:(id<RNSFormSheetAppearanceProvider>)appearanceProvider
                                     behaviorProvider:(id<RNSFormSheetBehaviorProvider>)behaviorProvider
                                           controller:(RNSFormSheetContentController *)controller
{
#if !TARGET_OS_TV
  UISheetPresentationController *sheet = controller.sheetPresentationController;
  RCTAssert(
      sheet != nil,
      @"[RNScreens] sheetPresentationController is nil. Ensure modalPresentationStyle is set to UIModalPresentationFormSheet.");

  NSArray<UISheetPresentationControllerDetent *> *nativeDetents =
      [RNSFormSheetDetentResolver buildSheetDetentsForFractions:behaviorProvider.detents];

  UISheetPresentationControllerDetentIdentifier initialDetentIdentifier = nil;
  if (!_initialDetentApplied) {
    initialDetentIdentifier =
        [RNSFormSheetDetentResolver initialDetentIdentifierForDetents:nativeDetents
                                                     atRequestedIndex:behaviorProvider.initialDetentIndex];
    _initialDetentApplied = YES;
  }

  UISheetPresentationControllerDetentIdentifier largestUndimmedDetentIdentifier = [RNSFormSheetDetentResolver
      largestUndimmedDetentIdentifierForDetents:nativeDetents
                               atRequestedIndex:appearanceProvider.largestUndimmedDetentIndex];

  BOOL prefersGrabberVisible = appearanceProvider.prefersGrabberVisible;
  CGFloat preferredCornerRadius = appearanceProvider.preferredCornerRadius;
  BOOL prefersScrollingExpandsWhenScrolledToEdge = behaviorProvider.prefersScrollingExpandsWhenScrolledToEdge;

  [sheet animateChanges:^{
    sheet.detents = nativeDetents;
    sheet.prefersGrabberVisible = prefersGrabberVisible;
    sheet.preferredCornerRadius =
        preferredCornerRadius < 0 ? UISheetPresentationControllerAutomaticDimension : preferredCornerRadius;
    sheet.largestUndimmedDetentIdentifier = largestUndimmedDetentIdentifier;

    if (initialDetentIdentifier != nil) {
      sheet.selectedDetentIdentifier = initialDetentIdentifier;
    }

    sheet.prefersScrollingExpandsWhenScrolledToEdge = prefersScrollingExpandsWhenScrolledToEdge;
  }];
#endif // !TARGET_OS_TV
}

@end
