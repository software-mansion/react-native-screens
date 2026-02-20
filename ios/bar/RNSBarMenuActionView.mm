#import "RNSBarMenuActionView.h"

#import <react/renderer/components/RNSBarViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNSBarViewSpec/EventEmitters.h>
#import <react/renderer/components/RNSBarViewSpec/Props.h>
#import <react/renderer/components/RNSBarViewSpec/RCTComponentViewHelpers.h>

#import "BarPropHelpers.h"

using namespace facebook::react;

@implementation RNSBarMenuActionView {
  BOOL _hasSelectionOverride;
  UIMenuElementState _selectionState;
  BOOL _menuHidden;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSBarMenuActionComponentDescriptor>();
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

static UIMenuElementState ToolbarMenuStateFromString(const std::string &value)
{
  if (value == "on") {
    return UIMenuElementStateOn;
  }
  if (value == "mixed") {
    return UIMenuElementStateMixed;
  }
  return UIMenuElementStateOff;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSBarMenuActionProps>();
    _props = defaultProps;

    self.hidden = YES;
    self.userInteractionEnabled = NO;
    self.state = UIMenuElementStateOff;
    _menuHidden = NO;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldActionProps = *std::static_pointer_cast<RNSBarMenuActionProps const>(_props);
  const auto &newActionProps = *std::static_pointer_cast<RNSBarMenuActionProps const>(props);

  APPLY_STRING_PROP(self, oldActionProps, newActionProps, identifier);

  APPLY_STRING_PROP(self, oldActionProps, newActionProps, title);
  APPLY_STRING_PROP(self, oldActionProps, newActionProps, subtitle);
  APPLY_STRING_PROP(self, oldActionProps, newActionProps, icon);

  if (oldActionProps.state != newActionProps.state) {
    self.state = ToolbarMenuStateFromString(newActionProps.state);
  }

  APPLY_BOOL_PROP(self, oldActionProps, newActionProps, disabled);
  APPLY_BOOL_PROP(self, oldActionProps, newActionProps, destructive);
  if (oldActionProps.hidden != newActionProps.hidden) {
    _menuHidden = newActionProps.hidden;
  }
  APPLY_BOOL_PROP(self, oldActionProps, newActionProps, keepsMenuPresented);
  APPLY_STRING_PROP(self, oldActionProps, newActionProps, discoverabilityLabel);

  [super updateProps:props oldProps:oldProps];

  [self.menuParent updateMenu];
}

- (void)emitPress
{
  if (self.disabled) {
    return;
  }

  NSString *selectionID = self.identifier ?: @"";
  [self.menuParent menuItemSelected:selectionID];

  if (auto eventEmitter = std::static_pointer_cast<RNSBarMenuActionEventEmitter const>(_eventEmitter)) {
    eventEmitter->onMenuActionPress({});
  }
}

- (UIAction *)uiAction
{
  NSString *title = self.title ?: @"";
  UIImage *image = ToolbarSystemImage(self.icon);

  __weak RNSBarMenuActionView *weakSelf = self;
  UIAction *action = [UIAction actionWithTitle:title
                                         image:image
                                    identifier:self.identifier
                                       handler:^(__kindof UIAction * _Nonnull) {
    [weakSelf emitPress];
  }];

  if (@available(iOS 15.0, *)) {
    if (self.subtitle.length > 0) {
      action.subtitle = self.subtitle;
    }
  }

  if (self.discoverabilityLabel.length > 0) {
    action.discoverabilityTitle = self.discoverabilityLabel;
  }

  UIMenuElementAttributes attributes = 0;
  if (self.disabled) {
    attributes |= UIMenuElementAttributesDisabled;
  }
  if (self.destructive) {
    attributes |= UIMenuElementAttributesDestructive;
  }
  if (_menuHidden) {
    attributes |= UIMenuElementAttributesHidden;
  }
  if (self.keepsMenuPresented) {
    if (@available(iOS 16.0, *)) {
      attributes |= UIMenuElementAttributesKeepsMenuPresented;
    }
  }

  action.attributes = attributes;
  action.state = [self effectiveState];

  return action;
}

- (void)applySelectionState:(UIMenuElementState)state
{
  _hasSelectionOverride = YES;
  _selectionState = state;
}

- (void)clearSelectionState
{
  _hasSelectionOverride = NO;
}

- (UIMenuElementState)effectiveState
{
  return _hasSelectionOverride ? _selectionState : self.state;
}

@end
