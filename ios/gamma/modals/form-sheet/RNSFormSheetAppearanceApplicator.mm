#import "RNSFormSheetAppearanceApplicator.h"

#import <React/RCTAssert.h>

#import "RNSFormSheetAppearanceCoordinator.h"
#import "RNSFormSheetAppearanceUpdateFlags.h"
#import "RNSFormSheetContentController.h"
#import "RNSFormSheetDetentResolver.h"
#import "RNSFormSheetHostComponentView.h"

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

- (void)updateAppearanceIfNeededForHost:(RNSFormSheetHostComponentView *)host
                             controller:(RNSFormSheetContentController *)controller
                            coordinator:(RNSFormSheetAppearanceCoordinator *)coordinator
{
  [coordinator updateIfNeeded:RNSFormSheetAppearanceUpdateFlagsConfiguration
            performOperations:^{
              [self updateSheetConfigurationForHost:host controller:controller];
            }];
}

#pragma mark - Updaters

- (void)updateSheetConfigurationForHost:(RNSFormSheetHostComponentView *)host
                             controller:(RNSFormSheetContentController *)controller
{
#if !TARGET_OS_TV
  UISheetPresentationController *sheet = controller.sheetPresentationController;
  RCTAssert(
      sheet != nil,
      @"[RNScreens] sheetPresentationController is nil. Ensure modalPresentationStyle is set to UIModalPresentationFormSheet.");

  NSArray<UISheetPresentationControllerDetent *> *nativeDetents =
      [RNSFormSheetDetentResolver buildSheetDetentsForFractions:host.detents];

  UISheetPresentationControllerDetentIdentifier initialDetentIdentifier = nil;
  if (!_initialDetentApplied) {
    initialDetentIdentifier = [RNSFormSheetDetentResolver initialDetentIdentifierForDetents:nativeDetents
                                                                           atRequestedIndex:host.initialDetentIndex];
    _initialDetentApplied = YES;
  }

  UISheetPresentationControllerDetentIdentifier largestUndimmedDetentIdentifier =
      [RNSFormSheetDetentResolver largestUndimmedDetentIdentifierForDetents:nativeDetents
                                                                    atIndex:host.largestUndimmedDetentIndex];

  BOOL prefersGrabberVisible = host.prefersGrabberVisible;
  CGFloat preferredCornerRadius = host.preferredCornerRadius;

  [sheet animateChanges:^{
    sheet.detents = nativeDetents;
    sheet.prefersGrabberVisible = prefersGrabberVisible;
    sheet.preferredCornerRadius =
        preferredCornerRadius < 0 ? UISheetPresentationControllerAutomaticDimension : preferredCornerRadius;
    sheet.largestUndimmedDetentIdentifier = largestUndimmedDetentIdentifier;

    if (initialDetentIdentifier != nil) {
      sheet.selectedDetentIdentifier = initialDetentIdentifier;
    }
  }];
#endif // !TARGET_OS_TV
}

@end
