#import "RNSBarMenuSubmenuView.h"

#import <react/renderer/components/RNSBarViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNSBarViewSpec/Props.h>
#import <react/renderer/components/RNSBarViewSpec/RCTComponentViewHelpers.h>

#import "RNSBarMenuActionView.h"
#import "BarPropHelpers.h"

using namespace facebook::react;

@implementation RNSBarMenuSubmenuView {
  NSMutableArray<UIView<RCTComponentViewProtocol> *> * _menuChildren;
  NSMutableOrderedSet<NSString *> * _uncontrolledSelectedIDs;
  NSString * _uncontrolledSelectedID;
  BOOL _hasAppliedInitialSelection;
  BOOL _hasAppliedInitialMultiSelection;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSBarMenuSubmenuComponentDescriptor>();
}

static UIImage * _Nullable ToolbarSystemImage(NSString * _Nullable icon)
{
  if (icon.length > 0) {
    if (@available(iOS 13.0, *)) {
      return [UIImage systemImageNamed:icon];
    }
  }

  return nil;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSBarMenuSubmenuProps>();
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
  const auto &oldSubmenuProps = *std::static_pointer_cast<RNSBarMenuSubmenuProps const>(_props);
  const auto &newSubmenuProps = *std::static_pointer_cast<RNSBarMenuSubmenuProps const>(props);

  APPLY_STRING_PROP(self, oldSubmenuProps, newSubmenuProps, identifier);

  APPLY_STRING_PROP(self, oldSubmenuProps, newSubmenuProps, title);
  APPLY_STRING_PROP(self, oldSubmenuProps, newSubmenuProps, subtitle);
  APPLY_STRING_PROP(self, oldSubmenuProps, newSubmenuProps, icon);
  APPLY_BOOL_PROP(self, oldSubmenuProps, newSubmenuProps, inlinePresentation);
  APPLY_STRING_PROP(self, oldSubmenuProps, newSubmenuProps, layout);
  APPLY_BOOL_PROP(self, oldSubmenuProps, newSubmenuProps, destructive);
  APPLY_BOOL_PROP(self, oldSubmenuProps, newSubmenuProps, multiselectable);
  APPLY_STRING_PROP(self, oldSubmenuProps, newSubmenuProps, selectedId);
  APPLY_STRING_PROP(self, oldSubmenuProps, newSubmenuProps, defaultSelectedId);
  APPLY_STRING_ARRAY_PROP(self, oldSubmenuProps, newSubmenuProps, selectedIds);
  APPLY_STRING_ARRAY_PROP(self, oldSubmenuProps, newSubmenuProps, defaultSelectedIds);
  APPLY_BOOL_PROP(self, oldSubmenuProps, newSubmenuProps, hasSelectedId);
  APPLY_BOOL_PROP(self, oldSubmenuProps, newSubmenuProps, hasSelectedIds);

  [super updateProps:props oldProps:oldProps];

  [self updateMenu];
}


- (void)updateMenu
{
  [self.menuParent updateMenu];
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

- (BOOL)isMultiSelectionMode
{
  if (self.multiselectable) {
    return YES;
  }

  if (self.hasSelectedIds || self.defaultSelectedIds.count > 0) {
    return YES;
  }

  return NO;
}

- (BOOL)isSingleSelectionMode
{
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
    }
    _hasAppliedInitialSelection = YES;
  }

  NSSet<NSString *> *availableIDs = [self actionIDSet];
  if (_uncontrolledSelectedID.length > 0 && [availableIDs containsObject:_uncontrolledSelectedID]) {
    return _uncontrolledSelectedID;
  }

  return @"";
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

  if (singleSelection || multiSelection) {
    BOOL isControlled = singleSelection ? self.hasSelectedId : self.hasSelectedIds;
    NSArray<NSString *> *currentSelection = @[];

    if (multiSelection) {
      currentSelection = self.hasSelectedIds ? self.selectedIds : [self resolvedMultiSelectionIDs];
    }

    if (singleSelection) {
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
      if (!isControlled) {
        [_uncontrolledSelectedIDs removeAllObjects];
        [_uncontrolledSelectedIDs addObjectsFromArray:mutableSelection.array];
        _hasAppliedInitialMultiSelection = YES;
      }
    }

    if (!isControlled) {
      [self updateMenu];
    }
  }

  [self.menuParent menuItemSelected:identifier];
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
  NSString *title = self.title ?: @"";
  UIImage *image = ToolbarSystemImage(self.icon);

  BOOL hasSelection = [self applySelectionStateToActions];
  BOOL singleSelection = [self isSingleSelectionMode];

  UIMenuOptions options = 0;
  if (self.inlinePresentation) {
    options |= UIMenuOptionsDisplayInline;
  }
  if (self.destructive) {
    options |= UIMenuOptionsDestructive;
  }
  if (singleSelection && hasSelection) {
    if (@available(iOS 15.0, *)) {
      options |= UIMenuOptionsSingleSelection;
    }
  }
  if ([self.layout isEqualToString:@"palette"]) {
    if (@available(iOS 17.0, *)) {
      options |= UIMenuOptionsDisplayAsPalette;
    }
  }

  NSArray<UIMenuElement *> *children = [self menuElementsFromChildren];
  UIMenu *menu = [UIMenu menuWithTitle:title
                                 image:image
                            identifier:self.identifier
                               options:options
                              children:children];

  if (@available(iOS 15.0, *)) {
    if (self.subtitle.length > 0) {
      menu.subtitle = self.subtitle;
    }
  }

  return menu;
}

@end
