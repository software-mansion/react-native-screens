#import "RNSSplitHostController.h"

#import <React/RCTAssert.h>
#import "RNSDefines.h"
#import "RNSSplitAppearanceApplicator.h"
#import "RNSSplitAppearanceCoordinator.h"
#import "RNSSplitHostComponentView.h"
#import "RNSSplitNavigationController.h"
#import "RNSSplitNavigationControllerFrameOriginChangeDelegate.h"
#import "RNSSplitScreenComponentView.h"
#import "RNSSplitScreenController.h"

static const NSInteger minNumberOfColumns = 2;
static const NSInteger maxNumberOfColumns = 3;
static const NSInteger maxNumberOfInspectors = 1;

@interface RNSSplitHostController () <UISplitViewControllerDelegate,
                                      RNSSplitNavigationControllerFrameOriginChangeDelegate>
@end

@implementation RNSSplitHostController {
  BOOL _needsChildViewControllersUpdate;

  RNSSplitAppearanceCoordinator *_splitAppearanceCoordinator;
  RNSSplitAppearanceApplicator *_splitAppearanceApplicator;

  RNSSplitHostComponentView *_splitHostComponentView;

  /**
   * This variable is keeping the value of how many columns were set in the initial render. It's used for validation,
   * because Split doesn't support changing number of columns dynamically.
   */
  NSInteger _fixedColumnsCount;

  /**
   * Tracks currently visible columns of the UISplitViewController.
   *
   * This set is kept in sync via `UISplitViewControllerDelegate` methods (`willShow` / `willHide`)
   * to reflect which columns are currently rendered in the UI.
   * It ensures that only visible columns are considered (e.g. for accessing topViewController),
   * avoiding crashes when certain columns are collapsed or hidden.
   */
  NSMutableSet<NSNumber *> *_visibleColumns;
}

- (instancetype)initWithSplitHostComponentView:(RNSSplitHostComponentView *)splitHostComponentView
                               numberOfColumns:(NSInteger)numberOfColumns
{
  if (self = [super initWithStyle:[RNSSplitHostController styleByNumberOfColumns:numberOfColumns]]) {
    _splitHostComponentView = splitHostComponentView;
    _splitAppearanceCoordinator = [RNSSplitAppearanceCoordinator new];
    _splitAppearanceApplicator = [RNSSplitAppearanceApplicator new];
    _fixedColumnsCount = numberOfColumns;
    _needsChildViewControllersUpdate = NO;
    _visibleColumns = [NSMutableSet set];

    self.delegate = self;
  }

  return self;
}

- (RNSSplitHostComponentEventEmitter *)reactEventEmitter
{
  return [_splitHostComponentView reactEventEmitter];
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
  RCTAssert(_needsChildViewControllersUpdate,
            @"[RNScreens] Child view controller must be invalidated when update is forced!");

  NSArray<RNSSplitScreenComponentView *> *currentColumns = [self filterSubviewsOfType:RNSSplitScreenColumnTypeColumn
                                                                                   in:self.splitReactSubviews];
  NSArray<RNSSplitScreenComponentView *> *currentInspectors =
      [self filterSubviewsOfType:RNSSplitScreenColumnTypeInspector in:self.splitReactSubviews];

  [self validateColumns:currentColumns];
  [self validateInspectors:currentInspectors];

  NSMutableArray<RNSSplitNavigationController *> *currentViewControllers =
      [NSMutableArray arrayWithCapacity:currentColumns.count];
  for (RNSSplitScreenComponentView *column in currentColumns) {
    [currentViewControllers addObject:[[RNSSplitNavigationController alloc] initWithRootViewController:column.controller
                                                                             frameOriginChangeDelegate:self]];
  }

  self.viewControllers = currentViewControllers;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    [self maybeSetupInspector:currentInspectors];
  }
#endif

  _needsChildViewControllersUpdate = NO;
}

- (void)updateSplitAppearanceIfNeeded
{
  [_splitAppearanceApplicator updateAppearanceIfNeeded:_splitHostComponentView
                                   splitHostController:self
                                 appearanceCoordinator:_splitAppearanceCoordinator];
}

- (void)refreshSecondaryNavBar
{
  UIViewController *secondaryViewController = [self viewControllerForColumn:UISplitViewControllerColumnSecondary];
  RCTAssert(secondaryViewController != nil,
            @"[RNScreens] Failed to refresh secondary nav bar. Secondary view controller is nil.");
  RCTAssert([secondaryViewController isKindOfClass:UINavigationController.class],
            @"[RNScreens] Expected UINavigationController but got %@",
            NSStringFromClass(secondaryViewController.class));
  UINavigationController *navigationController = (UINavigationController *)secondaryViewController;

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

/**
 * @brief Filters the given subviews array by a specific column type.
 *
 * Iterates over the provided subviews array and returns only the elements that match
 * the specified RNSSplitScreenColumnType (e.g., .column, .inspector).
 *
 * @param type The target RNSSplitScreenColumnType to filter for.
 * @param subviews The array of RNSSplitScreenComponentView elements to filter.
 * @return A filtered array of RNSSplitScreenComponentView objects with the specified column type.
 */
- (NSArray<RNSSplitScreenComponentView *> *)filterSubviewsOfType:(RNSSplitScreenColumnType)type
                                                              in:(NSArray<RNSSplitScreenComponentView *> *)subviews
{
  NSMutableArray<RNSSplitScreenComponentView *> *filteredSubviews = [NSMutableArray array];
  for (RNSSplitScreenComponentView *subview in subviews) {
    if (subview.columnType == type) {
      [filteredSubviews addObject:subview];
    }
  }

  return filteredSubviews;
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
  RCTAssert(column != nil, @"[RNScreens] Unknown column name: %@", columnName);
  if (column == nil) {
    return;
  }

  [self showColumn:(UISplitViewControllerColumn)column.integerValue];
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

#pragma mark - RNSReactMountingTransactionObserving

/** @brief Called before mounting transaction. */
- (void)reactMountingTransactionWillMount
{
  // noop
}

/**
 * @brief Called after mounting transaction.
 *
 * Updates children and the appearance, checks if the hierarchy is valid after applying updates.
 */
- (void)reactMountingTransactionDidMount
{
  [self updateChildViewControllersIfNeeded];
  [self updateSplitAppearanceIfNeeded];
  [self validateSplitViewHierarchy];
}

#pragma mark - RNSOrientationProviding

- (RNSOrientation)evaluateOrientation
{
  return _splitHostComponentView.orientation;
}

#pragma mark - Validators

/** @brief Validates that child structure meets required constraints defined for columns and the inspector. */
- (void)validateSplitViewHierarchy
{
  NSArray<RNSSplitScreenComponentView *> *columns = [self filterSubviewsOfType:RNSSplitScreenColumnTypeColumn
                                                                            in:self.splitReactSubviews];
  NSArray<RNSSplitScreenComponentView *> *inspectors = [self filterSubviewsOfType:RNSSplitScreenColumnTypeInspector
                                                                               in:self.splitReactSubviews];

  [self validateColumns:columns];
  [self validateInspectors:inspectors];
}

/** @brief Ensures that number of columns is valid and hasn't changed dynamically. */
- (void)validateColumns:(NSArray<RNSSplitScreenComponentView *> *)columns
{
  RCTAssert((NSInteger)columns.count >= minNumberOfColumns && (NSInteger)columns.count <= maxNumberOfColumns,
            @"[RNScreens] Split can only have from %ld to %ld columns",
            (long)minNumberOfColumns,
            (long)maxNumberOfColumns);

  RCTAssert((NSInteger)columns.count == _fixedColumnsCount,
            @"[RNScreens] Split number of columns shouldn't change dynamically");
}

/** @brief Ensures that at most one inspector is present. */
- (void)validateInspectors:(NSArray<RNSSplitScreenComponentView *> *)inspectors
{
  RCTAssert((NSInteger)inspectors.count <= maxNumberOfInspectors,
            @"[RNScreens] Split can only have %ld inspector",
            (long)maxNumberOfInspectors);
}

/**
 * @brief Gets the children RNSSplitScreenController instances.
 *
 * Accesses Split controllers associated with presented columns. It asserts that each view controller is a navigation
 * controller and its topViewController is of type RNSSplitScreenController.
 *
 * @return An array of RNSSplitScreenController corresponding to current split view columns.
 */
- (NSArray<RNSSplitScreenController *> *)splitScreenControllers
{
  NSMutableArray<RNSSplitScreenController *> *splitScreenControllers =
      [NSMutableArray arrayWithCapacity:_visibleColumns.count];

  for (NSNumber *columnNumber in _visibleColumns) {
    UISplitViewControllerColumn column = (UISplitViewControllerColumn)columnNumber.integerValue;
    UIViewController *viewController = [self viewControllerForColumn:column];
    RCTAssert(viewController != nil, @"[RNScreens] viewController for column %ld is nil.", (long)column);

    RNSSplitNavigationController *splitNavigationController =
        [viewController isKindOfClass:RNSSplitNavigationController.class]
        ? (RNSSplitNavigationController *)viewController
        : nil;
    RCTAssert(splitNavigationController != nil,
              @"[RNScreens] Expected RNSSplitNavigationController but got %@",
              NSStringFromClass(viewController.class));

    UIViewController *maybeSplitScreenController = splitNavigationController.topViewController;
    RCTAssert(
        maybeSplitScreenController != nil, @"[RNScreens] RNSSplitScreenController is nil for column %ld", (long)column);
    RCTAssert([maybeSplitScreenController isKindOfClass:RNSSplitScreenController.class],
              @"[RNScreens] Expected RNSSplitScreenController but got %@",
              NSStringFromClass(maybeSplitScreenController.class));

    if ([maybeSplitScreenController isKindOfClass:RNSSplitScreenController.class]) {
      [splitScreenControllers addObject:(RNSSplitScreenController *)maybeSplitScreenController];
    }
  }

  return splitScreenControllers;
}

/**
 * @brief Gets all React subviews of type RNSSplitScreenComponentView.
 *
 * Accesses all the subviews from the reactSubviews collection. It asserts that each one is a
 * RNSSplitScreenComponentView.
 *
 * @return An array of RNSSplitScreenComponentView subviews which are children of the host component view.
 */
- (NSArray<RNSSplitScreenComponentView *> *)splitReactSubviews
{
  NSArray<RNSSplitScreenComponentView *> *reactSubviews = [_splitHostComponentView reactSubviews];
  NSMutableArray<RNSSplitScreenComponentView *> *splitReactSubviews =
      [NSMutableArray arrayWithCapacity:reactSubviews.count];

  for (RNSSplitScreenComponentView *subview in reactSubviews) {
    RCTAssert([subview isKindOfClass:RNSSplitScreenComponentView.class],
              @"[RNScreens] Expected RNSSplitScreenComponentView but got %@",
              NSStringFromClass(subview.class));

    if ([subview isKindOfClass:RNSSplitScreenComponentView.class]) {
      [splitReactSubviews addObject:subview];
    }
  }

  return splitReactSubviews;
}

#pragma mark - RNSSplitNavigationControllerFrameOriginChangeDelegate

/**
 * @brief Notifies that an origin of parent RNSSplitNavigationController frame has changed.
 *
 * It iterates over children controllers and notifies them for the layout update.
 *
 * @param splitNavCtrl The navigation controller whose frame origin changed.
 */
- (void)splitNavigationControllerFrameOriginDidChange:(RNSSplitNavigationController *)splitNavCtrl
{
  for (RNSSplitScreenController *controller in self.splitScreenControllers) {
    [controller columnPositioningDidChangeInSplitViewController:self];
  }
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

/**
 * @brief Sets up the inspector column if available.
 * @remarks Inspector columns is available only on iOS 26 or higher.
 *
 * Attaches a view controller for the inspector column.
 *
 * @param inspectors An array of inspector-type RNSSplitScreenComponentView subviews.
 */
- (void)maybeSetupInspector:(NSArray<RNSSplitScreenComponentView *> *)inspectors
{
#if !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    RNSSplitScreenComponentView *inspector = inspectors.firstObject;
    if (inspector != nil) {
      RNSSplitNavigationController *inspectorViewController =
          [[RNSSplitNavigationController alloc] initWithRootViewController:inspector.controller];
      [self setViewController:inspectorViewController forColumn:UISplitViewControllerColumnInspector];
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

- (void)splitViewController:(UISplitViewController *)svc willShowColumn:(UISplitViewControllerColumn)column
{
  [_visibleColumns addObject:@(column)];
}

- (void)splitViewController:(UISplitViewController *)svc willHideColumn:(UISplitViewControllerColumn)column
{
  [_visibleColumns removeObject:@(column)];
}

- (void)splitViewControllerDidCollapse:(UISplitViewController *)svc
{
  [[self reactEventEmitter] emitOnCollapse];
}

- (void)splitViewControllerDidExpand:(UISplitViewController *)svc
{
  [[self reactEventEmitter] emitOnExpand];
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
        [[self reactEventEmitter] emitOnHideInspector];
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
    [[self reactEventEmitter] emitOnDisplayModeWillChangeFrom:self.displayMode to:displayMode];
  }

  __weak auto weakSelf = self;
  void (^notifyColumnPositioningDidChange)(void) = ^{
    auto strongSelf = weakSelf;
    if (strongSelf == nil) {
      return;
    }

    for (RNSSplitScreenController *controller in [strongSelf splitScreenControllers]) {
      [controller columnPositioningDidChangeInSplitViewController:strongSelf];
    }
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
  if (_splitHostComponentView.hasCustomTopColumnForCollapsing) {
    return _splitHostComponentView.topColumnForCollapsingColumn;
  }

  return proposedTopColumn;
}

@end
