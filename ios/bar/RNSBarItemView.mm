#import "RNSBarItemView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/RNSBarViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNSBarViewSpec/EventEmitters.h>
#import <react/renderer/components/RNSBarViewSpec/Props.h>
#import <react/renderer/components/RNSBarViewSpec/RCTComponentViewHelpers.h>

#import "BarPropHelpers.h"
#import "RNSBarView.h"

using namespace facebook::react;

@interface RNSBarView (BarInternal)
- (void)updateBarItems;
- (void)updateBarItem:(RNSBarItemView *)itemView;
@end

@implementation RNSBarItemView

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSBarItemComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSBarItemProps>();
    _props = defaultProps;

    self.hidden = YES;
    self.userInteractionEnabled = NO;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldItemProps = *std::static_pointer_cast<RNSBarItemProps const>(_props);
  const auto &newItemProps = *std::static_pointer_cast<RNSBarItemProps const>(props);

  APPLY_STRING_PROP(self, oldItemProps, newItemProps, title);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, icon);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, placement);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, variant);

  APPLY_COLOR_PROP(self, oldItemProps, newItemProps, tintColor);

  APPLY_OPTIONAL_DOUBLE_PROP(self, oldItemProps, newItemProps, width);
  APPLY_BOOL_PROP(self, oldItemProps, newItemProps, disabled);
  APPLY_BOOL_PROP(self, oldItemProps, newItemProps, selected);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, accessibilityLabel);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, accessibilityHint);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, testID);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, titleFontFamily);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, titleFontWeight);
  APPLY_OPTIONAL_DOUBLE_PROP(self, oldItemProps, newItemProps, titleFontSize);

  APPLY_COLOR_PROP(self, oldItemProps, newItemProps, titleColor);

  APPLY_STRING_PROP(self, oldItemProps, newItemProps, identifier);
  APPLY_BOOL_PROP(self, oldItemProps, newItemProps, hidesSharedBackground);
  APPLY_BOOL_PROP(self, oldItemProps, newItemProps, sharesBackground);
  APPLY_BOOL_PROP(self, oldItemProps, newItemProps, hasSharesBackground);
  APPLY_BOOL_PROP(self, oldItemProps, newItemProps, hasBadge);

  APPLY_NUMBER_PROP(self, oldItemProps, newItemProps, badgeCount);

  APPLY_STRING_PROP(self, oldItemProps, newItemProps, badgeValue);

  APPLY_COLOR_PROP(self, oldItemProps, newItemProps, badgeForegroundColor);
  APPLY_COLOR_PROP(self, oldItemProps, newItemProps, badgeBackgroundColor);

  APPLY_STRING_PROP(self, oldItemProps, newItemProps, badgeFontFamily);
  APPLY_STRING_PROP(self, oldItemProps, newItemProps, badgeFontWeight);
  APPLY_OPTIONAL_DOUBLE_PROP(self, oldItemProps, newItemProps, badgeFontSize);

  [super updateProps:props oldProps:oldProps];

  if (self.barParent != nil) {
    [self.barParent updateBarItem:self];
  }
}

- (void)emitPress
{
  if (self.disabled) {
    return;
  }

  if (auto eventEmitter = std::static_pointer_cast<RNSBarItemEventEmitter const>(_eventEmitter)) {
    eventEmitter->onItemPress({});
  }
}

@end
