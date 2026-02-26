#import "RNSBarMenuView.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/RNSBarViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNSBarViewSpec/EventEmitters.h>
#import <react/renderer/components/RNSBarViewSpec/Props.h>
#import <react/renderer/components/RNSBarViewSpec/RCTComponentViewHelpers.h>

#import "RNSBarMenuActionView.h"
#import "RNSBarMenuSubmenuView.h"
#import "BarPropHelpers.h"
#import "RNSBarView.h"

using namespace facebook::react;

@interface RNSBarView (BarInternal)
- (void)updateBarItems;
- (void)updateBarMenu:(RNSBarMenuView *)menuView;
@end

@implementation RNSBarMenuView {
  NSMutableArray<UIView<RCTComponentViewProtocol> *> * _menuChildren;
  NSMutableOrderedSet<NSString *> * _uncontrolledSelectedIDs;
  NSString * _uncontrolledSelectedID;
  BOOL _hasAppliedInitialSelection;
  BOOL _hasAppliedInitialMultiSelection;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSBarMenuComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSBarMenuProps>();
    _props = defaultProps;

    self.hidden = YES;
    self.userInteractionEnabled = NO;
    _menuChildren = [NSMutableArray new];
    _uncontrolledSelectedIDs = [NSMutableOrderedSet new];
    self.selectedIds = @[];
    self.defaultSelectedIds = @[];
  }

  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];

  childComponentView.hidden = YES;
  childComponentView.userInteractionEnabled = NO;

  if ([childComponentView isKindOfClass:[RNSBarMenuActionView class]]) {
    ((RNSBarMenuActionView *)childComponentView).menuParent = self;
  } else if ([childComponentView isKindOfClass:[RNSBarMenuSubmenuView class]]) {
    ((RNSBarMenuSubmenuView *)childComponentView).menuParent = self;
  }

  if (index <= (NSInteger)_menuChildren.count) {
    [_menuChildren insertObject:childComponentView atIndex:index];
  } else {
    [_menuChildren addObject:childComponentView];
  }

  [self updateMenu];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];

  if ([childComponentView isKindOfClass:[RNSBarMenuActionView class]]) {
    ((RNSBarMenuActionView *)childComponentView).menuParent = nil;
  } else if ([childComponentView isKindOfClass:[RNSBarMenuSubmenuView class]]) {
    ((RNSBarMenuSubmenuView *)childComponentView).menuParent = nil;
  }

  if (index < (NSInteger)_menuChildren.count && _menuChildren[index] == childComponentView) {
    [_menuChildren removeObjectAtIndex:index];
  } else {
    [_menuChildren removeObject:childComponentView];
  }

  [self updateMenu];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldMenuProps = *std::static_pointer_cast<RNSBarMenuProps const>(_props);
  const auto &newMenuProps = *std::static_pointer_cast<RNSBarMenuProps const>(props);

  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, title);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, icon);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, placement);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, variant);

  APPLY_COLOR_PROP(self, oldMenuProps, newMenuProps, tintColor);

  APPLY_OPTIONAL_DOUBLE_PROP(self, oldMenuProps, newMenuProps, width);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, disabled);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, selected);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, changesSelectionAsPrimaryAction);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, accessibilityLabel);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, accessibilityHint);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, testID);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, titleFontFamily);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, titleFontWeight);
  APPLY_OPTIONAL_DOUBLE_PROP(self, oldMenuProps, newMenuProps, titleFontSize);

  APPLY_COLOR_PROP(self, oldMenuProps, newMenuProps, titleColor);

  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, identifier);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, hidesSharedBackground);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, sharesBackground);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, hasSharesBackground);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, hasBadge);

  APPLY_NUMBER_PROP(self, oldMenuProps, newMenuProps, badgeCount);

  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, badgeValue);

  APPLY_COLOR_PROP(self, oldMenuProps, newMenuProps, badgeForegroundColor);
  APPLY_COLOR_PROP(self, oldMenuProps, newMenuProps, badgeBackgroundColor);

  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, badgeFontFamily);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, badgeFontWeight);
  APPLY_OPTIONAL_DOUBLE_PROP(self, oldMenuProps, newMenuProps, badgeFontSize);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, menuTitle);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, menuLayout);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, menuMultiselectable);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, selectedId);
  APPLY_STRING_PROP(self, oldMenuProps, newMenuProps, defaultSelectedId);
  APPLY_STRING_ARRAY_PROP(self, oldMenuProps, newMenuProps, selectedIds);
  APPLY_STRING_ARRAY_PROP(self, oldMenuProps, newMenuProps, defaultSelectedIds);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, hasSelectedId);
  APPLY_BOOL_PROP(self, oldMenuProps, newMenuProps, hasSelectedIds);

  [super updateProps:props oldProps:oldProps];

  [self updateMenu];
}

- (void)updateMenu
{
  if (self.barParent != nil) {
    [self.barParent updateBarMenu:self];
  }
}

- (NSArray<RNSBarMenuActionView *> *)actionChildren
{
  NSMutableArray<RNSBarMenuActionView *> *actions = [NSMutableArray new];

  for (UIView *child in _menuChildren) {
    if ([child isKindOfClass:[RNSBarMenuActionView class]]) {
      [actions addObject:(RNSBarMenuActionView *)child];
    }
  }

  return actions;
}

- (NSArray<RNSBarMenuSubmenuView *> *)submenuChildren
{
  NSMutableArray<RNSBarMenuSubmenuView *> *submenus = [NSMutableArray new];

  for (UIView *child in _menuChildren) {
    if ([child isKindOfClass:[RNSBarMenuSubmenuView class]]) {
      [submenus addObject:(RNSBarMenuSubmenuView *)child];
    }
  }

  return submenus;
}

- (NSSet<NSString *> *)actionIDSet
{
  NSMutableSet<NSString *> *ids = [NSMutableSet new];

  for (RNSBarMenuActionView *action in [self actionChildren]) {
    if (action.identifier.length > 0) {
      [ids addObject:action.identifier];
    }
  }

  return ids;
}

- (NSString *)firstActionID
{
  for (RNSBarMenuActionView *action in [self actionChildren]) {
    if (action.identifier.length > 0) {
      return action.identifier;
    }
  }

  return nil;
}

- (BOOL)isMultiSelectionMode
{
  if (self.changesSelectionAsPrimaryAction) {
    return NO;
  }

  if (self.menuMultiselectable) {
    return YES;
  }

  if (self.hasSelectedIds || self.defaultSelectedIds.count > 0) {
    return YES;
  }

  return NO;
}

- (BOOL)isSingleSelectionMode
{
  if (self.changesSelectionAsPrimaryAction) {
    return YES;
  }

  if ([self isMultiSelectionMode]) {
    return NO;
  }

  if (self.hasSelectedId || self.defaultSelectedId.length > 0) {
    return YES;
  }

  return NO;
}

- (NSString *)resolvedSingleSelectionID
{
  if (self.hasSelectedId) {
    NSString *selectedID = self.selectedId ?: @"";
    if (selectedID.length == 0) {
      return @"";
    }

    NSSet<NSString *> *availableIDs = [self actionIDSet];
    return [availableIDs containsObject:selectedID] ? selectedID : @"";
  }

  if (!_hasAppliedInitialSelection) {
    if (self.defaultSelectedId.length > 0) {
      _uncontrolledSelectedID = self.defaultSelectedId;
    } else {
      _uncontrolledSelectedID = [self firstActionID];
    }
    _hasAppliedInitialSelection = YES;
  }

  NSSet<NSString *> *availableIDs = [self actionIDSet];
  if (_uncontrolledSelectedID.length > 0 && [availableIDs containsObject:_uncontrolledSelectedID]) {
    return _uncontrolledSelectedID;
  }

  _uncontrolledSelectedID = [self firstActionID];
  return _uncontrolledSelectedID ?: @"";
}

- (NSArray<NSString *> *)resolvedMultiSelectionIDs
{
  if (self.hasSelectedIds) {
    return self.selectedIds;
  }

  if (!_hasAppliedInitialMultiSelection) {
    [_uncontrolledSelectedIDs removeAllObjects];
    for (NSString *item in self.defaultSelectedIds) {
      if (item.length > 0) {
        [_uncontrolledSelectedIDs addObject:item];
      }
    }
    _hasAppliedInitialMultiSelection = YES;
  }

  NSSet<NSString *> *availableIDs = [self actionIDSet];
  if (availableIDs.count == 0) {
    [_uncontrolledSelectedIDs removeAllObjects];
    return @[];
  }

  for (NSString *item in _uncontrolledSelectedIDs.array) {
    if (![availableIDs containsObject:item]) {
      [_uncontrolledSelectedIDs removeObject:item];
    }
  }

  return _uncontrolledSelectedIDs.array;
}

- (BOOL)applySelectionStateToActions
{
  NSArray<RNSBarMenuActionView *> *actions = [self actionChildren];
  if (actions.count == 0) {
    return NO;
  }

  BOOL singleSelection = [self isSingleSelectionMode];
  BOOL multiSelection = [self isMultiSelectionMode];

  if (!singleSelection && !multiSelection) {
    for (RNSBarMenuActionView *action in actions) {
      [action clearSelectionState];
    }
    return NO;
  }

  if (singleSelection) {
    NSString *selectedID = [self resolvedSingleSelectionID];
    BOOL hasSelection = NO;

    for (RNSBarMenuActionView *action in actions) {
      if (action.identifier.length > 0 && [action.identifier isEqualToString:selectedID]) {
        [action applySelectionState:UIMenuElementStateOn];
        hasSelection = YES;
      } else {
        [action applySelectionState:UIMenuElementStateOff];
      }
    }

    return hasSelection;
  }

  NSArray<NSString *> *selectedIDs = [self resolvedMultiSelectionIDs];
  NSSet<NSString *> *selectedSet = [NSSet setWithArray:selectedIDs];
  BOOL hasSelection = selectedIDs.count > 0;

  for (RNSBarMenuActionView *action in actions) {
    if (action.identifier.length > 0 && [selectedSet containsObject:action.identifier]) {
      [action applySelectionState:UIMenuElementStateOn];
    } else {
      [action applySelectionState:UIMenuElementStateOff];
    }
  }

  return hasSelection;
}

- (void)menuItemSelected:(NSString *)identifier
{
  if (identifier.length == 0) {
    return;
  }

  BOOL singleSelection = [self isSingleSelectionMode];
  BOOL multiSelection = [self isMultiSelectionMode];

  if (!singleSelection && !multiSelection) {
    return;
  }

  BOOL isDirectAction = [[self actionIDSet] containsObject:identifier];
  BOOL isControlled = singleSelection ? self.hasSelectedId : self.hasSelectedIds;
  NSArray<NSString *> *currentSelection = @[];

  if (multiSelection) {
    currentSelection = self.hasSelectedIds ? self.selectedIds : [self resolvedMultiSelectionIDs];
  }

  NSArray<NSString *> *nextSelection = @[];

  if (isDirectAction) {
    if (singleSelection) {
      nextSelection = @[identifier];
      if (!isControlled) {
        _uncontrolledSelectedID = identifier;
        _hasAppliedInitialSelection = YES;
      }
    } else if (multiSelection) {
      NSMutableOrderedSet<NSString *> *mutableSelection =
        [NSMutableOrderedSet orderedSetWithArray:currentSelection];
      if ([mutableSelection containsObject:identifier]) {
        [mutableSelection removeObject:identifier];
      } else {
        [mutableSelection addObject:identifier];
      }
      nextSelection = mutableSelection.array;
      if (!isControlled) {
        [_uncontrolledSelectedIDs removeAllObjects];
        [_uncontrolledSelectedIDs addObjectsFromArray:mutableSelection.array];
        _hasAppliedInitialMultiSelection = YES;
      }
    }
  } else {
    nextSelection = [self selectedItemIDs];
  }

  if (isDirectAction && !isControlled) {
    [self updateMenu];
  }

  if (auto eventEmitter = std::static_pointer_cast<RNSBarMenuEventEmitter const>(_eventEmitter)) {
    std::string selectionID = std::string(identifier.UTF8String);
    std::vector<std::string> selectionIDs = ToolbarStringVectorFromNSStringArray(nextSelection);
    RNSBarMenuEventEmitter::OnSelectionChange payload{selectionID, selectionIDs};
    eventEmitter->onSelectionChange(payload);
  }
}

- (BOOL)hasSelectedItem
{
  return [self applySelectionStateToActions];
}

- (NSArray<NSString *> *)selectedItemIDs
{
  [self applySelectionStateToActions];

  NSMutableOrderedSet<NSString *> *ids = [NSMutableOrderedSet new];
  for (RNSBarMenuActionView *action in [self actionChildren]) {
    if ([action effectiveState] == UIMenuElementStateOn && action.identifier.length > 0) {
      [ids addObject:action.identifier];
    }
  }

  for (RNSBarMenuSubmenuView *submenu in [self submenuChildren]) {
    [ids addObjectsFromArray:[submenu selectedItemIDs]];
  }

  return ids.array;
}

- (BOOL)canApplySelectionAsPrimaryAction
{
  if (!self.changesSelectionAsPrimaryAction) {
    return NO;
  }

  return [self applySelectionStateToActions];
}

- (NSArray<UIMenuElement *> *)menuElementsFromChildren
{
  NSMutableArray<UIMenuElement *> *elements = [NSMutableArray new];

  for (UIView *child in _menuChildren) {
    if ([child isKindOfClass:[RNSBarMenuActionView class]]) {
      UIAction *action = [(RNSBarMenuActionView *)child uiAction];
      if (action != nil) {
        [elements addObject:action];
      }
      continue;
    }

    if ([child isKindOfClass:[RNSBarMenuSubmenuView class]]) {
      UIMenu *submenu = [(RNSBarMenuSubmenuView *)child menuRepresentation];
      if (submenu != nil) {
        [elements addObject:submenu];
      }
      continue;
    }
  }

  return elements;
}

- (UIMenu *)menuRepresentation
{
  NSString *title = self.menuTitle ?: @"";
  BOOL hasSelection = [self applySelectionStateToActions];
  BOOL singleSelection = [self isSingleSelectionMode];

  UIMenuOptions options = 0;
  if (singleSelection && hasSelection) {
    if (@available(iOS 15.0, *)) {
      options |= UIMenuOptionsSingleSelection;
    }
  }
  if ([self.menuLayout isEqualToString:@"palette"]) {
    if (@available(iOS 17.0, *)) {
      options |= UIMenuOptionsDisplayAsPalette;
    }
  }

  NSArray<UIMenuElement *> *children = [self menuElementsFromChildren];
  UIMenu *menu = [UIMenu menuWithTitle:title
                                 image:nil
                            identifier:nil
                               options:options
                              children:children];
  return menu;
}

@end
