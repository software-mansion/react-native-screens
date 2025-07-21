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

@interface RNSSplitViewHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSSplitViewHostComponentView {
  RNSSplitViewHostComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSSplitViewHostController *_Nonnull _controller;
  NSMutableArray<RNSSplitViewScreenComponentView *> *_Nonnull _reactSubviews;

  bool _hasModifiedReactSubviewsInCurrentTransaction;
  bool _needsSplitViewAppearanceUpdate;
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
  _reactSubviews = [NSMutableArray new];
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSplitViewHostProps>();
  _props = defaultProps;

  _splitBehavior = UISplitViewControllerSplitBehaviorAutomatic;
  _primaryEdge = UISplitViewControllerPrimaryEdgeLeading;
  _displayMode = UISplitViewControllerDisplayModeAutomatic;
  _displayModeButtonVisibility = UISplitViewControllerDisplayModeButtonVisibilityAutomatic;
  _presentsWithGesture = true;
  _showSecondaryToggleButton = false;
  _showInspector = false;

  _minimumPrimaryColumnWidth = -1;
  _maximumPrimaryColumnWidth = -1;
  _preferredPrimaryColumnWidth = -1;
  _minimumSupplementaryColumnWidth = -1;
  _maximumSupplementaryColumnWidth = -1;
  _preferredSupplementaryColumnWidth = -1;

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
  _minimumSecondaryColumnWidth = -1;
  _preferredSecondaryColumnWidth = -1;
  _minimumInspectorColumnWidth = -1;
  _maximumInspectorColumnWidth = -1;
  _preferredInspectorColumnWidth = -1;
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

- (void)didMoveToWindow
{
  [self setupController];
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil while attaching to window");

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

  if (oldComponentProps.splitBehavior != newComponentProps.splitBehavior) {
    _needsSplitViewAppearanceUpdate = true;
    _splitBehavior = rnscreens::conversion::SplitViewSplitBehaviorFromHostProp(newComponentProps.splitBehavior);
  }

  if (oldComponentProps.primaryEdge != newComponentProps.primaryEdge) {
    _needsSplitViewAppearanceUpdate = true;
    _primaryEdge = rnscreens::conversion::SplitViewPrimaryEdgeFromHostProp(newComponentProps.primaryEdge);
  }

  if (oldComponentProps.displayMode != newComponentProps.displayMode) {
    _needsSplitViewAppearanceUpdate = true;
    _displayMode = rnscreens::conversion::SplitViewDisplayModeFromHostProp(newComponentProps.displayMode);
  }

  if (oldComponentProps.presentsWithGesture != newComponentProps.presentsWithGesture) {
    _needsSplitViewAppearanceUpdate = true;
    _presentsWithGesture = newComponentProps.presentsWithGesture;
  }

  if (oldComponentProps.showSecondaryToggleButton != newComponentProps.showSecondaryToggleButton) {
    _needsSplitViewAppearanceUpdate = true;
    _showSecondaryToggleButton = newComponentProps.showSecondaryToggleButton;

    if (_isShowSecondaryToggleButtonSet) {
      RCTLogWarn(@"[RNScreens] changing showSecondaryToggleButton dynamically is currently unsupported");
    }
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

  if (oldComponentProps.columnMetrics.minimumPrimaryColumnWidth !=
      newComponentProps.columnMetrics.minimumPrimaryColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _minimumPrimaryColumnWidth = newComponentProps.columnMetrics.minimumPrimaryColumnWidth;
  }

  if (oldComponentProps.columnMetrics.maximumPrimaryColumnWidth !=
      newComponentProps.columnMetrics.maximumPrimaryColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _maximumPrimaryColumnWidth = newComponentProps.columnMetrics.maximumPrimaryColumnWidth;
  }

  if (oldComponentProps.columnMetrics.preferredPrimaryColumnWidth !=
      newComponentProps.columnMetrics.preferredPrimaryColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredPrimaryColumnWidth = newComponentProps.columnMetrics.preferredPrimaryColumnWidth;
  }

  if (oldComponentProps.columnMetrics.minimumSupplementaryColumnWidth !=
      newComponentProps.columnMetrics.minimumSupplementaryColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _minimumSupplementaryColumnWidth = newComponentProps.columnMetrics.minimumSupplementaryColumnWidth;
  }

  if (oldComponentProps.columnMetrics.maximumSupplementaryColumnWidth !=
      newComponentProps.columnMetrics.maximumSupplementaryColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _maximumSupplementaryColumnWidth = newComponentProps.columnMetrics.maximumSupplementaryColumnWidth;
  }

  if (oldComponentProps.columnMetrics.preferredSupplementaryColumnWidth !=
      newComponentProps.columnMetrics.preferredSupplementaryColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredSupplementaryColumnWidth = newComponentProps.columnMetrics.preferredSupplementaryColumnWidth;
  }

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
  if (oldComponentProps.columnMetrics.minimumSecondaryColumnWidth !=
      newComponentProps.columnMetrics.minimumSecondaryColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _minimumSecondaryColumnWidth = newComponentProps.columnMetrics.minimumSecondaryColumnWidth;
  }

  if (oldComponentProps.columnMetrics.preferredSecondaryColumnWidth !=
      newComponentProps.columnMetrics.preferredSecondaryColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredSecondaryColumnWidth = newComponentProps.columnMetrics.preferredSecondaryColumnWidth;
  }

  if (oldComponentProps.columnMetrics.minimumInspectorColumnWidth !=
      newComponentProps.columnMetrics.minimumInspectorColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _minimumInspectorColumnWidth = newComponentProps.columnMetrics.minimumInspectorColumnWidth;
  }

  if (oldComponentProps.columnMetrics.maximumInspectorColumnWidth !=
      newComponentProps.columnMetrics.maximumInspectorColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _maximumInspectorColumnWidth = newComponentProps.columnMetrics.maximumInspectorColumnWidth;
  }

  if (oldComponentProps.columnMetrics.preferredInspectorColumnWidth !=
      newComponentProps.columnMetrics.preferredInspectorColumnWidth) {
    _needsSplitViewAppearanceUpdate = true;
    _preferredInspectorColumnWidth = newComponentProps.columnMetrics.preferredInspectorColumnWidth;
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
  if (_needsSplitViewAppearanceUpdate) {
    _needsSplitViewAppearanceUpdate = false;
    [_controller setNeedsAppearanceUpdate];
  }
  [super finalizeUpdates:updateMask];
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
