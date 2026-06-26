#import "RNSStackHeaderConfigComponentView.h"
#import "RNSLog.h"
#import "RNSStackHeaderConfigEventEmitter.h"
#import "RNSStackHeaderConfigShadowStateProxy.h"
#import "RNSStackHeaderContentFactory.h"
#import "RNSStackHeaderData.h"
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderItemComponentView.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSStackHeaderItemSpacerComponentView.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenComponentView.h"
#import "RNSStackScreenController.h"
#import "RNSStackScreenHeaderCoordinator.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSStackHeaderConfigComponentDescriptor.h>

namespace react = facebook::react;

static void RNSAssertIsValidHeaderChild(UIView *child)
{
  RCTAssert([child isKindOfClass:RNSStackHeaderItemComponentView.class] ||
                [child isKindOfClass:RNSStackHeaderItemSpacerComponentView.class],
            @"[RNScreens] Unexpected child of type: %@, expected %@ or %@",
            child.class,
            RNSStackHeaderItemComponentView.class,
            RNSStackHeaderItemSpacerComponentView.class);
}

@interface RNSStackHeaderConfigComponentView () <RNSStackHeaderItemInvalidationDelegate, RNSStackHeaderEventsDelegate>
@end

@implementation RNSStackHeaderConfigComponentView {
  NSString *_Nullable _title;
  NSString *_Nullable _subtitle;
  BOOL _hidden;
  NSString *_Nullable _largeTitle;
  NSString *_Nullable _largeSubtitle;
  BOOL _largeTitleEnabled;

  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_Nonnull _children;

  std::shared_ptr<const react::RNSStackHeaderConfigShadowNode::ConcreteState> _state;
  RNSStackHeaderConfigShadowStateProxy *_Nonnull _shadowStateProxy;
  RNSStackHeaderConfigEventEmitter *_Nonnull _reactEventEmitter;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSStackHeaderConfigIOSProps>();
    _props = defaultProps;
    _children = [NSMutableArray new];
    _shadowStateProxy = [[RNSStackHeaderConfigShadowStateProxy alloc] initWithHeaderConfigView:self];
    _reactEventEmitter = [RNSStackHeaderConfigEventEmitter new];
    [self resetProps];
  }
  return self;
}

- (void)resetProps
{
  _title = nil;
  _subtitle = nil;
  _hidden = NO;
  _largeTitle = nil;
  _largeSubtitle = nil;
  _largeTitleEnabled = NO;
}

#pragma mark - UIView lifecycle

- (void)didMoveToWindow
{
  if (self.window != nil) {
    [[self requireNavigationController] setNavigationBarFrameChangeDelegate:self];
    [self submitCurrentData];
  }
  [super didMoveToWindow];
}

#pragma mark - Child mounting

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RNSAssertIsValidHeaderChild(childComponentView);

  // Do NOT call super — children are not added to the view hierarchy.
  // They are tracked here and converted to UIBarButtonItems in submitCurrentData.
  [_children insertObject:childComponentView atIndex:index];

  if ([childComponentView isKindOfClass:RNSStackHeaderItemComponentView.class]) {
    ((RNSStackHeaderItemComponentView *)childComponentView).invalidationDelegate = self;
  } else if ([childComponentView isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
    ((RNSStackHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = self;
  }

  [self submitCurrentDataIfMounted];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RNSAssertIsValidHeaderChild(childComponentView);

  if ([childComponentView isKindOfClass:RNSStackHeaderItemComponentView.class]) {
    ((RNSStackHeaderItemComponentView *)childComponentView).invalidationDelegate = nil;
  } else if ([childComponentView isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
    ((RNSStackHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = nil;
  }

  [_children removeObjectAtIndex:index];
  [self submitCurrentDataIfMounted];
}

#pragma mark - RNSStackHeaderItemInvalidationDelegate

- (void)headerItemDidInvalidate
{
  [self submitCurrentDataIfMounted];
}

#pragma mark - RNSStackHeaderEventsDelegate

- (void)didPressMenuItem:(NSString *)menuItemId
{
  [_reactEventEmitter emitOnMenuItemPress:menuItemId];
}

- (void)didChangeSelectionForMenu:(NSString *)menuId selectedMenuItemIds:(NSArray<NSString *> *)selectedIds
{
  [_reactEventEmitter emitOnMenuSelectionChange:menuId selectedMenuItemIds:selectedIds];
  // UIKit doesn't update UIAction.state after tap — rebuild menu so tracker state is reflected
  [self submitCurrentDataIfMounted];
}

- (void)didPressHeaderItem:(NSString *)itemId
{
  for (UIView *child in _children) {
    if ([child isKindOfClass:RNSStackHeaderItemComponentView.class]) {
      RNSStackHeaderItemComponentView *item = (RNSStackHeaderItemComponentView *)child;
      if ([item.itemId isEqualToString:itemId]) {
        [item emitOnPress];
        return;
      }
    }
  }
}

#pragma mark - RNSViewFrameChangeDelegate

- (void)viewFrameDidChange:(nonnull UINavigationBar *)navigationBar
{
  if (_state == nullptr || self.superview == nil) {
    return;
  }

  for (UIView *child in _children) {
    if ([child isKindOfClass:RNSStackHeaderItemComponentView.class]) {
      [(id<RNSViewFrameChangeDelegate>)(child) viewFrameDidChange:navigationBar];
    }
  }

  UIView *screenView = self.superview;
  CGRect navBarFrame = [navigationBar convertRect:navigationBar.bounds toView:screenView];
  [_shadowStateProxy updateShadowStateWithFrame:navBarFrame];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSStackHeaderConfigShadowNode::ConcreteState>(state);
}

- (react::RNSStackHeaderConfigShadowNode::ConcreteState::Shared)state
{
  return _state;
}

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &newHeaderProps = *std::static_pointer_cast<const react::RNSStackHeaderConfigIOSProps>(props);
  const auto &oldHeaderProps = *std::static_pointer_cast<const react::RNSStackHeaderConfigIOSProps>(_props);

  if (oldHeaderProps.title != newHeaderProps.title) {
    _title = RCTNSStringFromStringNilIfEmpty(newHeaderProps.title);
  }

  if (oldHeaderProps.subtitle != newHeaderProps.subtitle) {
    _subtitle = RCTNSStringFromStringNilIfEmpty(newHeaderProps.subtitle);
  }

  if (oldHeaderProps.hidden != newHeaderProps.hidden) {
    _hidden = newHeaderProps.hidden;
  }

  if (oldHeaderProps.largeTitle != newHeaderProps.largeTitle) {
    _largeTitle = RCTNSStringFromStringNilIfEmpty(newHeaderProps.largeTitle);
  }

  if (oldHeaderProps.largeSubtitle != newHeaderProps.largeSubtitle) {
    _largeSubtitle = RCTNSStringFromStringNilIfEmpty(newHeaderProps.largeSubtitle);
  }

  if (oldHeaderProps.largeTitleEnabled != newHeaderProps.largeTitleEnabled) {
    _largeTitleEnabled = newHeaderProps.largeTitleEnabled;
  }

  [super updateProps:props oldProps:oldProps];

  [self submitCurrentDataIfMounted];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSStackHeaderConfigComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSStackHeaderConfigIOSEventEmitter>(eventEmitter)];
}

#pragma mark - Private

- (void)submitCurrentDataIfMounted
{
  if (self.superview != nil) {
    [self submitCurrentData];
  }
}

- (void)submitCurrentData
{
  RNSStackScreenComponentView *screen = (RNSStackScreenComponentView *)self.superview;

  NSMutableArray<UIBarButtonItem *> *leadingItems = [NSMutableArray new];
  NSMutableArray<UIBarButtonItem *> *trailingItems = [NSMutableArray new];
  UIView *titleView = nil;
  UIView *subtitleView = nil;
  UIView *largeSubtitleView = nil;
  [self buildBarButtonItemsWithLeadingItems:leadingItems
                              trailingItems:trailingItems
                                  titleView:&titleView
                               subtitleView:&subtitleView
                          largeSubtitleView:&largeSubtitleView];

  RNSStackHeaderData *data = [[RNSStackHeaderData alloc] initWithTitle:_title
                                                              subtitle:_subtitle
                                                             screenKey:screen.screenKey
                                                                hidden:_hidden
                                                            largeTitle:_largeTitle
                                                         largeSubtitle:_largeSubtitle
                                                     largeTitleEnabled:_largeTitleEnabled
                                                 leadingBarButtonItems:leadingItems
                                                trailingBarButtonItems:trailingItems
                                                             titleView:titleView
                                                          subtitleView:subtitleView
                                                     largeSubtitleView:largeSubtitleView];
  [screen.controller.headerCoordinator submitHeaderData:data];
}

- (void)buildBarButtonItemsWithLeadingItems:(NSMutableArray<UIBarButtonItem *> *)leadingItems
                              trailingItems:(NSMutableArray<UIBarButtonItem *> *)trailingItems
                                  titleView:(UIView *_Nullable *_Nonnull)outTitleView
                               subtitleView:(UIView *_Nullable *_Nonnull)outSubtitleView
                          largeSubtitleView:(UIView *_Nullable *_Nonnull)outLargeSubtitleView
{
  for (UIView *child in _children) {
    if ([child isKindOfClass:RNSStackHeaderItemComponentView.class]) {
      auto *item = static_cast<RNSStackHeaderItemComponentView *>(child);
      switch (item.placement) {
        case RNSHeaderItemPlacementLeading:
          [leadingItems addObject:[RNSStackHeaderContentFactory barButtonItemForHeaderItem:item
                                                                   withFrameChangeDelegate:self
                                                                  withHeaderEventsDelegate:self]];
          break;
        case RNSHeaderItemPlacementTrailing:
          [trailingItems addObject:[RNSStackHeaderContentFactory barButtonItemForHeaderItem:item
                                                                    withFrameChangeDelegate:self
                                                                   withHeaderEventsDelegate:self]];
          break;
        case RNSHeaderItemPlacementTitle:
          if (item.customView != nil) {
            *outTitleView = [RNSStackHeaderContentFactory wrappedViewForHeaderItem:item frameChangeDelegate:self];
          }
          break;
        case RNSHeaderItemPlacementSubtitle:
          if (item.customView != nil) {
            *outSubtitleView = [RNSStackHeaderContentFactory wrappedViewForHeaderItem:item frameChangeDelegate:self];
          }
          break;
        case RNSHeaderItemPlacementLargeSubtitle:
          if (item.customView != nil) {
            *outLargeSubtitleView = [RNSStackHeaderContentFactory wrappedViewForHeaderItem:item
                                                                       frameChangeDelegate:self];
          }
          break;
      }
    } else if ([child isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
      auto *spacer = static_cast<RNSStackHeaderItemSpacerComponentView *>(child);
      switch (spacer.placement) {
        case RNSHeaderItemSpacerPlacementLeading:
          [leadingItems addObject:[RNSStackHeaderContentFactory spacerForHeaderSpacerItem:spacer]];
          break;
        case RNSHeaderItemSpacerPlacementTrailing:
          [trailingItems addObject:[RNSStackHeaderContentFactory spacerForHeaderSpacerItem:spacer]];
          break;
      }
    }
  }
}

- (RNSStackNavigationController *)requireNavigationController
{
  RCTAssert([self.superview isKindOfClass:RNSStackScreenComponentView.class],
            @"[RNScreens] Header Config should be a direct child of RNSStackScreenComponentView");
  RNSStackScreenController *screenController = static_cast<RNSStackScreenComponentView *>(self.superview).controller;
  UINavigationController *navController = screenController.navigationController;
  RCTAssert(navController != nil, @"[RNScreens] NavigationController should be initialized at this point");
  RCTAssert([navController isKindOfClass:RNSStackNavigationController.class],
            @"[RNScreens] NavigationController should be instance of RNSStackNavigationController");
  return (RNSStackNavigationController *)navController;
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

Class<RCTComponentViewProtocol> RNSStackHeaderConfigComponentViewCls(void)
{
  return RNSStackHeaderConfigComponentView.class;
}
