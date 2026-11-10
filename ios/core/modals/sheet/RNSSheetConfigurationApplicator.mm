#import "RNSSheetConfigurationApplicator.h"

#import "RNSAssert.h"
#import "RNSDefines.h"

#import "RNSSheetContentController.h"
#import "RNSSheetDetentResolver.h"
#import "RNSSheetUpdateCoordinator.h"
#import "RNSSheetUpdateFlags.h"

@implementation RNSSheetConfigurationApplicator

+ (void)applyConfigurationIfNeededWithAppearanceProvider:(id<RNSSheetAppearanceProvider>)appearanceProvider
                                        behaviorProvider:(id<RNSSheetBehaviorProvider>)behaviorProvider
                                              controller:(RNSSheetContentController *)controller
                                             coordinator:(RNSSheetUpdateCoordinator *)coordinator
{
  RNSSheetUpdateFlags configFlags =
      RNSSheetUpdateFlagsAppearance | RNSSheetUpdateFlagsBehavior | RNSSheetUpdateFlagsInitialDetent;

  BOOL shouldSelectInitialDetent = [coordinator needsAny:RNSSheetUpdateFlagsInitialDetent];

  [coordinator updateIfAnyNeeded:configFlags
               performOperations:^{
                 [self applyConfigurationWithAppearanceProvider:appearanceProvider
                                               behaviorProvider:behaviorProvider
                                                     controller:controller
                                            selectInitialDetent:shouldSelectInitialDetent];
               }];
}

#pragma mark - Updaters

+ (void)applyConfigurationWithAppearanceProvider:(id<RNSSheetAppearanceProvider>)appearanceProvider
                                behaviorProvider:(id<RNSSheetBehaviorProvider>)behaviorProvider
                                      controller:(RNSSheetContentController *)controller
                             selectInitialDetent:(BOOL)selectInitialDetent
{
  CGSize preferredContentSize = behaviorProvider.preferredContentSize;

#if !TARGET_OS_TV
  UISheetPresentationController *sheet = controller.sheetPresentationController;
  RNSAssert(
      sheet != nil,
      @"[RNScreens] sheetPresentationController is nil. Ensure modalPresentationStyle is a sheet style (UIModalPresentationFormSheet or UIModalPresentationPageSheet).");

  // Behavior data

  NSArray<UISheetPresentationControllerDetent *> *nativeDetents =
      [RNSSheetDetentResolver buildSheetDetentsWithBehaviorProvider:behaviorProvider];

  UISheetPresentationControllerDetentIdentifier initialDetentIdentifier = nil;
  if (selectInitialDetent) {
    initialDetentIdentifier =
        [RNSSheetDetentResolver initialDetentIdentifierForDetents:nativeDetents
                                                 atRequestedIndex:behaviorProvider.initialDetentIndex];
  }

  BOOL prefersScrollingExpands = behaviorProvider.prefersScrollingExpandsWhenScrolledToEdge;
  BOOL prefersEdgeAttachedInCompactHeight = behaviorProvider.prefersEdgeAttachedInCompactHeight;
  BOOL widthFollowsPreferredContentSize = behaviorProvider.widthFollowsPreferredContentSizeWhenEdgeAttached;

  // Appearance data

  BOOL prefersGrabberVisible = appearanceProvider.prefersGrabberVisible;
  CGFloat preferredCornerRadius = appearanceProvider.preferredCornerRadius;

  UISheetPresentationControllerDetentIdentifier largestUndimmedDetentIdentifier =
      [RNSSheetDetentResolver largestUndimmedDetentIdentifierForDetents:nativeDetents
                                                       atRequestedIndex:appearanceProvider.largestUndimmedDetentIndex];

  // Sheet updates
  [sheet animateChanges:^{
    // Behavior updates
    sheet.detents = nativeDetents;
    sheet.prefersScrollingExpandsWhenScrolledToEdge = prefersScrollingExpands;
    sheet.prefersEdgeAttachedInCompactHeight = prefersEdgeAttachedInCompactHeight;
    sheet.widthFollowsPreferredContentSizeWhenEdgeAttached = widthFollowsPreferredContentSize;
    controller.preferredContentSize = preferredContentSize;
    if (initialDetentIdentifier != nil) {
      sheet.selectedDetentIdentifier = initialDetentIdentifier;
    }
    // Appearance updates
    sheet.prefersGrabberVisible = prefersGrabberVisible;
    sheet.preferredCornerRadius =
        preferredCornerRadius < 0 ? UISheetPresentationControllerAutomaticDimension : preferredCornerRadius;
    sheet.largestUndimmedDetentIdentifier = largestUndimmedDetentIdentifier;
#if !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)
    if (@available(iOS 26.1, *)) {
      sheet.backgroundEffect = appearanceProvider.backgroundEffect;
    }
#endif // !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)
  }];
#else
  controller.preferredContentSize = preferredContentSize;
#endif // !TARGET_OS_TV

  controller.view.backgroundColor = appearanceProvider.nativeContainerBackgroundColor ?: UIColor.clearColor;
}

@end
