#import "RNSStackHeaderConfigComponentView.h"
#import "RNSLog.h"
#import "RNSStackHeaderData.h"
#import "RNSStackHeaderItemComponentView.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSStackHeaderItemSpacerComponentView.h"
#import "RNSStackHeaderShadowStateProxy.h"
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
  NSString *_Nullable _subtitle;
  BOOL _hidden;
  NSString *_Nullable _largeTitle;
  BOOL _largeTitleEnabled;

  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_Nonnull _children;

  std::shared_ptr<const react::RNSStackHeaderConfigShadowNode::ConcreteState> _state;
  RNSStackHeaderShadowStateProxy *_Nonnull _shadowStateProxy;
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSStackHeaderConfigIOSProps>();
    _props = defaultProps;
    _children = [NSMutableArray new];
    _shadowStateProxy = [RNSStackHeaderShadowStateProxy new];
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
  _largeTitleEnabled = NO;
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
    ((RNSStackHeaderItemComponentView *)childComponentView).invalidationDelegate = self;
  } else if ([childComponentView isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
    ((RNSStackHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = self;
  }

  [self submitCurrentDataIfMounted];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:RNSStackHeaderItemComponentView.class]) {
    ((RNSStackHeaderItemComponentView *)childComponentView).invalidationDelegate = nil;
  } else if ([childComponentView isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
    ((RNSStackHeaderItemSpacerComponentView *)childComponentView).invalidationDelegate = nil;
  }

  [_children removeObjectAtIndex:index];
  [self submitCurrentDataIfMounted];
}

#pragma mark RNSStackHeaderItemInvalidationDelegate

- (void)headerItemDidInvalidate
{
  [self submitCurrentDataIfMounted];
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
  if (![_shadowStateProxy updateShadowStateWithFrame:navBarFrame]) {
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
  const auto &newHeaderProps = *std::static_pointer_cast<const react::RNSStackHeaderConfigIOSProps>(props);
  const auto &oldHeaderProps = *std::static_pointer_cast<const react::RNSStackHeaderConfigIOSProps>(_props);

  if (oldHeaderProps.title != newHeaderProps.title) {
    _title = RCTNSStringFromString(newHeaderProps.title);
  }

  if (oldHeaderProps.subtitle != newHeaderProps.subtitle) {
    _subtitle = RCTNSStringFromString(newHeaderProps.subtitle);
  }

  if (oldHeaderProps.hidden != newHeaderProps.hidden) {
    _hidden = newHeaderProps.hidden;
  }

  if (oldHeaderProps.largeTitle != newHeaderProps.largeTitle) {
    _largeTitle = RCTNSStringFromString(newHeaderProps.largeTitle);
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

  NSMutableArray<UIBarButtonItem *> *leadingItems = [NSMutableArray new];
  NSMutableArray<UIBarButtonItem *> *trailingItems = [NSMutableArray new];
  UIView *titleView = nil;
  UIView *subtitleView = nil;
  UIView *largeSubtitleView = nil;
  [self buildBarButtonItems:leadingItems
              trailingItems:trailingItems
                  titleView:&titleView
               subtitleView:&subtitleView
          largeSubtitleView:&largeSubtitleView];

  RNSStackHeaderData *data = [[RNSStackHeaderData alloc] initWithTitle:_title
                                                              subtitle:_subtitle
                                                             screenKey:screen.screenKey
                                                                hidden:_hidden
                                                            largeTitle:_largeTitle
                                                     largeTitleEnabled:_largeTitleEnabled
                                                 leadingBarButtonItems:leadingItems
                                                trailingBarButtonItems:trailingItems
                                                             titleView:titleView
                                                          subtitleView:subtitleView
                                                     largeSubtitleView:largeSubtitleView];
  [screen.controller.headerCoordinator submitHeaderData:data];
}

- (void)buildBarButtonItems:(NSMutableArray<UIBarButtonItem *> *)leadingItems
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
          [leadingItems addObject:[item makeBarButtonItemWithFrameChangeDelegate:self]];
          break;
        case RNSHeaderItemPlacementTrailing:
          [trailingItems addObject:[item makeBarButtonItemWithFrameChangeDelegate:self]];
          break;
        case RNSHeaderItemPlacementTitle:
          if (item.hasCustomView) {
            *outTitleView = [item makeWrappedViewWithFrameChangeDelegate:self];
          }
          break;
        case RNSHeaderItemPlacementSubtitle:
          if (item.hasCustomView) {
            *outSubtitleView = [item makeWrappedViewWithFrameChangeDelegate:self];
          }
          break;
        case RNSHeaderItemPlacementLargeSubtitle:
          if (item.hasCustomView) {
            *outLargeSubtitleView = [item makeWrappedViewWithFrameChangeDelegate:self];
          }
          break;
      }
    } else if ([child isKindOfClass:RNSStackHeaderItemSpacerComponentView.class]) {
      auto *spacer = static_cast<RNSStackHeaderItemSpacerComponentView *>(child);
      switch (spacer.placement) {
        case RNSHeaderItemSpacerPlacementLeading:
          [leadingItems addObject:[spacer makeBarButtonItem]];
          break;
        case RNSHeaderItemSpacerPlacementTrailing:
          [trailingItems addObject:[spacer makeBarButtonItem]];
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
