#import "RNSSplitViewHostController.h"
#import "RNSScreenWindowTraits.h"
#import "RNSSplitViewAppearanceUpdateFlags.h"
#import "RNSSplitViewHostComponentEventEmitter.h"
#import "RNSSplitViewNavigationController.h"
#import "RNSSplitViewScreenComponentView.h"
#import "RNSSplitViewScreenController.h"

#define kMinColumnsCount 2
#define kMaxColumnsCount 3
#define kMaxInspectorCount 1

@interface RNSSplitViewHostController ()
@property (nonatomic, strong) RNSSplitViewAppearanceCoordinator *appearanceCoordinator;
@property (nonatomic, strong) RNSSplitViewAppearanceApplicator *appearanceApplicator;
@property (nonatomic, strong) RNSSplitViewHostComponentView *hostComponentView;
@property (nonatomic, assign) BOOL needsChildViewControllersUpdate;
@property (nonatomic, assign) NSInteger fixedColumnsCount;
@end

@implementation RNSSplitViewHostController

- (instancetype)initWithSplitViewHostComponentView:(RNSSplitViewHostComponentView *)view
                                   numberOfColumns:(NSInteger)columnCount
{
  self = [super initWithStyle:[RNSSplitViewHostController styleByNumberOfColumns:columnCount]];
  if (self) {
    _hostComponentView = view;
    _appearanceCoordinator = [[RNSSplitViewAppearanceCoordinator alloc] init];
    _appearanceApplicator = [[RNSSplitViewAppearanceApplicator alloc] init];
    _fixedColumnsCount = columnCount;
    self.delegate = self;
  }
  return self;
}

+ (UISplitViewControllerStyle)styleByNumberOfColumns:(NSInteger)columnCount
{
  switch (columnCount) {
    case 2:
      return UISplitViewControllerStyleDoubleColumn;
    case 3:
      return UISplitViewControllerStyleTripleColumn;
    default:
      return UISplitViewControllerStyleUnspecified;
  }
}

- (void)setNeedsUpdateOfChildViewControllers
{
  _needsChildViewControllersUpdate = YES;
}

- (void)setNeedsAppearanceUpdate
{
  [_appearanceCoordinator needsUpdateForFlag:RNSSplitViewAppearanceUpdateFlagGeneralUpdate];
}

- (void)setNeedsSecondaryScreenNavBarUpdate
{
  [_appearanceCoordinator needsUpdateForFlag:RNSSplitViewAppearanceUpdateFlagSecondaryNavBarUpdate];
}

- (void)setNeedsDisplayModeUpdate
{
  [_appearanceCoordinator needsUpdateForFlag:RNSSplitViewAppearanceUpdateFlagDisplayModeUpdate];
}

- (void)setNeedsOrientationUpdate
{
  [_appearanceCoordinator needsUpdateForFlag:RNSSplitViewAppearanceUpdateFlagOrientationUpdate];
}

- (void)updateChildViewControllersIfNeeded
{
  if (_needsChildViewControllersUpdate) {
    [self updateChildViewControllers];
  }
}

- (void)updateChildViewControllers
{
  NSAssert(_needsChildViewControllersUpdate, @"[RNScreens] Controller must be marked dirty before update!");

  NSArray *columns = [self filterSubviewsOfType:RNSSplitViewScreenColumnTypeColumn
                                   fromSubviews:[self splitViewReactSubviews]];
  NSArray *inspectors = [self filterSubviewsOfType:RNSSplitViewScreenColumnTypeInspector
                                      fromSubviews:[self splitViewReactSubviews]];

  [self validateColumns:columns];
  [self validateInspectors:inspectors];

  NSMutableArray *viewControllers = [NSMutableArray array];
  for (RNSSplitViewScreenComponentView *component in columns) {
    RNSSplitViewNavigationController *nav =
        [[RNSSplitViewNavigationController alloc] initWithRootViewController:component.controller];
    nav.viewFrameOriginChangeObserver = self;
    [viewControllers addObject:nav];
  }

  self.viewControllers = viewControllers;

  if (@available(iOS 26.0, *)) {
    [self maybeSetupInspector:inspectors];
  }

  _needsChildViewControllersUpdate = NO;
}

- (void)updateSplitViewAppearanceIfNeeded
{
  [_appearanceApplicator updateAppearanceIfNeededWithSplitView:_hostComponentView
                                           splitViewController:self
                                         appearanceCoordinator:_appearanceCoordinator];
}

- (NSArray *)filterSubviewsOfType:(RNSSplitViewScreenColumnType)type
                     fromSubviews:(NSArray<RNSSplitViewScreenComponentView *> *)subviews
{
  NSPredicate *predicate =
      [NSPredicate predicateWithBlock:^BOOL(RNSSplitViewScreenComponentView *obj, NSDictionary *bindings) {
        return obj.columnType == type;
      }];
  return [subviews filteredArrayUsingPredicate:predicate];
}

- (NSArray *)splitViewReactSubviews
{
  NSMutableArray *views = [NSMutableArray array];
  for (id view in [_hostComponentView reactSubviews]) {
    NSAssert([view isKindOfClass:[RNSSplitViewScreenComponentView class]], @"[RNScreens] Expected component view");
    [views addObject:(RNSSplitViewScreenComponentView *)view];
  }
  return views;
}

- (void)refreshSecondaryNavBar
{
  UIViewController *secondaryVC = [self viewControllerForColumn:UISplitViewControllerColumnSecondary];
  NSAssert(secondaryVC != nil, @"Secondary VC is nil");
  NSAssert([secondaryVC isKindOfClass:[UINavigationController class]], @"Expected UINavigationController");
  UINavigationController *nav = (UINavigationController *)secondaryVC;
  [nav setNavigationBarHidden:YES animated:NO];
  [nav setNavigationBarHidden:NO animated:NO];
}

- (void)toggleSplitViewInspector:(BOOL)showInspector
{
}

- (void)reactMountingTransactionWillMount
{
  // noop
}

- (void)reactMountingTransactionDidMount
{
  [self updateChildViewControllersIfNeeded];
  [self updateSplitViewAppearanceIfNeeded];
  [self validateSplitViewHierarchy];
}

- (NSInteger)evaluateOrientation
{
  return [_hostComponentView orientation];
}

#pragma mark - Validation

- (void)validateSplitViewHierarchy
{
  NSArray *columns = [self filterSubviewsOfType:RNSSplitViewScreenColumnTypeColumn
                                   fromSubviews:[self splitViewReactSubviews]];
  NSArray *inspectors = [self filterSubviewsOfType:RNSSplitViewScreenColumnTypeInspector
                                      fromSubviews:[self splitViewReactSubviews]];
  [self validateColumns:columns];
  [self validateInspectors:inspectors];
}

- (void)validateColumns:(NSArray *)columns
{
  NSAssert(
      columns.count >= kMinColumnsCount && columns.count <= kMaxColumnsCount, @"[RNScreens] Invalid columns count");
  NSAssert(columns.count == _fixedColumnsCount, @"[RNScreens] Columns count shouldn't change dynamically");
}

- (void)validateInspectors:(NSArray *)inspectors
{
  NSAssert(inspectors.count <= kMaxInspectorCount, @"[RNScreens] Only 1 inspector allowed");
}

// iOS 26+
- (void)maybeSetupInspector:(NSArray *)inspectors
{
  if (@available(iOS 26.0, *)) {
    RNSSplitViewScreenComponentView *inspector = inspectors.firstObject;
    if (inspector) {
      RNSSplitViewNavigationController *nav =
          [[RNSSplitViewNavigationController alloc] initWithRootViewController:inspector.controller];
      [self setViewController:nav forColumn:UISplitViewControllerColumnInspector];
    }
  }
}

#pragma mark - UISplitViewControllerDelegate

- (void)splitViewControllerDidCollapse:(UISplitViewController *)svc
{
  [_hostComponentView.reactEventEmitter emitOnCollapse];
}

- (void)splitViewControllerDidExpand:(UISplitViewController *)svc
{
  [_hostComponentView.reactEventEmitter emitOnExpand];
}

- (void)splitViewController:(UISplitViewController *)svc
    willChangeToDisplayMode:(UISplitViewControllerDisplayMode)displayMode
{
  if (self.displayMode != displayMode) {
    [_hostComponentView.reactEventEmitter emitOnDisplayModeWillChangeFrom:self.displayMode to:displayMode];
  }
}

@end
