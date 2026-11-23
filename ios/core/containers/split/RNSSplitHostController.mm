#import "RNSSplitHostController.h"

#import "RNSAssert.h"
#import "RNSDefines.h"
#import "RNSSplitAppearanceApplicator.h"
#import "RNSSplitAppearanceCoordinator.h"
#import "RNSSplitColumnCoordinator.h"
#import "RNSSplitColumnNavigationControllerFrameObserver.h"
#import "RNSStackNavigationController.h"
#import "RNSViewFrameChangeDelegate.h"

[[maybe_unused]] static const NSInteger minNumberOfColumns = 2;
[[maybe_unused]] static const NSInteger maxNumberOfColumns = 3;
[[maybe_unused]] static const NSInteger maxNumberOfInspectors = 1;

@interface RNSSplitHostController () <UISplitViewControllerDelegate, RNSViewFrameChangeDelegate>
@end

@implementation RNSSplitHostController {
  BOOL _needsChildViewControllersUpdate;

  RNSSplitAppearanceCoordinator *_splitAppearanceCoordinator;
  RNSSplitAppearanceApplicator *_splitAppearanceApplicator;

  /**
   * This variable is keeping the value of how many columns were set in the initial render. It's used for validation,
   * because Split doesn't support changing number of columns dynamically.
   */
  NSInteger _fixedColumnsCount;

  /**
   * Observe the frames of the views of the navigation controllers installed for the columns.
   *
   * UISplitViewController moves the columns on its own, on display mode change or column resize. The columns are
   * notified then, so that they report their new frames to their delegates.
   */
  NSArray<RNSSplitColumnNavigationControllerFrameObserver *> *_columnNavigationControllerFrameObservers;
}

- (instancetype)initWithNumberOfColumns:(NSInteger)numberOfColumns
{
  if (self = [super initWithStyle:[RNSSplitHostController styleByNumberOfColumns:numberOfColumns]]) {
    _splitAppearanceCoordinator = [RNSSplitAppearanceCoordinator new];
    _splitAppearanceApplicator = [RNSSplitAppearanceApplicator new];
    _fixedColumnsCount = numberOfColumns;
    _needsChildViewControllersUpdate = NO;

    self.delegate = self;
  }

  return self;
}

#pragma mark - Signals

- (void)setNeedsUpdateOfChildViewControllers
{
  _needsChildViewControllersUpdate = YES;
}

- (void)setNeedsAppearanceUpdate
{
  [_splitAppearanceCoordinator needs:RNSSplitAppearanceUpdateFlagsGeneralUpdate];
}

- (void)setNeedsSecondaryScreenNavBarUpdate
{
  // We noticed a bug on the pure-native component, which is blocking dynamic updates for showsSecondaryOnlyButton.
  // Toggling this flag doesn't refresh the component and is updated after triggerig some other interaction, like
  // changing layout.
  // We noticed that we can forcefully refresh navigation bar from UINavigationController level by toggling
  // setNavigationBarHidden.
  // After some testing, it looks well and I haven't noticed any flicker - missing button is appearing naturally.
  // Please note that this is a hack rather than a solution so feel free to remove this code in case of any problems and
  // treat the bug with toggling button as a platform's issue.
  [_splitAppearanceCoordinator needs:RNSSplitAppearanceUpdateFlagsSecondaryScreenNavBarUpdate];
}

- (void)setNeedsDisplayModeUpdate
{
  [_splitAppearanceCoordinator needs:RNSSplitAppearanceUpdateFlagsDisplayModeUpdate];
}

- (void)setNeedsOrientationUpdate
{
  [_splitAppearanceCoordinator needs:RNSSplitAppearanceUpdateFlagsOrientationUpdate];
}

#pragma mark - Updating

- (void)updateChildViewControllersIfNeeded
{
  if (_needsChildViewControllersUpdate) {
    [self updateChildViewControllers];
  }
}

- (void)updateChildViewControllers
{
  RNSAssert(_needsChildViewControllersUpdate,
            @"[RNScreens] Child view controller must be invalidated when update is forced!");

  NSArray<RNSSplitColumnCoordinator *> *currentColumns = [self.columnsProvider columnCoordinators];
  NSArray<RNSSplitColumnCoordinator *> *currentInspectors = [self.columnsProvider inspectorCoordinators];

  [self validateColumns:currentColumns];
  [self validateInspectors:currentInspectors];

  NSArray<RNSStackNavigationController *> *currentViewControllers = [self.columnsProvider columnNavigationControllers];

  self.viewControllers = currentViewControllers;
  [self observeFramesOfColumnNavigationControllers:currentViewControllers];

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    [self maybeSetupInspector:currentInspectors];
  }
#endif

  _needsChildViewControllersUpdate = NO;
}

- (void)observeFramesOfColumnNavigationControllers:(NSArray<UINavigationController *> *)navigationControllers
{
  for (RNSSplitColumnNavigationControllerFrameObserver *frameObserver in _columnNavigationControllerFrameObservers) {
    [frameObserver unregisterForViewFrameChanges];
  }

  NSMutableArray<RNSSplitColumnNavigationControllerFrameObserver *> *frameObservers =
      [NSMutableArray arrayWithCapacity:navigationControllers.count];
  for (UINavigationController *navigationController in navigationControllers) {
    // The frame observer needs the view, which UIKit loads only when it is about to show the column.
    [navigationController loadViewIfNeeded];

    RNSSplitColumnNavigationControllerFrameObserver *frameObserver =
        [[RNSSplitColumnNavigationControllerFrameObserver alloc] initWithNavigationController:navigationController
                                                                                     delegate:self];
    [frameObserver registerForViewFrameChanges];
    [frameObservers addObject:frameObserver];
  }

  _columnNavigationControllerFrameObservers = frameObservers;
}

- (void)updateSplitAppearanceIfNeeded
{
  [_splitAppearanceApplicator updateAppearanceIfNeeded:self.appearanceProvider
                                   splitHostController:self
                                 appearanceCoordinator:_splitAppearanceCoordinator];
}

- (void)refreshSecondaryNavBar
{
  UIViewController *secondaryViewController = [self viewControllerForColumn:UISplitViewControllerColumnSecondary];
  RNSAssert(secondaryViewController != nil,
            @"[RNScreens] Failed to refresh secondary nav bar. Secondary view controller is nil.");
  RNSAssert([secondaryViewController isKindOfClass:UINavigationController.class],
            @"[RNScreens] Expected UINavigationController but got %@",
            NSStringFromClass(secondaryViewController.class));
  UINavigationController *navigationController = (UINavigationController *)secondaryViewController;

  if (navigationController.navigationBarHidden) {
    return;
  }

  /** The assumption is that it should come in a single batch and it won't cause any delays in rendering the content. */
  [navigationController setNavigationBarHidden:YES animated:NO];
  [navigationController setNavigationBarHidden:NO animated:NO];
}

#pragma mark - Helpers

/**
 * @brief Gets the appropriate style for a specified number of columns.
 *
 * This utility maps a given number of columns to the corresponding UISplitViewController.Style.
 *
 * @param numberOfColumns The number of columns for the SplitView.
 * @return A UISplitViewController.Style corresponding to the provided column count.
 */
+ (UISplitViewControllerStyle)styleByNumberOfColumns:(NSInteger)numberOfColumns
{
  switch (numberOfColumns) {
    case 2:
      return UISplitViewControllerStyleDoubleColumn;
    case 3:
      return UISplitViewControllerStyleTripleColumn;
    default:
      return UISplitViewControllerStyleUnspecified;
  }
}

#pragma mark - Public setters

- (void)toggleSplitViewInspector:(BOOL)showInspector
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (showInspector) {
      [self maybeShowInspector];
    } else {
      [self maybeHideInspector];
    }
  }
#endif
}

- (void)showColumnNamed:(NSString *)columnName
{
  NSNumber *column = [self splitViewColumnFromString:columnName];
  RNSAssert(column != nil, @"[RNScreens] Unknown column name: %@", columnName);
  if (column == nil) {
    return;
  }

  [self showColumn:(UISplitViewControllerColumn)column.integerValue];
}

- (void)hideColumnNamed:(NSString *)columnName
{
  NSNumber *column = [self splitViewColumnFromString:columnName];
  BOOL isSidebarColumn = column != nil && column.integerValue != UISplitViewControllerColumnSecondary;
  RNSAssert(
      isSidebarColumn, @"[RNScreens] Cannot hide column %@. Only primary and supplementary are supported.", columnName);
  if (!isSidebarColumn) {
    return;
  }

  [self hideColumn:(UISplitViewControllerColumn)column.integerValue];
}

/**
 * @brief Maps a string column name to its corresponding `UISplitViewController.Column` value.
 *
 * @param name The column name string: `"primary"`, `"supplementary"`, or `"secondary"`.
 * @return The corresponding `UISplitViewController.Column`, or `nil` if the name is not recognized.
 */
- (nullable NSNumber *)splitViewColumnFromString:(NSString *)name
{
  if ([name isEqualToString:@"primary"]) {
    return @(UISplitViewControllerColumnPrimary);
  }
  if ([name isEqualToString:@"supplementary"]) {
    return @(UISplitViewControllerColumnSupplementary);
  }
  if ([name isEqualToString:@"secondary"]) {
    return @(UISplitViewControllerColumnSecondary);
  }

  return nil;
}

#pragma mark - RNSContainerTransactionSupporting

/** @brief Called before a transaction. */
- (void)beginTransaction
{
  // noop
}

/**
 * @brief Called to commit a transaction.
 *
 * Updates children and the appearance, checks if the hierarchy is valid after applying updates.
 */
- (void)commitTransaction
{
  [self updateChildViewControllersIfNeeded];
  [self updateSplitAppearanceIfNeeded];
  [self validateSplitViewHierarchy];
}

#pragma mark - RNSOrientationProviding

- (RNSOrientation)evaluateOrientation
{
  return self.appearanceProvider.orientation;
}

#pragma mark - Validators

/** @brief Validates that child structure meets required constraints defined for columns and the inspector. */
- (void)validateSplitViewHierarchy
{
  [self validateColumns:[self.columnsProvider columnCoordinators]];
  [self validateInspectors:[self.columnsProvider inspectorCoordinators]];
}

/** @brief Ensures that number of columns is valid and hasn't changed dynamically. */
- (void)validateColumns:(NSArray<RNSSplitColumnCoordinator *> *)columns
{
  RNSAssert((NSInteger)columns.count >= minNumberOfColumns && (NSInteger)columns.count <= maxNumberOfColumns,
            @"[RNScreens] Split can only have from %ld to %ld columns",
            (long)minNumberOfColumns,
            (long)maxNumberOfColumns);

  RNSAssert((NSInteger)columns.count == _fixedColumnsCount,
            @"[RNScreens] Split number of columns shouldn't change dynamically");
}

/** @brief Ensures that at most one inspector is present. */
- (void)validateInspectors:(NSArray<RNSSplitColumnCoordinator *> *)inspectors
{
  RNSAssert((NSInteger)inspectors.count <= maxNumberOfInspectors,
            @"[RNScreens] Split can only have %ld inspector",
            (long)maxNumberOfInspectors);
}

/**
 * @brief Notifies the columns that the Split repositioned its columns.
 *
 * Every column is notified, and a column that is not on screen ignores it. UIKit does not tell the delegate about
 * every column it shows or hides (e.g. not when `showColumn:` is called), so the Split does not track which columns
 * are visible.
 */
- (void)notifyColumnsAboutPositioningChange
{
  for (RNSSplitColumnCoordinator *coordinator in [self.columnsProvider columnCoordinators]) {
    [coordinator columnPositioningDidChange];
  }
  for (RNSSplitColumnCoordinator *coordinator in [self.columnsProvider inspectorCoordinators]) {
    [coordinator columnPositioningDidChange];
  }
}

#pragma mark - RNSViewFrameChangeDelegate

/**
 * @brief Notifies that the origin of the frame of a column's navigation controller view has changed.
 *
 * It notifies the coordinators of the columns for the layout update.
 *
 * @param view The view of the navigation controller whose frame origin changed.
 */
- (void)viewFrameDidChange:(nonnull UIView *)view
{
  [self notifyColumnsAboutPositioningChange];
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

/**
 * @brief Sets up the inspector column if available.
 * @remarks Inspector columns is available only on iOS 26 or higher.
 *
 * Attaches a view controller for the inspector column.
 *
 * @param inspectors An array of coordinators of the inspector-type columns.
 */
- (void)maybeSetupInspector:(NSArray<RNSSplitColumnCoordinator *> *)inspectors
{
#if !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    RNSSplitColumnCoordinator *inspector = inspectors.firstObject;
    if (inspector != nil) {
      [self setViewController:inspector.plainColumnNavigationController forColumn:UISplitViewControllerColumnInspector];
    }
  }
#endif
}

/**
 * @brief Shows the inspector column when available.
 * @remarks Inspector columns is available only on iOS 26 or higher.
 *
 * Uses the UISplitViewController's new API introduced in iOS 26 to show the inspector column.
 */
- (void)maybeShowInspector
{
#if !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    [self showColumn:UISplitViewControllerColumnInspector];
  }
#endif
}

/**
 * @brief Hides the inspector column when available.
 * @remarks Inspector columns is available only on iOS 26 or higher.
 *
 * Uses the UISplitViewController's new API introduced in iOS 26 to hide the inspector column.
 */
- (void)maybeHideInspector
{
#if !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    [self hideColumn:UISplitViewControllerColumnInspector];
  }
#endif
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#pragma mark - UISplitViewControllerDelegate

- (void)splitViewControllerDidCollapse:(UISplitViewController *)svc
{
  [self.eventsDelegate splitHostControllerDidCollapse:self];
}

- (void)splitViewControllerDidExpand:(UISplitViewController *)svc
{
  [self.eventsDelegate splitHostControllerDidExpand:self];
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

/**
 * @brief Called after a column in the split view controller has been hidden from the interface.
 *
 * Currently emits onHideInspector event for the inspector if applicable.
 *
 * @param svc The split view controller that just hid the column.
 * @param column The column that was hidden.
 */
- (void)splitViewController:(UISplitViewController *)svc didHideColumn:(UISplitViewControllerColumn)column
{
#if !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    // TODO: we may consider removing this logic, because it could be handled by onViewDidDisappear on the column level
    // On the other hand, maybe dedicated event related to the inspector would be a better approach.
    // For now I am leaving it, but feel free to drop this method if there's any reason that `onDidDisappear` works
    // better.

    if (column != UISplitViewControllerColumnInspector) {
      return;
    }

    // `didHide` for modal is called on finger down for dismiss, what is problematic, because we can cancel dismissing
    // modal.
    // In this scenario, the modal inspector might receive an invalid state and will deviate from the JS value.
    // Therefore, for event emissions, we need to ensure that the view was detached from the view hierarchy, by checking
    // its window.
    UIViewController *inspectorViewController = [self viewControllerForColumn:UISplitViewControllerColumnInspector];
    if (inspectorViewController != nil) {
      if (inspectorViewController.view.window == nil) {
        [self.eventsDelegate splitHostControllerDidHideInspector:self];
      }
    }
  }
#endif
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

- (void)splitViewController:(UISplitViewController *)svc
    willChangeToDisplayMode:(UISplitViewControllerDisplayMode)displayMode
{
  if (self.displayMode != displayMode) {
    [self.eventsDelegate splitHostController:self willChangeDisplayModeFrom:self.displayMode to:displayMode];
  }

  __weak auto weakSelf = self;
  void (^notifyColumnPositioningDidChange)(void) = ^{
    auto strongSelf = weakSelf;
    if (strongSelf == nil) {
      return;
    }

    [strongSelf notifyColumnsAboutPositioningChange];
  };

  id<UIViewControllerTransitionCoordinator> coordinator = svc.transitionCoordinator;
  if (coordinator != nil) {
    [coordinator animateAlongsideTransition:nil
                                 completion:^(id<UIViewControllerTransitionCoordinatorContext> context) {
                                   notifyColumnPositioningDidChange();
                                 }];
  } else {
    notifyColumnPositioningDidChange();
  }
}

- (UISplitViewControllerColumn)splitViewController:(UISplitViewController *)svc
         topColumnForCollapsingToProposedTopColumn:(UISplitViewControllerColumn)proposedTopColumn
{
  if (self.behaviorProvider.hasCustomTopColumnForCollapsing) {
    return self.behaviorProvider.topColumnForCollapsingColumn;
  }

  return proposedTopColumn;
}

@end
