#import "RNSBarView+Internal.h"

#import <react/renderer/components/RNSBarViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNSBarViewSpec/Props.h>
#import <react/renderer/components/RNSBarViewSpec/RCTComponentViewHelpers.h>

#import <React/UIView+React.h>
#import <React/RCTLog.h>

#import "RCTFabricComponentsPlugins.h"
using namespace facebook::react;

static UIFontWeight ToolbarFontWeightFromString(NSString *weight)
{
  if (weight.length == 0) {
    return UIFontWeightRegular;
  }

  NSString *lowered = weight.lowercaseString;
  if ([lowered isEqualToString:@"bold"]) {
    return UIFontWeightBold;
  }
  if ([lowered isEqualToString:@"normal"]) {
    return UIFontWeightRegular;
  }

  double numericWeight = weight.doubleValue;
  if (numericWeight >= 900) {
    return UIFontWeightBlack;
  }
  if (numericWeight >= 800) {
    return UIFontWeightHeavy;
  }
  if (numericWeight >= 700) {
    return UIFontWeightBold;
  }
  if (numericWeight >= 600) {
    return UIFontWeightSemibold;
  }
  if (numericWeight >= 500) {
    return UIFontWeightMedium;
  }
  if (numericWeight >= 400) {
    return UIFontWeightRegular;
  }
  if (numericWeight >= 300) {
    return UIFontWeightLight;
  }
  if (numericWeight >= 200) {
    return UIFontWeightThin;
  }

  return UIFontWeightUltraLight;
}

static UIFont * _Nullable ToolbarFontFromStyle(
  NSString * _Nullable family,
  NSNumber * _Nullable sizeNumber,
  NSString * _Nullable weight
) {
  if (family.length == 0 && sizeNumber == nil && weight.length == 0) {
    return nil;
  }

  CGFloat size = sizeNumber != nil ? sizeNumber.doubleValue : [UIFont systemFontSize];
  UIFont *font = nil;

  if (family.length > 0) {
    font = [UIFont fontWithName:family size:size];
  }

  if (font == nil) {
    UIFontWeight fontWeight = ToolbarFontWeightFromString(weight);
    font = [UIFont systemFontOfSize:size weight:fontWeight];
  }

  return font;
}

static void ToolbarApplyTitleStyleToBarButtonItem(
  UIBarButtonItem *barButton,
  NSString * _Nullable fontFamily,
  NSNumber * _Nullable fontSize,
  NSString * _Nullable fontWeight,
  UIColor * _Nullable titleColor
) {
  UIFont *font = ToolbarFontFromStyle(fontFamily, fontSize, fontWeight);
  if (font == nil && titleColor == nil) {
    return;
  }

  NSMutableDictionary<NSAttributedStringKey, id> *attributes = [NSMutableDictionary new];
  if (font != nil) {
    attributes[NSFontAttributeName] = font;
  }
  if (titleColor != nil) {
    attributes[NSForegroundColorAttributeName] = titleColor;
  }

  [barButton setTitleTextAttributes:attributes forState:UIControlStateNormal];
}

static void ToolbarApplyBadgeToBarButtonItem(
  UIBarButtonItem *barButton,
  BOOL hasBadge,
  NSNumber * _Nullable badgeCount,
  NSString * _Nullable badgeValue,
  UIColor * _Nullable badgeForegroundColor,
  UIColor * _Nullable badgeBackgroundColor,
  NSString * _Nullable badgeFontFamily,
  NSNumber * _Nullable badgeFontSize,
  NSString * _Nullable badgeFontWeight
);

static void ToolbarApplyBarButtonCommon(
  UIBarButtonItem *barButton,
  BOOL enabled,
  BOOL selected,
  UIColor * _Nullable tintColor,
  NSNumber * _Nullable width,
  NSString * _Nullable accessibilityLabel,
  NSString * _Nullable accessibilityHint,
  NSString * _Nullable testID,
  NSString * _Nullable titleFontFamily,
  NSNumber * _Nullable titleFontSize,
  NSString * _Nullable titleFontWeight,
  UIColor * _Nullable titleColor,
  NSString * _Nullable identifier,
  BOOL hidesSharedBackground,
  BOOL hasSharesBackground,
  BOOL sharesBackground,
  BOOL hasBadge,
  NSNumber * _Nullable badgeCount,
  NSString * _Nullable badgeValue,
  UIColor * _Nullable badgeForegroundColor,
  UIColor * _Nullable badgeBackgroundColor,
  NSString * _Nullable badgeFontFamily,
  NSNumber * _Nullable badgeFontSize,
  NSString * _Nullable badgeFontWeight
) {
  barButton.enabled = enabled;
  if (@available(iOS 15.0, *)) {
    barButton.selected = selected;
  }

  if (tintColor != nil) {
    barButton.tintColor = tintColor;
  }

  if (width != nil) {
    barButton.width = width.doubleValue;
  }

  if (accessibilityLabel.length > 0) {
    barButton.accessibilityLabel = accessibilityLabel;
  }
  if (accessibilityHint.length > 0) {
    barButton.accessibilityHint = accessibilityHint;
  }
  if (testID.length > 0) {
    [barButton setValue:testID forKey:@"accessibilityIdentifier"];
  }

  ToolbarApplyTitleStyleToBarButtonItem(
    barButton,
    titleFontFamily,
    titleFontSize,
    titleFontWeight,
    titleColor
  );

  if (@available(iOS 26.0, *)) {
    if (identifier.length > 0) {
      barButton.identifier = identifier;
    }
    barButton.hidesSharedBackground = hidesSharedBackground;
    if (hasSharesBackground) {
      barButton.sharesBackground = sharesBackground;
    }
  }

  ToolbarApplyBadgeToBarButtonItem(
    barButton,
    hasBadge,
    badgeCount,
    badgeValue,
    badgeForegroundColor,
    badgeBackgroundColor,
    badgeFontFamily,
    badgeFontSize,
    badgeFontWeight
  );
}

static void ToolbarApplyBadgeToBarButtonItem(
  UIBarButtonItem *barButton,
  BOOL hasBadge,
  NSNumber * _Nullable badgeCount,
  NSString * _Nullable badgeValue,
  UIColor * _Nullable badgeForegroundColor,
  UIColor * _Nullable badgeBackgroundColor,
  NSString * _Nullable badgeFontFamily,
  NSNumber * _Nullable badgeFontSize,
  NSString * _Nullable badgeFontWeight
) {
  if (@available(iOS 26.0, *)) {
    if (!hasBadge) {
      barButton.badge = nil;
      return;
    }

    UIBarButtonItemBadge *badge = nil;
    if (badgeValue.length > 0) {
      badge = [UIBarButtonItemBadge badgeWithString:badgeValue];
    } else if (badgeCount != nil) {
      badge = [UIBarButtonItemBadge badgeWithCount:badgeCount.unsignedIntegerValue];
    } else {
      badge = [UIBarButtonItemBadge indicatorBadge];
    }

    badge.backgroundColor = badgeBackgroundColor;
    badge.foregroundColor = badgeForegroundColor;

    UIFont *font = ToolbarFontFromStyle(badgeFontFamily, badgeFontSize, badgeFontWeight);
    if (font != nil) {
      badge.font = font;
    }

    barButton.badge = badge;
  }
}

static UIImage * _Nullable ToolbarSystemImage(NSString * _Nullable icon)
{
  if (icon.length == 0) {
    return nil;
  }

  if (@available(iOS 13.0, *)) {
    return [UIImage systemImageNamed:icon];
  }

  return nil;
}

static UIImage * _Nullable ToolbarImageFromProps(
  NSString * _Nullable icon
) {
  return ToolbarSystemImage(icon);
}

static void ToolbarApplyBarButtonContent(
  UIBarButtonItem *barButton,
  NSString * _Nullable title,
  NSString * _Nullable icon
)
{
  UIImage *image = ToolbarImageFromProps(icon);
  if (image != nil) {
    barButton.image = image;
    barButton.title = nil;
  } else {
    barButton.image = nil;
    barButton.title = title ?: @"";
  }
}

@implementation RNSBarView

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSBarViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSBarViewProps>();
    _props = defaultProps;

    _view = [[UIView alloc] init];
    self.contentView = _view;

    _toolbarChildren = [NSMutableArray new];
    [self resetBarMappings];
    _placementIsToolbar = NO;
  }

  return self;
}

- (void)resetBarMappings
{
  _barButtonMap = [NSMapTable strongToWeakObjectsMapTable];
  _itemBarButtonMap = [NSMapTable weakToWeakObjectsMapTable];
  _menuBarButtonMap = [NSMapTable weakToWeakObjectsMapTable];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];

  childComponentView.hidden = YES;
  childComponentView.userInteractionEnabled = NO;

  if ([childComponentView isKindOfClass:[RNSBarItemView class]]) {
    ((RNSBarItemView *)childComponentView).barParent = self;
  } else if ([childComponentView isKindOfClass:[RNSBarMenuView class]]) {
    ((RNSBarMenuView *)childComponentView).barParent = self;
  } else if ([childComponentView isKindOfClass:[RNSBarSpacerView class]]) {
    ((RNSBarSpacerView *)childComponentView).barParent = self;
  }

  if (index <= (NSInteger)_toolbarChildren.count) {
    [_toolbarChildren insertObject:childComponentView atIndex:index];
  } else {
    [_toolbarChildren addObject:childComponentView];
  }

  [self updateBarItems];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];

  if ([childComponentView isKindOfClass:[RNSBarItemView class]]) {
    ((RNSBarItemView *)childComponentView).barParent = nil;
  } else if ([childComponentView isKindOfClass:[RNSBarMenuView class]]) {
    ((RNSBarMenuView *)childComponentView).barParent = nil;
  } else if ([childComponentView isKindOfClass:[RNSBarSpacerView class]]) {
    ((RNSBarSpacerView *)childComponentView).barParent = nil;
  }

  if (index < (NSInteger)_toolbarChildren.count && _toolbarChildren[index] == childComponentView) {
    [_toolbarChildren removeObjectAtIndex:index];
  } else {
    [_toolbarChildren removeObject:childComponentView];
  }

  [self updateBarItems];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<RNSBarViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RNSBarViewProps const>(props);

  if (oldViewProps.placement != newViewProps.placement) {
    _placementIsToolbar = (newViewProps.placement == RNSBarViewPlacement::Toolbar);
    [self updateBarItems];
  }

  [super updateProps:props oldProps:oldProps];
}

- (ToolbarSegment)segmentForChild:(UIView *)child
{
  NSInteger index = [_toolbarChildren indexOfObjectIdenticalTo:child];
  if (index == NSNotFound) {
    return ToolbarSegmentNone;
  }

  if ([child isKindOfClass:[RNSBarItemView class]]) {
    RNSBarItemView *itemView = (RNSBarItemView *)child;
    return [itemView.placement isEqualToString:@"left"] ? ToolbarSegmentLeft : ToolbarSegmentRight;
  }

  if ([child isKindOfClass:[RNSBarMenuView class]]) {
    RNSBarMenuView *menuView = (RNSBarMenuView *)child;
    return [menuView.placement isEqualToString:@"left"] ? ToolbarSegmentLeft : ToolbarSegmentRight;
  }

  return ToolbarSegmentRight;
}

- (void)updateBarItems
{
  if (![NSThread isMainThread]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self updateBarItems];
    });
    return;
  }

  UIViewController *viewController = self.reactViewController;
  if (viewController == nil) {
    return;
  }

  if (_placementIsToolbar) {
    [self clearNavigationItemsIfNeeded];
    [self updateBottomBarItemsWithViewController:viewController];
    return;
  }

  [self clearBottomBarIfNeeded];

  NSMutableArray *leftSegment = [NSMutableArray new];
  NSMutableArray *rightSegment = [NSMutableArray new];

  for (NSInteger i = 0; i < (NSInteger)_toolbarChildren.count; i++) {
    UIView *child = _toolbarChildren[i];

    if ([child isKindOfClass:[RNSBarSpacerView class]]) {
      continue;
    }

    BOOL isLeft = NO;
    if ([child isKindOfClass:[RNSBarItemView class]]) {
      RNSBarItemView *itemView = (RNSBarItemView *)child;
      isLeft = [itemView.placement isEqualToString:@"left"];
    } else if ([child isKindOfClass:[RNSBarMenuView class]]) {
      RNSBarMenuView *menuView = (RNSBarMenuView *)child;
      isLeft = [menuView.placement isEqualToString:@"left"];
    }

    if (isLeft) {
      [leftSegment addObject:child];
    } else {
      [rightSegment addObject:child];
    }
  }

  [self resetBarMappings];

  UINavigationItem *navigationItem = viewController.navigationItem;
  NSArray<UIBarButtonItem *> *leftItems = [self barButtonItemsForSegment:leftSegment];
  NSArray<UIBarButtonItem *> *rightItems = [self barButtonItemsForSegment:rightSegment];
  [navigationItem setLeftBarButtonItems:leftItems animated:YES];
  [navigationItem setRightBarButtonItems:rightItems animated:YES];
  _appliedLeftItems = leftItems;
  _appliedRightItems = rightItems;

  _appliedNavigationItems = YES;
}

- (NSArray<UIBarButtonItem *> *)barButtonItemsForSegment:(NSArray *)segment
{
  return [self barButtonItemsForChildren:segment includeFlexibleSpacers:NO];
}

- (NSArray<UIBarButtonItem *> *)barItemsForChildren
{
  return [self barButtonItemsForChildren:_toolbarChildren includeFlexibleSpacers:YES];
}

- (NSArray<UIBarButtonItem *> *)barButtonItemsForChildren:(NSArray *)children includeFlexibleSpacers:(BOOL)includeFlexibleSpacers
{
  NSMutableArray<UIBarButtonItem *> *items = [NSMutableArray new];

  for (UIView *child in children) {
    if ([child isKindOfClass:[RNSBarSpacerView class]]) {
      RNSBarSpacerView *spacer = (RNSBarSpacerView *)child;
      if (spacer.size != nil) {
        UIBarButtonItem *space = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFixedSpace
                                                                               target:nil
                                                                               action:nil];
        space.width = spacer.size.doubleValue;
        [items addObject:space];
      } else if (includeFlexibleSpacers) {
        UIBarButtonItem *space = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                                                                               target:nil
                                                                               action:nil];
        [items addObject:space];
      }
      continue;
    }

    if ([child isKindOfClass:[RNSBarItemView class]]) {
      RNSBarItemView *itemView = (RNSBarItemView *)child;
      UIBarButtonItem *barButton = [self barButtonItemForItem:itemView];
      if (barButton != nil) {
        [items addObject:barButton];
        [_barButtonMap setObject:itemView forKey:barButton];
        [_itemBarButtonMap setObject:barButton forKey:itemView];
      }
      continue;
    }

    if ([child isKindOfClass:[RNSBarMenuView class]]) {
      RNSBarMenuView *menuView = (RNSBarMenuView *)child;
      UIBarButtonItem *barButton = [self barButtonItemForMenu:menuView];
      if (barButton != nil) {
        [items addObject:barButton];
        [_menuBarButtonMap setObject:barButton forKey:menuView];
      }
      continue;
    }

  }

  return items;
}

- (UIBarButtonItemStyle)barButtonItemStyleForVariant:(NSString *)variant
{
  if ([variant isEqualToString:@"done"]) {
    return UIBarButtonItemStyleDone;
  }

  if ([variant isEqualToString:@"prominent"]) {
    if (@available(iOS 26.0, *)) {
      return UIBarButtonItemStyleProminent;
    }
    return UIBarButtonItemStyleDone;
  }

  return UIBarButtonItemStylePlain;
}

- (UIBarButtonItem *)barButtonItemForItem:(RNSBarItemView *)itemView
{
  UIBarButtonItemStyle style = [self barButtonItemStyleForVariant:itemView.variant];
  UIBarButtonItem *barButton = nil;

  UIImage *image = ToolbarImageFromProps(itemView.icon);
  NSString *title = itemView.title ?: @"";
  if (image != nil) {
    barButton = [[UIBarButtonItem alloc] initWithImage:image
                                                 style:style
                                                target:self
                                                action:@selector(handleBarButtonItem:)];
  }

  if (barButton == nil) {
    barButton = [[UIBarButtonItem alloc] initWithTitle:title
                                                 style:style
                                                target:self
                                                action:@selector(handleBarButtonItem:)];
  }

  barButton.target = self;
  barButton.action = @selector(handleBarButtonItem:);

  ToolbarApplyBarButtonContent(
    barButton,
    itemView.title,
    itemView.icon
  );

  ToolbarApplyBarButtonCommon(
    barButton,
    !itemView.disabled,
    itemView.selected,
    itemView.tintColor,
    itemView.width,
    itemView.accessibilityLabel,
    itemView.accessibilityHint,
    itemView.testID,
    itemView.titleFontFamily,
    itemView.titleFontSize,
    itemView.titleFontWeight,
    itemView.titleColor,
    itemView.identifier,
    itemView.hidesSharedBackground,
    itemView.hasSharesBackground,
    itemView.sharesBackground,
    itemView.hasBadge,
    itemView.badgeCount,
    itemView.badgeValue,
    itemView.badgeForegroundColor,
    itemView.badgeBackgroundColor,
    itemView.badgeFontFamily,
    itemView.badgeFontSize,
    itemView.badgeFontWeight
  );

  return barButton;
}

- (UIBarButtonItem *)barButtonItemForMenu:(RNSBarMenuView *)menuView
{
  UIBarButtonItemStyle style = [self barButtonItemStyleForVariant:menuView.variant];
  UIBarButtonItem *barButton = nil;

  UIImage *image = ToolbarImageFromProps(menuView.icon);
  NSString *title = menuView.title ?: @"";
  if (image != nil) {
    barButton = [[UIBarButtonItem alloc] initWithImage:image
                                                 style:style
                                                target:nil
                                                action:nil];
  }

  if (barButton == nil) {
    barButton = [[UIBarButtonItem alloc] initWithTitle:title
                                                 style:style
                                                target:nil
                                                action:nil];
  }

  BOOL canApplySelectionAsPrimaryAction = NO;
  if (@available(iOS 15.0, *)) {
    canApplySelectionAsPrimaryAction = [menuView canApplySelectionAsPrimaryAction];
    barButton.changesSelectionAsPrimaryAction = NO;
  }
  if (@available(iOS 14.0, *)) {
    barButton.menu = [menuView menuRepresentation];
  }
  if (@available(iOS 15.0, *)) {
    barButton.changesSelectionAsPrimaryAction = canApplySelectionAsPrimaryAction;
  }

  ToolbarApplyBarButtonContent(
    barButton,
    menuView.title,
    menuView.icon
  );

  ToolbarApplyBarButtonCommon(
    barButton,
    !menuView.disabled,
    menuView.selected,
    menuView.tintColor,
    menuView.width,
    menuView.accessibilityLabel,
    menuView.accessibilityHint,
    menuView.testID,
    menuView.titleFontFamily,
    menuView.titleFontSize,
    menuView.titleFontWeight,
    menuView.titleColor,
    menuView.identifier,
    menuView.hidesSharedBackground,
    menuView.hasSharesBackground,
    menuView.sharesBackground,
    menuView.hasBadge,
    menuView.badgeCount,
    menuView.badgeValue,
    menuView.badgeForegroundColor,
    menuView.badgeBackgroundColor,
    menuView.badgeFontFamily,
    menuView.badgeFontSize,
    menuView.badgeFontWeight
  );

  return barButton;
}


- (BOOL)updateExistingBarButton:(UIBarButtonItem *)barButton forItemView:(RNSBarItemView *)itemView
{
  UIBarButtonItemStyle desiredStyle = [self barButtonItemStyleForVariant:itemView.variant];
  if (barButton.style != desiredStyle) {
    return NO;
  }

  ToolbarApplyBarButtonContent(
    barButton,
    itemView.title,
    itemView.icon
  );
  barButton.target = self;
  barButton.action = @selector(handleBarButtonItem:);

  ToolbarApplyBarButtonCommon(
    barButton,
    !itemView.disabled,
    itemView.selected,
    itemView.tintColor,
    itemView.width,
    itemView.accessibilityLabel,
    itemView.accessibilityHint,
    itemView.testID,
    itemView.titleFontFamily,
    itemView.titleFontSize,
    itemView.titleFontWeight,
    itemView.titleColor,
    itemView.identifier,
    itemView.hidesSharedBackground,
    itemView.hasSharesBackground,
    itemView.sharesBackground,
    itemView.hasBadge,
    itemView.badgeCount,
    itemView.badgeValue,
    itemView.badgeForegroundColor,
    itemView.badgeBackgroundColor,
    itemView.badgeFontFamily,
    itemView.badgeFontSize,
    itemView.badgeFontWeight
  );

  return YES;
}

- (BOOL)updateExistingBarButton:(UIBarButtonItem *)barButton forMenuView:(RNSBarMenuView *)menuView
{
  UIBarButtonItemStyle desiredStyle = [self barButtonItemStyleForVariant:menuView.variant];
  if (barButton.style != desiredStyle) {
    return NO;
  }

  ToolbarApplyBarButtonContent(
    barButton,
    menuView.title,
    menuView.icon
  );

  BOOL canApplySelectionAsPrimaryAction = NO;
  if (@available(iOS 15.0, *)) {
    canApplySelectionAsPrimaryAction = [menuView canApplySelectionAsPrimaryAction];
    barButton.changesSelectionAsPrimaryAction = NO;
  }
  if (@available(iOS 14.0, *)) {
    barButton.menu = [menuView menuRepresentation];
  }
  if (@available(iOS 15.0, *)) {
    barButton.changesSelectionAsPrimaryAction = canApplySelectionAsPrimaryAction;
  }

  ToolbarApplyBarButtonCommon(
    barButton,
    !menuView.disabled,
    menuView.selected,
    menuView.tintColor,
    menuView.width,
    menuView.accessibilityLabel,
    menuView.accessibilityHint,
    menuView.testID,
    menuView.titleFontFamily,
    menuView.titleFontSize,
    menuView.titleFontWeight,
    menuView.titleColor,
    menuView.identifier,
    menuView.hidesSharedBackground,
    menuView.hasSharesBackground,
    menuView.sharesBackground,
    menuView.hasBadge,
    menuView.badgeCount,
    menuView.badgeValue,
    menuView.badgeForegroundColor,
    menuView.badgeBackgroundColor,
    menuView.badgeFontFamily,
    menuView.badgeFontSize,
    menuView.badgeFontWeight
  );

  return YES;
}

- (BOOL)updateBarButtonForItemView:(RNSBarItemView *)itemView
                    viewController:(UIViewController *)viewController
                           segment:(ToolbarSegment)segment
{
  UIBarButtonItem *barButton = [_itemBarButtonMap objectForKey:itemView];
  if (barButton == nil) {
    return NO;
  }

  if (segment == ToolbarSegmentLeft || segment == ToolbarSegmentRight) {
    UINavigationItem *navigationItem = viewController.navigationItem;
    NSArray<UIBarButtonItem *> *items = segment == ToolbarSegmentLeft
      ? navigationItem.leftBarButtonItems
      : navigationItem.rightBarButtonItems;
    if ([items indexOfObjectIdenticalTo:barButton] == NSNotFound) {
      return NO;
    }

    if ([self updateExistingBarButton:barButton forItemView:itemView]) {
      return YES;
    }

    UIBarButtonItem *replacement = [self barButtonItemForItem:itemView];
    if (replacement == nil) {
      return NO;
    }

    BOOL replaced = [self replaceBarButtonItem:barButton
                                      withItem:replacement
                                inNavigationItem:navigationItem
                                        segment:segment];
    if (replaced) {
      [_barButtonMap setObject:itemView forKey:replacement];
      [_itemBarButtonMap setObject:replacement forKey:itemView];
    }
    return replaced;
  }

  NSArray<UIBarButtonItem *> *items = viewController.toolbarItems;
  if ([items indexOfObjectIdenticalTo:barButton] == NSNotFound) {
    return NO;
  }

  if ([self updateExistingBarButton:barButton forItemView:itemView]) {
    return YES;
  }

  UIBarButtonItem *replacement = [self barButtonItemForItem:itemView];
  if (replacement == nil) {
    return NO;
  }

  BOOL replaced = [self replaceBottomBarButtonItem:barButton
                                           withItem:replacement
                                     viewController:viewController];
  if (replaced) {
    [_barButtonMap setObject:itemView forKey:replacement];
    [_itemBarButtonMap setObject:replacement forKey:itemView];
  }
  return replaced;
}

- (BOOL)updateBarButtonForMenuView:(RNSBarMenuView *)menuView
                    viewController:(UIViewController *)viewController
                           segment:(ToolbarSegment)segment
{
  UIBarButtonItem *barButton = [_menuBarButtonMap objectForKey:menuView];
  if (barButton == nil) {
    return NO;
  }

  if (segment == ToolbarSegmentLeft || segment == ToolbarSegmentRight) {
    UINavigationItem *navigationItem = viewController.navigationItem;
    NSArray<UIBarButtonItem *> *items = segment == ToolbarSegmentLeft
      ? navigationItem.leftBarButtonItems
      : navigationItem.rightBarButtonItems;
    if ([items indexOfObjectIdenticalTo:barButton] == NSNotFound) {
      return NO;
    }

    if ([self updateExistingBarButton:barButton forMenuView:menuView]) {
      return YES;
    }

    UIBarButtonItem *replacement = [self barButtonItemForMenu:menuView];
    if (replacement == nil) {
      return NO;
    }

    BOOL replaced = [self replaceBarButtonItem:barButton
                                      withItem:replacement
                                inNavigationItem:navigationItem
                                        segment:segment];
    if (replaced) {
      [_menuBarButtonMap setObject:replacement forKey:menuView];
    }
    return replaced;
  }

  NSArray<UIBarButtonItem *> *items = viewController.toolbarItems;
  if ([items indexOfObjectIdenticalTo:barButton] == NSNotFound) {
    return NO;
  }

  if ([self updateExistingBarButton:barButton forMenuView:menuView]) {
    return YES;
  }

  UIBarButtonItem *replacement = [self barButtonItemForMenu:menuView];
  if (replacement == nil) {
    return NO;
  }

  BOOL replaced = [self replaceBottomBarButtonItem:barButton
                                           withItem:replacement
                                     viewController:viewController];
  if (replaced) {
    [_menuBarButtonMap setObject:replacement forKey:menuView];
  }
  return replaced;
}

- (void)updateBarItem:(RNSBarItemView *)itemView
{
  if (![NSThread isMainThread]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self updateBarItem:itemView];
    });
    return;
  }

  UIViewController *viewController = self.reactViewController;
  if (viewController == nil || itemView == nil) {
    return;
  }

  if (_placementIsToolbar) {
    if (![self updateBarButtonForItemView:itemView
                           viewController:viewController
                                  segment:ToolbarSegmentNone]) {
      [self updateBarItems];
    }
    return;
  }

  ToolbarSegment segment = [self segmentForChild:itemView];
  if (segment == ToolbarSegmentLeft || segment == ToolbarSegmentRight) {
    if (![self updateBarButtonForItemView:itemView
                           viewController:viewController
                                  segment:segment]) {
      [self updateBarItems];
    }
    return;
  }

  [self updateBarItems];
}

- (void)updateBarMenu:(RNSBarMenuView *)menuView
{
  if (![NSThread isMainThread]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self updateBarMenu:menuView];
    });
    return;
  }

  UIViewController *viewController = self.reactViewController;
  if (viewController == nil || menuView == nil) {
    return;
  }

  if (_placementIsToolbar) {
    if (![self updateBarButtonForMenuView:menuView
                           viewController:viewController
                                  segment:ToolbarSegmentNone]) {
      [self updateBarItems];
    }
    return;
  }

  ToolbarSegment segment = [self segmentForChild:menuView];
  if (segment == ToolbarSegmentLeft || segment == ToolbarSegmentRight) {
    if (![self updateBarButtonForMenuView:menuView
                           viewController:viewController
                                  segment:segment]) {
      [self updateBarItems];
    }
    return;
  }

  [self updateBarItems];
}

- (void)handleBarButtonItem:(UIBarButtonItem *)sender
{
  RNSBarItemView *itemView = [_barButtonMap objectForKey:sender];
  [itemView emitPress];
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
  if (newSuperview == nil) {
    [self clearNavigationItemsIfNeeded];
    [self clearBottomBarIfNeeded];
  }

  [super willMoveToSuperview:newSuperview];
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    [self updateBarItems];
  }
}

@end
