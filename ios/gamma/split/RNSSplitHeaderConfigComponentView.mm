#import "RNSSplitHeaderConfigComponentView.h"
#import "RNSShadowStateFrameTracker.h"
#import "RNSSplitScreenComponentView.h"
#import "RNSSplitScreenHeaderCoordinator.h"
#import "RNSSplitHeaderData.h"
#import "RNSSplitHeaderItemComponentView.h"
#import "RNSSplitHeaderItemInvalidationDelegate.h"
#import "RNSSplitHeaderItemSpacerComponentView.h"

#import "Swift-Bridging.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSSplitHeaderConfigComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSSplitHeaderConfigComponentView () <RNSSplitHeaderItemInvalidationDelegate>
@end

@implementation RNSSplitHeaderConfigComponentView {
  NSString *_Nullable _title;
  BOOL _hidden;
  BOOL _largeTitle;

  // Ordered list of children as mounted by Fabric
  // Instead of being mounted natively here, they are used to build header items.
  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_Nonnull _children;
  NSMutableArray<RNSSplitHeaderItemComponentView *> *_Nonnull _headerItems;

  std::shared_ptr<const react::RNSSplitHeaderConfigShadowNode::ConcreteState> _state;
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
    static const auto defaultProps = std::make_shared<const react::RNSSplitHeaderConfigProps>();
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

  if ([childComponentView isKindOfClass:RNSSplitHeaderItemComponentView.class]) {
    RNSSplitHeaderItemComponentView *item = ((RNSSplitHeaderItemComponentView *)childComponentView);
    item.invalidationDelegate = self;
    [_headerItems addObject:item];
  } else if ([childComponentView isKindOfClass:RNSSplitHeaderItemSpacerComponentView.class]) {
    ((RNSSplitHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = self;
  }

  [self submitCurrentDataIfMounted];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:RNSSplitHeaderItemComponentView.class]) {
    RNSSplitHeaderItemComponentView *item = ((RNSSplitHeaderItemComponentView *)childComponentView);
    item.invalidationDelegate = nil;
    [_headerItems removeObject:item];
  } else if ([childComponentView isKindOfClass:RNSSplitHeaderItemSpacerComponentView.class]) {
    ((RNSSplitHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = nil;
  }

  [_children removeObjectAtIndex:index];
  [self submitCurrentDataIfMounted];
}

#pragma mark - Header Items

- (NSArray<RNSSplitHeaderItemComponentView *> *)headerItems
{
  return _headerItems;
}

#pragma mark RNSSplitHeaderItemInvalidationDelegate

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
      react::RNSSplitHeaderConfigState(RCTSizeFromCGSize(navBarFrame.size), RCTPointFromCGPoint(navBarFrame.origin));
  _state->updateState(std::move(newState));
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSSplitHeaderConfigShadowNode::ConcreteState>(state);
}

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &newHeaderProps = *std::static_pointer_cast<const react::RNSSplitHeaderConfigProps>(props);
  const auto &oldHeaderProps = *std::static_pointer_cast<const react::RNSSplitHeaderConfigProps>(_props);

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
  return react::concreteComponentDescriptorProvider<react::RNSSplitHeaderConfigComponentDescriptor>();
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
      [self.superview isKindOfClass:RNSSplitScreenComponentView.class],
      @"[RNScreens] RNSSplitHeaderConfig expects to be mounted directly below RNSSplitScreenComponentView, got: %@",
      self.superview.class);

  RNSSplitScreenComponentView *screen = (RNSSplitScreenComponentView *)self.superview;

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

  RNSSplitHeaderData *data = [[RNSSplitHeaderData alloc] initWithTitle:_title
                                                             screenKey:nil
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
    if ([child isKindOfClass:RNSSplitHeaderItemComponentView.class]) {
      auto *item = static_cast<RNSSplitHeaderItemComponentView *>(child);
      switch (item.placement) {
        case RNSSplitHeaderItemPlacementLeft:
          [leftItems addObject:[item makeBarButtonItem]];
          break;
        case RNSSplitHeaderItemPlacementRight:
          [rightItems addObject:[item makeBarButtonItem]];
          break;
        case RNSSplitHeaderItemPlacementTitle:
          if (item.hasCustomView) {
            *outTitleView = item;
          }
          break;
        case RNSSplitHeaderItemPlacementSubtitle:
          if (item.hasCustomView) {
            *outSubtitleView = item;
          }
          break;
        case RNSSplitHeaderItemPlacementLargeSubtitle:
          if (item.hasCustomView) {
            *outLargeSubtitleView = item;
          }
          break;
      }
    } else if ([child isKindOfClass:RNSSplitHeaderItemSpacerComponentView.class]) {
      auto *spacer = static_cast<RNSSplitHeaderItemSpacerComponentView *>(child);
      switch (spacer.placement) {
        case RNSSplitHeaderItemSpacerPlacementLeft:
          [leftItems addObject:[spacer makeBarButtonItem]];
          break;
        case RNSSplitHeaderItemSpacerPlacementRight:
          [rightItems addObject:[spacer makeBarButtonItem]];
          break;
      }
    }
  }
}

@end

Class<RCTComponentViewProtocol> RNSSplitHeaderConfigComponentViewCls(void)
{
  return RNSSplitHeaderConfigComponentView.class;
}
