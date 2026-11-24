#import "RNSSplitScreenComponentView.h"
#import <React/RCTAssert.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/RNSSplitScreenComponentDescriptor.h>
#import "RNSAssert.h"
#import "RNSConversions-SplitView.h"
#import "RNSNavigationItemCustomizing.h" // legacy-compat: configures the header of a column with the legacy stack
#import "RNSSplitColumnCoordinator.h"
#import "RNSSplitHostComponentView.h"
#import "RNSSplitHostController.h"
#import "RNSSplitPlainColumnContentView.h"
#import "RNSSplitScreenComponentEventEmitter.h"
#import "RNSSplitScreenShadowStateProxy.h"
#import "RNSStackHostComponentView.h"
#import "RNSStackNavigationController.h"

namespace react = facebook::react;

@interface RNSSplitScreenComponentView () <RNSSplitColumnCoordinatorDelegate>
@end

@implementation RNSSplitScreenComponentView {
  RNSSplitScreenComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSSplitColumnCoordinator *_Nullable _columnCoordinator;
  RNSSplitScreenShadowStateProxy *_Nonnull _shadowStateProxy;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;
  NSMutableSet<UIView *> *_viewsForFrameCorrection;
  __weak RNSStackHostComponentView *_Nullable _stackHost;
}

- (RNSSplitColumnCoordinator *)columnCoordinator
{
  RCTAssert(
      _columnCoordinator != nil,
      @"[RNScreens] Attempt to access RNSSplitColumnCoordinator before RNSSplitScreenComponentView was initialized. (for: %@)",
      self);
  return _columnCoordinator;
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
  [self setupColumnCoordinator];

  _reactEventEmitter = [RNSSplitScreenComponentEventEmitter new];
  _shadowStateProxy = [RNSSplitScreenShadowStateProxy new];

  _viewsForFrameCorrection = [NSMutableSet set];
}

- (void)setupColumnCoordinator
{
  _columnCoordinator = [RNSSplitColumnCoordinator new];
  _columnCoordinator.delegate = self;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSplitScreenProps>();
  _props = defaultProps;

  _columnType = RNSSplitScreenColumnTypeColumn;
}

- (void)registerForFrameCorrection:(UIView *)view
{
  [_viewsForFrameCorrection addObject:view];
}

- (void)unregisterFromFrameCorrection:(UIView *)view
{
  [_viewsForFrameCorrection removeObject:view];
}

#pragma mark - Stack host

- (BOOL)isStackHostOfColumn:(UIView<RCTComponentViewProtocol> *)childComponentView
{
  // The stack host is an only child of the column.
  BOOL hasOtherChildren = _stackHost != nil || _columnCoordinator.plainColumnContentView.subviews.count > 0;
  if (hasOtherChildren || ![childComponentView isKindOfClass:RNSStackHostComponentView.class]) {
    return NO;
  }
  return static_cast<RNSStackHostComponentView *>(childComponentView).headlessModeEnabled;
}

- (void)setStackHost:(nullable RNSStackHostComponentView *)stackHost
{
  _stackHost = stackHost;
  _columnCoordinator.hostedStackNavigationController = _stackHost.stackNavigationController;

  // The column provides another navigation controller now. The one its coordinator created is not used anymore, and
  // the Split has to install the one that takes its place.
  [_columnCoordinator releasePlainColumnNavigationController];
  [_splitHost.splitHostController setNeedsUpdateOfChildViewControllers];
}

- (RNSStackNavigationController *)columnNavigationController
{
  if (_stackHost != nil) {
    return _stackHost.stackNavigationController;
  }
  return _columnCoordinator.plainColumnNavigationController;
}

#pragma mark - Layout

/**
 * This override **should be considered as a workaround** for which I made some assumptions:
 * 1. All parents of views with associated `UINavigationController` should have the same width as the SplitView column
 * 2. I'm greedily aligning all native components which are extending `UINavigationController` - is covers both old and
 * new stack implementations, however, it will have an impact on any other native component which will be extending
 * from the same class.
 */
- (void)layoutSubviews
{
  [super layoutSubviews];
}

#pragma mark - RNSSplitColumnCoordinatorDelegate

- (void)splitColumnCoordinator:(RNSSplitColumnCoordinator *)coordinator didChangeColumnFrame:(CGRect)frame
{
  [_shadowStateProxy updateShadowStateWithFrame:frame];
}

- (void)splitColumnWillAppear:(RNSSplitColumnCoordinator *)coordinator
{
  [_reactEventEmitter emitOnWillAppear];
}

- (void)splitColumnDidAppear:(RNSSplitColumnCoordinator *)coordinator
{
  [_reactEventEmitter emitOnDidAppear];
}

- (void)splitColumnWillDisappear:(RNSSplitColumnCoordinator *)coordinator
{
  [_reactEventEmitter emitOnWillDisappear];
}

- (void)splitColumnDidDisappear:(RNSSplitColumnCoordinator *)coordinator
{
  [_reactEventEmitter emitOnDidDisappear];
}

- (void)splitColumnCoordinator:(RNSSplitColumnCoordinator *)coordinator
    plainColumnContentViewDidMoveToWindow:(nullable UIWindow *)window
{
  // Starting from iOS 26, a new column type called 'inspector' was introduced.
  // This column can be displayed as a modal, independent of the React Native view hierarchy.
  // In contrast, prior to iOS 26, all SplitView columns were placed under RCTSurface,
  // meaning that touches were handler by RN handlers.
  if (@available(iOS 26.0, *)) {
    // If the column is installed in a RNSSplitHostController,
    // we know that we're still inside the RN hierarchy,
    // so there's no need to enforce additional touch event support.
    if ([_columnCoordinator isInSplitHostSubtree]) {
      return;
    }

    UIView *contentView = _columnCoordinator.plainColumnContentView;
    if (window != nil) {
      if (_touchHandler == nil) {
        _touchHandler = [RCTSurfaceTouchHandler new];
      }
      [_touchHandler attachToView:contentView];
    } else {
      [_touchHandler detachFromView:contentView];
    }
  }
}

#pragma mark - RCTComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSplitScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([self isStackHostOfColumn:childComponentView]) {
    [self setStackHost:static_cast<RNSStackHostComponentView *>(childComponentView)];
    return;
  }

  RNSAssert(_stackHost == nil, @"[RNScreens] Stack.Host that navigates a Split.Column has to be its only child");

  // The view of the column is not in the view hierarchy. Its content is added to the view of the view controller the
  // column is rooted at.
  [_columnCoordinator.plainColumnContentView insertSubview:childComponentView atIndex:index];

  if ([childComponentView conformsToProtocol:@protocol(RNSNavigationItemCustomizing)]) {
    [(id<RNSNavigationItemCustomizing>)childComponentView
        configureNavigationItem:_columnCoordinator.plainColumnNavigationItem];
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if (childComponentView == _stackHost) {
    [self setStackHost:nil];
    return;
  }

  [childComponentView removeFromSuperview];
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];

  [_shadowStateProxy updateState:state oldState:oldState];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSSplitScreenProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSSplitScreenProps>(props);

  if (oldComponentProps.columnType != newComponentProps.columnType) {
    _columnType = rnscreens::conversion::RNSSplitScreenColumnTypeFromScreenProp(newComponentProps.columnType);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSSplitScreenEventEmitter>(eventEmitter)];
}

- (void)invalidate
{
  [_columnCoordinator releasePlainColumnNavigationController];
  _columnCoordinator = nil;
}

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

Class<RCTComponentViewProtocol> RNSSplitScreenCls(void)
{
  return RNSSplitScreenComponentView.class;
}
