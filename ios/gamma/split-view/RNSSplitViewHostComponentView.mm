#import "RNSSplitViewHostComponentView.h"
#import <React/RCTAssert.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>

#import "RNSConversions.h"
#import "RNSDefines.h"
#import "RNSSplitViewScreenComponentView.h"
#import "Swift-Bridging.h"

namespace react = facebook::react;

static const CGFloat epsilon = 1e-6;

#define COLUMN_METRIC_CHANGED(OLD, NEW, PROPERTY_NAME, EPSILON) \
  (fabs((OLD).columnMetrics.PROPERTY_NAME - (NEW).columnMetrics.PROPERTY_NAME) > (EPSILON))

@interface RNSSplitViewHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSSplitViewHostComponentView {
  RNSSplitViewHostComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSSplitViewHostController *_Nonnull _controller;
  NSMutableArray<RNSSplitViewScreenComponentView *> *_Nonnull _reactSubviews;

  bool _hasModifiedReactSubviewsInCurrentTransaction;
  bool _needsSplitViewAppearanceUpdate;
  bool _needsSplitViewSecondaryScreenNavBarUpdate;
  bool _needsSplitViewDisplayModeUpdate;
  // We need this information to warn users about dynamic changes to behavior being currently unsupported.
  bool _isShowSecondaryToggleButtonSet;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  [self resetProps];

  _reactEventEmitter = [RNSSplitViewHostComponentEventEmitter new];

  _hasModifiedReactSubviewsInCurrentTransaction = false;
  _needsSplitViewAppearanceUpdate = false;
  _needsSplitViewSecondaryScreenNavBarUpdate = false;
  _needsSplitViewDisplayModeUpdate = false;
  _reactSubviews = [NSMutableArray new];
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSplitViewHostProps>();
  _props = defaultProps;

  _preferredSplitBehavior = UISplitViewControllerSplitBehaviorAutomatic;
  _primaryEdge = UISplitViewControllerPrimaryEdgeLeading;
  _preferredDisplayMode = UISplitViewControllerDisplayModeAutomatic;
  _displayModeButtonVisibility = UISplitViewControllerDisplayModeButtonVisibilityAutomatic;
  _presentsWithGesture = true;
  _showSecondaryToggleButton = false;
  _showInspector = false;

  _minimumPrimaryColumnWidth = -1.0;
  _maximumPrimaryColumnWidth = -1.0;
  _preferredPrimaryColumnWidthOrFraction = -1.0;
  _minimumSupplementaryColumnWidth = -1.0;
  _maximumSupplementaryColumnWidth = -1.0;
  _preferredSupplementaryColumnWidthOrFraction = -1.0;

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
  _minimumSecondaryColumnWidth = -1.0;
  _preferredSecondaryColumnWidthOrFraction = -1.0;
  _minimumInspectorColumnWidth = -1.0;
  _maximumInspectorColumnWidth = -1.0;
  _preferredInspectorColumnWidthOrFraction = -1.0;
#endif

  _isShowSecondaryToggleButtonSet = false;
}

- (int)getNumberOfColumns
{
  int numberOfColumns = 0;
  for (RNSSplitViewScreenComponentView *component in _reactSubviews) {
    if (component.columnType == RNSSplitViewScreenColumnTypeColumn) {
      numberOfColumns++;
    }
  }
  return numberOfColumns;
}

- (void)setupController
{
  // Controller needs to know about the number of reactSubviews before its initialization to pass proper number of
  // columns to the constructor. Therefore, we must delay it's creation until attaching it to window.
  // At this point, children are already attached to the Host component, therefore, we may create SplitView controller.
  if (_controller == nil) {
    int numberOfColumns = [self getNumberOfColumns];

    _controller = [[RNSSplitViewHostController alloc] initWithSplitViewHostComponentView:self
                                                                         numberOfColumns:numberOfColumns];
  }
}

- (void)willMoveToWindow:(UIWindow *)newWindow
{
  if (newWindow == nil) {
    [self invalidate];
  }
}

- (void)didMoveToWindow
{
  [self setupController];
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil while attaching to window");
  [self requestSplitViewHostControllerForAppearanceUpdate];
  [self reactAddControllerToClosestParent:_controller];
}

- (void)reactAddControllerToClosestParent:(UIViewController *)controller
{
  if (!controller.parentViewController) {
    UIView *parentView = (UIView *)self.reactSuperview;
    while (parentView) {
      if (parentView.reactViewController) {
        [parentView.reactViewController addChildViewController:controller];
        [self addSubview:controller.view];
        [controller didMoveToParentViewController:parentView.reactViewController];
        break;
      }
      parentView = (UIView *)parentView.reactSuperview;
    }
    return;
  }
}

- (void)invalidate
{
  // We assume that split host is removed from view hierarchy **only** when
  // whole component is destroyed & therefore we do the necessary cleanup here.
  // If at some point that statement does not hold anymore, this cleanup
  // should be moved to a different place.
  for (RNSSplitViewScreenComponentView *subview in _reactSubviews) {
    [subview invalidate];
  }
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (nonnull NSMutableArray<RNSSplitViewScreenComponentView *> *)reactSubviews
{
  RCTAssert(
      _reactSubviews != nil,
      @"[RNScreens] Attempt to work with non-initialized list of RNSSplitViewScreenComponentView subviews. (for: %@)",
      self);
  return _reactSubviews;
}
RNS_IGNORE_SUPER_CALL_END

- (nonnull RNSSplitViewHostController *)splitViewHostController
{
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil");
  return _controller;
}

#pragma mark - RCTViewComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSSplitViewScreenComponentView.class],
      @"[RNScreens] Attempt to mount child of unsupported type: %@, expected %@",
      childComponentView.class,
      RNSSplitViewScreenComponentView.class);

  auto *childScreen = static_cast<RNSSplitViewScreenComponentView *>(childComponentView);
  childScreen.splitViewHost = self;
  [_reactSubviews insertObject:childScreen atIndex:index];
  _hasModifiedReactSubviewsInCurrentTransaction = true;
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSSplitViewScreenComponentView.class],
      @"[RNScreens] Attempt to unmount child of unsupported type: %@, expected %@",
      childComponentView.class,
      RNSSplitViewScreenComponentView.class);

  auto *childScreen = static_cast<RNSSplitViewScreenComponentView *>(childComponentView);
  childScreen.splitViewHost = nil;
  [_reactSubviews removeObject:childScreen];
  _hasModifiedReactSubviewsInCurrentTransaction = true;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSplitViewHostComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSSplitViewHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSSplitViewHostProps>(props);

  if (oldComponentProps.preferredSplitBehavior != newComponentProps.preferredSplitBehavior) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredSplitBehavior =
        rnscreens::conversion::SplitViewPreferredSplitBehaviorFromHostProp(newComponentProps.preferredSplitBehavior);
  }

  if (oldComponentProps.primaryEdge != newComponentProps.primaryEdge) {
    _needsSplitViewAppearanceUpdate = true;
    _primaryEdge = rnscreens::conversion::SplitViewPrimaryEdgeFromHostProp(newComponentProps.primaryEdge);
  }

  if (oldComponentProps.preferredDisplayMode != newComponentProps.preferredDisplayMode) {
    _needsSplitViewAppearanceUpdate = true;
    _needsSplitViewDisplayModeUpdate = true;
    _preferredDisplayMode =
        rnscreens::conversion::SplitViewPreferredDisplayModeFromHostProp(newComponentProps.preferredDisplayMode);
  }

  if (oldComponentProps.presentsWithGesture != newComponentProps.presentsWithGesture) {
    _needsSplitViewAppearanceUpdate = true;
    _presentsWithGesture = newComponentProps.presentsWithGesture;
  }

  if (oldComponentProps.showSecondaryToggleButton != newComponentProps.showSecondaryToggleButton) {
    _needsSplitViewAppearanceUpdate = true;
    _needsSplitViewSecondaryScreenNavBarUpdate = true;
    _showSecondaryToggleButton = newComponentProps.showSecondaryToggleButton;
  }

  if (oldComponentProps.showInspector != newComponentProps.showInspector) {
    _needsSplitViewAppearanceUpdate = true;
    _showInspector = newComponentProps.showInspector;
  }

  if (oldComponentProps.displayModeButtonVisibility != newComponentProps.displayModeButtonVisibility) {
    _needsSplitViewAppearanceUpdate = true;
    _displayModeButtonVisibility = rnscreens::conversion::SplitViewDisplayModeButtonVisibilityFromHostProp(
        newComponentProps.displayModeButtonVisibility);
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, minimumPrimaryColumnWidth, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _minimumPrimaryColumnWidth = newComponentProps.columnMetrics.minimumPrimaryColumnWidth;
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, maximumPrimaryColumnWidth, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _maximumPrimaryColumnWidth = newComponentProps.columnMetrics.maximumPrimaryColumnWidth;
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, preferredPrimaryColumnWidthOrFraction, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredPrimaryColumnWidthOrFraction = newComponentProps.columnMetrics.preferredPrimaryColumnWidthOrFraction;
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, minimumSupplementaryColumnWidth, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _minimumSupplementaryColumnWidth = newComponentProps.columnMetrics.minimumSupplementaryColumnWidth;
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, maximumSupplementaryColumnWidth, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _maximumSupplementaryColumnWidth = newComponentProps.columnMetrics.maximumSupplementaryColumnWidth;
  }

  if (COLUMN_METRIC_CHANGED(
          oldComponentProps, newComponentProps, preferredSupplementaryColumnWidthOrFraction, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredSupplementaryColumnWidthOrFraction =
        newComponentProps.columnMetrics.preferredSupplementaryColumnWidthOrFraction;
  }

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, minimumSecondaryColumnWidth, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _minimumSecondaryColumnWidth = newComponentProps.columnMetrics.minimumSecondaryColumnWidth;
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, preferredSecondaryColumnWidthOrFraction, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredSecondaryColumnWidthOrFraction = newComponentProps.columnMetrics.preferredSecondaryColumnWidthOrFraction;
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, minimumInspectorColumnWidth, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _minimumInspectorColumnWidth = newComponentProps.columnMetrics.minimumInspectorColumnWidth;
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, maximumInspectorColumnWidth, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _maximumInspectorColumnWidth = newComponentProps.columnMetrics.maximumInspectorColumnWidth;
  }

  if (COLUMN_METRIC_CHANGED(oldComponentProps, newComponentProps, preferredInspectorColumnWidthOrFraction, epsilon)) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredInspectorColumnWidthOrFraction = newComponentProps.columnMetrics.preferredInspectorColumnWidthOrFraction;
  }
#endif

  // This flag is set to true when showsSecondaryOnlyButton prop is assigned for the first time.
  // This allows us to identify any subsequent changes to this prop,
  // enabling us to warn users that dynamic changes are not supported.
  _isShowSecondaryToggleButtonSet = true;

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [self requestSplitViewHostControllerForAppearanceUpdate];
  [super finalizeUpdates:updateMask];
}

- (void)requestSplitViewHostControllerForAppearanceUpdate
{
  if (_needsSplitViewAppearanceUpdate && _controller != nil) {
    _needsSplitViewAppearanceUpdate = false;
    [_controller setNeedsAppearanceUpdate];
  }

  if (_needsSplitViewDisplayModeUpdate && _controller != nil) {
    _needsSplitViewDisplayModeUpdate = false;
    [_controller setNeedsDisplayModeUpdate];
  }

  if (_needsSplitViewSecondaryScreenNavBarUpdate && _controller != nil) {
    _needsSplitViewSecondaryScreenNavBarUpdate = false;
    [_controller setNeedsSecondaryScreenNavBarUpdate];
  }
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  _hasModifiedReactSubviewsInCurrentTransaction = false;
  [_controller reactMountingTransactionWillMount];
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (_hasModifiedReactSubviewsInCurrentTransaction) {
    [_controller setNeedsUpdateOfChildViewControllers];
  }
  [_controller reactMountingTransactionDidMount];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSSplitViewHostEventEmitter>(eventEmitter)];
}

#pragma mark - Events

- (nonnull RNSSplitViewHostComponentEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

@end

Class<RCTComponentViewProtocol> RNSSplitViewHostCls(void)
{
  return RNSSplitViewHostComponentView.class;
}

#undef COLUMN_METRIC_CHANGED
