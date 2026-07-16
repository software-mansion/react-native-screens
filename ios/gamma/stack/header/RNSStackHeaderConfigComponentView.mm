#import "RNSStackHeaderConfigComponentView.h"
#import "RNSImageLoadingHelper.h"
#import "RNSStackHeaderConfigEventEmitter.h"
#import "RNSStackHeaderConfigShadowStateProxy.h"
#import "RNSStackHeaderItemComponentView.h"
#import "RNSStackHeaderItemSpacerComponentView.h"
#import "RNSStackHeaderMenuFinder.h"
#import "RNSStackHeaderMenuUpdateOptions.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenComponentView.h"
#import "RNSStackScreenController.h"
#import "RNSStackScreenHeaderCoordinator.h"

#import <React/RCTConversions.h>
#import <React/RCTConvert.h>
#import <React/RCTImageLoader.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <react/utils/ManagedObjectWrapper.h>
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

@interface RNSStackHeaderConfigComponentView () <RCTRNSStackHeaderConfigIOSViewProtocol>
@end

@implementation RNSStackHeaderConfigComponentView {
  std::shared_ptr<const react::RNSStackHeaderConfigShadowNode::ConcreteState> _state;
  RNSStackHeaderConfigShadowStateProxy *_Nonnull _shadowStateProxy;
  RNSStackHeaderConfigEventEmitter *_Nonnull _reactEventEmitter;
  NSMutableArray<id> *_children;
  RCTImageLoader *_imageLoader;
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

- (NSArray<id> *)children
{
  return [_children copy];
}

#pragma mark - RNSImageLoading

- (void)loadImageFromJsonSource:(NSDictionary *)jsonSource
                     asTemplate:(BOOL)isTemplate
         withCompletionCallback:(void (^)(UIImage *_Nullable image))completionBlock
{
  if (_imageLoader == nil) {
    RCTLogError(@"[RNScreens] imageLoader must not be nil when loading images");
    completionBlock(nil);
    return;
  }

  RCTImageSource *imageSource = [RCTConvert RCTImageSource:jsonSource];
  if (imageSource == nil) {
    RCTLogError(@"[RNScreens] Expected nonnil image source");
    completionBlock(nil);
    return;
  }

  [RNSImageLoadingHelper loadImageFromSource:imageSource
                             withImageLoader:_imageLoader
                                  asTemplate:isTemplate
                             completionBlock:completionBlock];
}

#pragma mark - UIView

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  for (UIView *child in [_children reverseObjectEnumerator]) {
    if ([child isKindOfClass:RNSStackHeaderItemComponentView.class] && child.window != nil) {
      for (UIView *hitableView in [child.subviews reverseObjectEnumerator]) {
        CGPoint convertedPoint = [self convertPoint:point toView:hitableView];
        UIView *hitTestResult = [hitableView hitTest:convertedPoint withEvent:event];

        if (hitTestResult != nil) {
          return hitTestResult;
        }
      }
    }
  }
  return nil;
}

- (void)didMoveToWindow
{
  if (self.window != nil) {
    [[self requireNavigationController] setNavigationBarFrameChangeDelegate:self];
    RNSStackScreenHeaderCoordinator *coordinator = [self headerCoordinator];
    coordinator.configDataProvider = self;
    coordinator.frameChangeDelegate = self;
    coordinator.eventsDelegate = self;
    coordinator.imageLoader = self;
    [coordinator rebuild];
  } else {
    RNSStackScreenHeaderCoordinator *coordinator = [self headerCoordinator];
    coordinator.configDataProvider = nil;
    coordinator.frameChangeDelegate = nil;
    coordinator.eventsDelegate = nil;
    coordinator.imageLoader = nil;
  }
  [super didMoveToWindow];
}

#pragma mark - Child mounting

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RNSAssertIsValidHeaderChild(childComponentView);

  // Do NOT call super — children are not added to the view hierarchy.
  // They are tracked here and read by the coordinator during rebuild.
  [_children insertObject:childComponentView atIndex:index];

  if ([childComponentView isKindOfClass:RNSStackHeaderItemComponentView.class]) {
    ((RNSStackHeaderItemComponentView *)childComponentView).invalidationDelegate = self;
  } else if ([childComponentView isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
    ((RNSStackHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = self;
  }

  [[self headerCoordinator] rebuild];
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
  [[self headerCoordinator] rebuild];
}

#pragma mark - RNSStackHeaderItemInvalidationDelegate

- (void)headerItemDidInvalidateWithId:(NSString *)itemId
{
  if (itemId == nil) {
    RCTLogWarn(@"[RNScreens] headerItemDidInvalidateWithId called with nil id, will run full header rebuild");
    [[self headerCoordinator] rebuild];
    return;
  }
  [[self headerCoordinator] rebuildItemWithId:itemId];
}

- (void)headerItemMenuDidChangeWithId:(NSString *)itemId
{
  if (itemId == nil) {
    RCTLogWarn(@"[RNScreens] headerItemMenuDidChangeWithId called with nil id, will run full header rebuild");
    [[self headerCoordinator] rebuild];
    return;
  }
  RNSStackScreenHeaderCoordinator *coordinator = [self headerCoordinator];
  [coordinator resetTrackerForItemWithId:itemId];
  [coordinator reapplyMenuForItemWithId:itemId];
}

/**
 * Same as headerItemDidInvalidateWithId, but handles view commands and doesn't reset the tracker
 */
- (void)headerItemMenuDidUpdateFromCommandWithId:(NSString *)itemId
{
  if (itemId == nil) {
    RCTLogWarn(
        @"[RNScreens] headerItemMenuDidUpdateFromCommandWithId called with nil id, will run full header rebuild");
    [[self headerCoordinator] rebuild];
    return;
  }
  [[self headerCoordinator] reapplyMenuForItemWithId:itemId];
}

- (void)headerItemSpacerDidInvalidate
{
  [[self headerCoordinator] rebuild];
}

#pragma mark - RNSStackHeaderEventsDelegate

- (void)didPressMenuItem:(NSString *)menuItemId
{
  [_reactEventEmitter emitOnMenuItemPress:menuItemId];
}

- (void)didChangeSelectionForMenu:(NSString *)menuId selectedMenuItemIds:(NSArray<NSString *> *)selectedIds
{
  [_reactEventEmitter emitOnMenuSelectionChange:menuId selectedMenuItemIds:selectedIds];
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

#pragma mark - Commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
  RCTRNSStackHeaderConfigIOSHandleCommand(self, commandName, args);
}

- (void)setMenuItemOptions:(NSString *)menuItemId options:(const NSArray *)options
{
  NSDictionary *dict = [self extractOptionsDict:options];
  if (menuItemId == nil || dict == nil) {
    return;
  }

  RNSMenuElementLocator *locator = [RNSStackHeaderMenuFinder findMenuElementWithId:menuItemId
                                                                     inHeaderItems:[self headerItems]];
  if (locator == nil) {
    RCTLogWarn(@"[RNScreens] setMenuItemOptions: element with id \"%@\" not found", menuItemId);
    return;
  }
  if (![locator.searchResult.element isKindOfClass:[RNSStackHeaderMenuItemData class]]) {
    RCTLogWarn(@"[RNScreens] setMenuItemOptions: element \"%@\" is a menu, expected menuItem", menuItemId);
    return;
  }

  RNSMenuItemUpdateOptions *updateOptions = [RNSMenuItemUpdateOptions fromDictionary:dict];
  RNSStackHeaderMenuItemData *oldItemData = (RNSStackHeaderMenuItemData *)locator.searchResult.element;
  RNSStackHeaderMenuItemData *newItemData = [RNSMenuItemUpdateOptions applyOptions:updateOptions
                                                                        toMenuItem:oldItemData];

  if (updateOptions.hasToggleState) {
    BOOL isToggle = oldItemData.itemType == RNSMenuItemTypeToggle ||
        (oldItemData.itemType == RNSMenuItemTypeAutomatic && locator.headerItem.menu != nil &&
         [RNSStackHeaderMenuFinder singleSelectionRootForElementWithId:menuItemId
                                                                inMenu:locator.headerItem.menu] != nil);
    if (isToggle) {
      [[self headerCoordinator] setToggleState:updateOptions.toggleState
                              forMenuElementId:menuItemId
                                    withItemId:locator.headerItem.itemId
                                    parentMenu:locator.searchResult.parentMenu];
    }
  }

  switch (locator.position) {
    case RNSMenuElementPositionItem:
      RCTAssert([locator.headerItem isKindOfClass:RNSStackHeaderItemComponentView.class],
                @"[RNScreens] headerItem is expected to be of type RNSStackHeaderItemComponentView");
      [static_cast<RNSStackHeaderItemComponentView *>(locator.headerItem)
          updateMenuElementWithId:menuItemId
                      withElement:newItemData
                       parentMenu:locator.searchResult.parentMenu];
      break;
    case RNSMenuElementPositionTitle:
    case RNSMenuElementPositionOverflow:
      // TODO: handle title menu and overflow menu
      break;
  }
}

- (void)setMenuOptions:(NSString *)menuElementId options:(const NSArray *)options
{
  NSDictionary *dict = [self extractOptionsDict:options];
  if (menuElementId == nil || dict == nil) {
    return;
  }

  RNSMenuElementLocator *locator = [RNSStackHeaderMenuFinder findMenuElementWithId:menuElementId
                                                                     inHeaderItems:[self headerItems]];
  if (locator == nil) {
    RCTLogWarn(@"[RNScreens] setMenuOptions: element with id \"%@\" not found", menuElementId);
    return;
  }
  if (![locator.searchResult.element isKindOfClass:[RNSStackHeaderMenuData class]]) {
    RCTLogWarn(@"[RNScreens] setMenuOptions: element \"%@\" is a menuItem, expected menu", menuElementId);
    return;
  }

  RNSMenuUpdateOptions *updateOptions = [RNSMenuUpdateOptions fromDictionary:dict];
  RNSStackHeaderMenuData *oldMenuItem = (RNSStackHeaderMenuData *)locator.searchResult.element;
  RNSStackHeaderMenuData *newMenuItem = [RNSMenuUpdateOptions applyOptions:updateOptions toMenu:oldMenuItem];

  switch (locator.position) {
    case RNSMenuElementPositionItem:
      RCTAssert([locator.headerItem isKindOfClass:RNSStackHeaderItemComponentView.class],
                @"[RNScreens] headerItem is expected to be of type RNSStackHeaderItemComponentView");
      [static_cast<RNSStackHeaderItemComponentView *>(locator.headerItem)
          updateMenuElementWithId:menuElementId
                      withElement:newMenuItem
                       parentMenu:locator.searchResult.parentMenu];
      break;
    case RNSMenuElementPositionTitle:
    case RNSMenuElementPositionOverflow:
      // TODO: handle title menu and overflow menu
      break;
  }
}

- (nullable NSDictionary *)extractOptionsDict:(const NSArray *)options
{
  if (options.count == 0) {
    return nil;
  }
  id first = options[0];
  if (![first isKindOfClass:[NSDictionary class]]) {
    return nil;
  }
  NSDictionary *dict = (NSDictionary *)first;
  return dict.count > 0 ? dict : nil;
}

- (NSArray<RNSStackHeaderItemComponentView *> *)headerItems
{
  NSMutableArray<RNSStackHeaderItemComponentView *> *items = [NSMutableArray new];
  for (UIView *child in _children) {
    if ([child isKindOfClass:RNSStackHeaderItemComponentView.class]) {
      [items addObject:(RNSStackHeaderItemComponentView *)child];
    }
  }
  return items;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSStackHeaderConfigShadowNode::ConcreteState>(state);
  if (auto imgLoaderPtr = _state.get()->getData().getImageLoader().lock()) {
    _imageLoader = react::unwrapManagedObject(imgLoaderPtr);
  }
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

  [[self headerCoordinator] applyConfigProperties];
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

- (nullable RNSStackScreenHeaderCoordinator *)headerCoordinator
{
  if (self.superview == nil) {
    return nil;
  }
  RCTAssert([self.superview isKindOfClass:RNSStackScreenComponentView.class],
            @"[RNScreens] Header Config should be a direct child of RNSStackScreenComponentView");
  RNSStackScreenComponentView *screen = (RNSStackScreenComponentView *)self.superview;
  return screen.controller.headerCoordinator;
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
