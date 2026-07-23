#import "RNSFormSheetConfigurationApplicator.h"

#import <React/RCTAssert.h>

#import "RNSFormSheetContentController.h"
#import "RNSFormSheetDetentResolver.h"
#import "RNSFormSheetUpdateCoordinator.h"
#import "RNSFormSheetUpdateFlags.h"

@implementation RNSFormSheetConfigurationApplicator {
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

- (void)applyConfigurationIfNeededWithAppearanceProvider:(id<RNSFormSheetAppearanceProvider>)appearanceProvider
                                        behaviorProvider:(id<RNSFormSheetBehaviorProvider>)behaviorProvider
                                              controller:(RNSFormSheetContentController *)controller
                                             coordinator:(RNSFormSheetUpdateCoordinator *)coordinator
{
  RNSFormSheetUpdateFlags configFlags = RNSFormSheetUpdateFlagsAppearance | RNSFormSheetUpdateFlagsBehavior;

  [coordinator updateIfAnyNeeded:configFlags
               performOperations:^{
                 [self applyConfigurationWithAppearanceProvider:appearanceProvider
                                               behaviorProvider:behaviorProvider
                                                     controller:controller];
               }];
}

#pragma mark - Updaters

- (void)applyConfigurationWithAppearanceProvider:(id<RNSFormSheetAppearanceProvider>)appearanceProvider
                                behaviorProvider:(id<RNSFormSheetBehaviorProvider>)behaviorProvider
                                      controller:(RNSFormSheetContentController *)controller
{
#if !TARGET_OS_TV
  UISheetPresentationController *sheet = controller.sheetPresentationController;
  RCTAssert(
      sheet != nil,
      @"[RNScreens] sheetPresentationController is nil. Ensure modalPresentationStyle is set to UIModalPresentationFormSheet.");

  // Behavior data

  NSArray<UISheetPresentationControllerDetent *> *nativeDetents =
      [RNSFormSheetDetentResolver buildSheetDetentsWithBehaviorProvider:behaviorProvider];

  UISheetPresentationControllerDetentIdentifier initialDetentIdentifier = nil;
  if (!_initialDetentApplied) {
    initialDetentIdentifier =
        [RNSFormSheetDetentResolver initialDetentIdentifierForDetents:nativeDetents
                                                     atRequestedIndex:behaviorProvider.initialDetentIndex];
    _initialDetentApplied = YES;
  }

  BOOL prefersScrollingExpands = behaviorProvider.prefersScrollingExpandsWhenScrolledToEdge;

  // Appearance data

  BOOL prefersGrabberVisible = appearanceProvider.prefersGrabberVisible;
  CGFloat preferredCornerRadius = appearanceProvider.preferredCornerRadius;

  UISheetPresentationControllerDetentIdentifier largestUndimmedDetentIdentifier = [RNSFormSheetDetentResolver
      largestUndimmedDetentIdentifierForDetents:nativeDetents
                               atRequestedIndex:appearanceProvider.largestUndimmedDetentIndex];

  // Sheet updates
  [sheet animateChanges:^{
    // Behavior updates
    sheet.detents = nativeDetents;
    sheet.prefersScrollingExpandsWhenScrolledToEdge = prefersScrollingExpands;
    if (initialDetentIdentifier != nil) {
      sheet.selectedDetentIdentifier = initialDetentIdentifier;
    }
    // Appearance updates
    sheet.prefersGrabberVisible = prefersGrabberVisible;
    sheet.preferredCornerRadius =
        preferredCornerRadius < 0 ? UISheetPresentationControllerAutomaticDimension : preferredCornerRadius;
    sheet.largestUndimmedDetentIdentifier = largestUndimmedDetentIdentifier;
  }];
#endif // !TARGET_OS_TV

  controller.view.backgroundColor = appearanceProvider.nativeContainerBackgroundColor ?: UIColor.clearColor;
}

@end
