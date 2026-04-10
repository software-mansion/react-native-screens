#import "RNSStackHeaderConfigComponentView.h"
#import "RNSShadowStateFrameTracker.h"
#import "RNSStackHeaderData.h"
#import "RNSStackHeaderItemComponentView.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSStackHeaderItemSpacerComponentView.h"
#import "RNSStackScreenComponentView.h"
#import "RNSStackScreenController.h"
#import "RNSStackScreenHeaderCoordinator.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSStackHeaderConfigComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSStackHeaderConfigComponentView () <RNSStackHeaderItemInvalidationDelegate>
@end

@implementation RNSStackHeaderConfigComponentView {
  NSString *_Nullable _title;
  BOOL _hidden;
  BOOL _largeTitle;

  // Ordered list of children as mounted by Fabric
  // Instead of being mounted natively here, they are used to build header items.
  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_Nonnull _children;
  NSMutableArray<RNSStackHeaderItemComponentView *> *_Nonnull _headerItems;

  std::shared_ptr<const react::RNSStackHeaderConfigShadowNode::ConcreteState> _state;
  RNSShadowStateFrameTracker *_Nonnull _frameTracker;
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSStackHeaderConfigProps>();
    _props = defaultProps;
    _children = [NSMutableArray new];
    _frameTracker = [RNSShadowStateFrameTracker new];
    _headerItems = [NSMutableArray new];
  }
  return self;
}

#pragma mark - UIView lifecycle

- (void)didMoveToSuperview
{
  [super didMoveToSuperview];

  [self submitCurrentDataIfMounted];
}

#pragma mark - Child mounting

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  // Do NOT call super — children are not added to the view hierarchy.
  // They are tracked here and converted to UIBarButtonItems in submitCurrentData.
  [_children insertObject:childComponentView atIndex:index];

  if ([childComponentView isKindOfClass:RNSStackHeaderItemComponentView.class]) {
    RNSStackHeaderItemComponentView *item = ((RNSStackHeaderItemComponentView *)childComponentView);
    item.invalidationDelegate = self;
    [_headerItems addObject:item];
  } else if ([childComponentView isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
    ((RNSStackHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = self;
  }

  [self submitCurrentDataIfMounted];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:RNSStackHeaderItemComponentView.class]) {
    RNSStackHeaderItemComponentView *item = ((RNSStackHeaderItemComponentView *)childComponentView);
    item.invalidationDelegate = nil;
    [_headerItems removeObject:item];
  } else if ([childComponentView isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
    ((RNSStackHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = nil;
  }

  [_children removeObjectAtIndex:index];
  [self submitCurrentDataIfMounted];
}

#pragma mark - Header Items

- (NSArray<RNSStackHeaderItemComponentView *> *)headerItems
{
  return _headerItems;
}

#pragma mark RNSStackHeaderInvalidateInvalidationDelegate

- (void)headerItemDidInvalidate
{
  [self submitCurrentDataIfMounted];
}

#pragma mark - Shadow State

- (void)updateShadowStateToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar
{
  if (_state == nullptr || self.superview == nil) {
    return;
  }

  UIView *screenView = self.superview;
  CGRect navBarFrame = [navigationBar convertRect:navigationBar.bounds toView:screenView];
  if (![_frameTracker updateFrameIfNeeded:navBarFrame]) {
    return;
  }

  auto newState =
      react::RNSStackHeaderConfigState(RCTSizeFromCGSize(navBarFrame.size), RCTPointFromCGPoint(navBarFrame.origin));
  _state->updateState(std::move(newState));
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSStackHeaderConfigShadowNode::ConcreteState>(state);
}

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &newHeaderProps = *std::static_pointer_cast<const react::RNSStackHeaderConfigProps>(props);
  const auto &oldHeaderProps = *std::static_pointer_cast<const react::RNSStackHeaderConfigProps>(_props);

  if (oldHeaderProps.title != newHeaderProps.title) {
    _title = RCTNSStringFromString(newHeaderProps.title);
  }

  if (oldHeaderProps.hidden != newHeaderProps.hidden) {
    _hidden = newHeaderProps.hidden;
  }

  if (oldHeaderProps.largeTitle != newHeaderProps.largeTitle) {
    _largeTitle = newHeaderProps.largeTitle;
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

#pragma mark - Private

- (void)submitCurrentDataIfMounted
{
  if (self.superview != nil) {
    [self submitCurrentData];
  }
}

- (void)submitCurrentData
{
  RCTAssert(
      [self.superview isKindOfClass:RNSStackScreenComponentView.class],
      @"[RNScreens] RNSStackHeaderConfig expects to be mounted directly below RNSStackScreenComponentView, got: %@",
      self.superview.class);

  RNSStackScreenComponentView *screen = (RNSStackScreenComponentView *)self.superview;

  NSMutableArray<UIBarButtonItem *> *leftItems = [NSMutableArray new];
  NSMutableArray<UIBarButtonItem *> *rightItems = [NSMutableArray new];
  UIView *titleView = nil;
  UIView *subtitleView = nil;
  UIView *largeSubtitleView = nil;
  [self buildBarButtonItems:leftItems
                 rightItems:rightItems
                  titleView:&titleView
               subtitleView:&subtitleView
          largeSubtitleView:&largeSubtitleView];

  RNSStackHeaderData *data = [[RNSStackHeaderData alloc] initWithTitle:_title
                                                             screenKey:screen.screenKey
                                                                hidden:_hidden
                                                            largeTitle:_largeTitle
                                                    leftBarButtonItems:leftItems
                                                   rightBarButtonItems:rightItems
                                                             titleView:titleView
                                                          subtitleView:subtitleView
                                                     largeSubtitleView:largeSubtitleView];
  [screen.controller.headerCoordinator submitHeaderData:data];
}

- (void)buildBarButtonItems:(NSMutableArray<UIBarButtonItem *> *)leftItems
                 rightItems:(NSMutableArray<UIBarButtonItem *> *)rightItems
                  titleView:(UIView *_Nullable *_Nonnull)outTitleView
               subtitleView:(UIView *_Nullable *_Nonnull)outSubtitleView
          largeSubtitleView:(UIView *_Nullable *_Nonnull)outLargeSubtitleView
{
  for (UIView *child in _children) {
    if ([child isKindOfClass:RNSStackHeaderItemComponentView.class]) {
      auto *item = static_cast<RNSStackHeaderItemComponentView *>(child);
      switch (item.placement) {
        case RNSHeaderItemPlacementLeft:
          [leftItems addObject:[item makeBarButtonItem]];
          break;
        case RNSHeaderItemPlacementRight:
          [rightItems addObject:[item makeBarButtonItem]];
          break;
        case RNSHeaderItemPlacementTitle:
          if (item.hasCustomView) {
            *outTitleView = item;
          }
          break;
        case RNSHeaderItemPlacementSubtitle:
          if (item.hasCustomView) {
            *outSubtitleView = item;
          }
          break;
        case RNSHeaderItemPlacementLargeSubtitle:
          if (item.hasCustomView) {
            *outLargeSubtitleView = item;
          }
          break;
      }
    } else if ([child isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
      auto *spacer = static_cast<RNSStackHeaderItemSpacerComponentView *>(child);
      switch (spacer.placement) {
        case RNSHeaderItemSpacerPlacementLeft:
          [leftItems addObject:[spacer makeBarButtonItem]];
          break;
        case RNSHeaderItemSpacerPlacementRight:
          [rightItems addObject:[spacer makeBarButtonItem]];
          break;
      }
    }
  }
}

@end

Class<RCTComponentViewProtocol> RNSStackHeaderConfigComponentViewCls(void)
{
  return RNSStackHeaderConfigComponentView.class;
}
