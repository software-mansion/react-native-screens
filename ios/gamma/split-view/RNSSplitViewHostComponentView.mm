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
  RNSSplitViewHostController *_Nonnull _controller;
  NSMutableArray<RNSSplitViewScreenComponentView *> *_Nonnull _reactSubviews;

  bool _hasModifiedReactSubviewsInCurrentTransaction;
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
  //    TODO: For now I'm hardcoding style in init, but style cannot be updated outside controller's constructor, thus
  //    we'll need to delay the initialization unitl Screen components will be mounted
  _controller =
      [[RNSSplitViewHostController alloc] initWithSplitViewHostComponentView:self
                                                                       style:UISplitViewControllerStyleTripleColumn];
  _hasModifiedReactSubviewsInCurrentTransaction = false;
  _reactSubviews = [NSMutableArray new];
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSplitViewHostProps>();
  _props = defaultProps;

  _splitBehavior = UISplitViewControllerSplitBehaviorAutomatic;
  _primaryEdge = UISplitViewControllerPrimaryEdgeLeading;
  _displayMode = UISplitViewControllerDisplayModeAutomatic;
  _presentsWithGesture = true;
  _showSecondaryToggleButton = false;

  _isShowSecondaryToggleButtonSet = false;
}

- (void)didMoveToWindow
{
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
    _splitBehavior = rnscreens::conversion::SplitViewSplitBehaviorFromHostProp(newComponentProps.splitBehavior);
    _controller.preferredSplitBehavior = _splitBehavior;
  }

  if (oldComponentProps.primaryEdge != newComponentProps.primaryEdge) {
    _primaryEdge = rnscreens::conversion::SplitViewPrimaryEdgeFromHostProp(newComponentProps.primaryEdge);
    _controller.primaryEdge = _primaryEdge;
  }

  if (oldComponentProps.displayMode != newComponentProps.displayMode) {
    _displayMode = rnscreens::conversion::SplitViewDisplayModeFromHostProp(newComponentProps.displayMode);
    _controller.preferredDisplayMode = _displayMode;
  }

  if (oldComponentProps.presentsWithGesture != newComponentProps.presentsWithGesture) {
    _presentsWithGesture = newComponentProps.presentsWithGesture;
    _controller.presentsWithGesture = _presentsWithGesture;
  }

  if (oldComponentProps.showSecondaryToggleButton != newComponentProps.showSecondaryToggleButton) {
    _showSecondaryToggleButton = newComponentProps.showSecondaryToggleButton;
    _controller.showsSecondaryOnlyButton = _showSecondaryToggleButton;

    if (_isShowSecondaryToggleButtonSet) {
      RCTLogWarn(@"[RNScreens] changing showSecondaryToggleButton dynamically is currently unsupported");
    }
  }

  // This flag is set to true when showsSecondaryOnlyButton prop is assigned for the first time.
  // This allows us to identify any subsequent changes to this prop,
  // enabling us to warn users that dynamic changes are not supported.
  _isShowSecondaryToggleButtonSet = true;

  [super updateProps:props oldProps:oldProps];
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

@end

Class<RCTComponentViewProtocol> RNSSplitViewHostCls(void)
{
  return RNSSplitViewHostComponentView.class;
}
