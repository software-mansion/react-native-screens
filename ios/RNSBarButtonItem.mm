#import "RNSBarButtonItem.h"
#import <React/RCTConvert.h>
#import <React/RCTFont.h>
#import <React/RCTImageSource.h>
#import <objc/runtime.h>
#import "RNSDefines.h"

@implementation RNSBarButtonItem {
  NSString *_buttonId;
  RNSBarButtonItemAction _itemAction;
}

- (instancetype)initWithConfig:(NSDictionary<NSString *, id> *)dict
                        action:(RNSBarButtonItemAction)action
                    menuAction:(RNSBarButtonMenuItemAction)menuAction
                   imageLoader:(RCTImageLoader *)imageLoader
{
  self = [super init];
  if (!self) {
    return self;
  }

  self.title = dict[@"label"];

  NSDictionary *imageSourceObj = dict[@"imageSource"];
  if (imageSourceObj) {
    RCTImageSource *imageSource = [RCTConvert RCTImageSource:imageSourceObj];
    [imageLoader loadImageWithURLRequest:imageSource.request
                                callback:^(NSError *_Nullable error, UIImage *_Nullable image) {
                                  dispatch_async(dispatch_get_main_queue(), ^{
                                    self.image = image;
                                  });
                                }];
  }
  NSString *sfSymbolName = dict[@"sfSymbolName"];
  if (sfSymbolName) {
    self.image = [UIImage systemImageNamed:sfSymbolName];
  }

  NSDictionary *labelStyle = dict[@"labelStyle"];
  if (labelStyle) {
    [self setLabelStyleFromConfig:labelStyle];
  }

  id tintColorObj = dict[@"tintColor"];
  if (tintColorObj) {
    self.tintColor = [RCTConvert UIColor:tintColorObj];
  }

#if !TARGET_OS_TV
  NSNumber *selectedNum = dict[@"selected"];
  if (selectedNum != nil) {
    self.selected = [selectedNum boolValue];
  }
#endif

  NSNumber *disabledNum = dict[@"disabled"];
  if (disabledNum != nil) {
    self.enabled = ![disabledNum boolValue];
  }

  NSNumber *width = dict[@"width"];
  if (width) {
    self.width = [width doubleValue];
  }

#if !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
  if (@available(tvOS 17.0, *)) {
    NSNumber *changesSelectionAsPrimaryActionNum = dict[@"changesSelectionAsPrimaryAction"];
    if (changesSelectionAsPrimaryActionNum != nil) {
      self.changesSelectionAsPrimaryAction = [changesSelectionAsPrimaryActionNum boolValue];
    }
  }
#endif

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    NSNumber *hidesSharedBackgroundNum = dict[@"hidesSharedBackground"];
    if (hidesSharedBackgroundNum != nil) {
      self.hidesSharedBackground = [hidesSharedBackgroundNum boolValue];
    }
    NSNumber *sharesBackgroundNum = dict[@"sharesBackground"];
    if (sharesBackgroundNum != nil) {
      self.sharesBackground = [sharesBackgroundNum boolValue];
    }
    NSString *identifier = dict[@"identifier"];
    if (identifier != nil) {
      self.identifier = identifier;
    }
    NSDictionary *badgeConfig = dict[@"badge"];
    if (badgeConfig != nil) {
      [self setBadgeFromConfig:badgeConfig];
    }
  }
#endif

  NSString *variant = dict[@"variant"];
  if (variant) {
    if ([variant isEqualToString:@"done"]) {
      self.style = UIBarButtonItemStyleDone;
    } else if ([variant isEqualToString:@"prominent"]) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      if (@available(iOS 26.0, *)) {
        self.style = UIBarButtonItemStyleProminent;
      }
#endif
    } else {
      self.style = UIBarButtonItemStylePlain;
    }
  }

  if (dict[@"accessibilityLabel"]) {
    self.accessibilityLabel = dict[@"accessibilityLabel"];
  }
  if (dict[@"accessibilityHint"]) {
    self.accessibilityHint = dict[@"accessibilityHint"];
  }

#if !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
  if (@available(tvOS 17.0, *)) {
    NSDictionary *menu = dict[@"menu"];
    if (menu) {
      self.menu = [[self class] initUIMenuWithDict:menu menuAction:menuAction];
    }
  }
#endif

  NSString *buttonId = dict[@"buttonId"];
  if (buttonId && action) {
    self.target = self;
    self.action = @selector(handleBarButtonItemPress:);
    _itemAction = action;
    _buttonId = buttonId;
  }
  return self;
}

+ (UIMenu *)initUIMenuWithDict:(NSDictionary<NSString *, id> *)dict menuAction:(RNSBarButtonMenuItemAction)menuAction
{
  NSArray *items = dict[@"items"];
  NSMutableArray<UIMenuElement *> *elements = [NSMutableArray new];
  if (items.count > 0) {
    for (NSDictionary *item in items) {
      NSString *menuId = item[@"menuId"];
      if (menuId) {
        UIAction *actionItem = [self createActionItemFromConfig:item menuAction:menuAction];
        [elements addObject:actionItem];
      } else {
        UIMenu *childMenu = [self initUIMenuWithDict:item menuAction:menuAction];
        if (childMenu) {
          [elements addObject:childMenu];
        }
      }
    }
  }
  NSString *label = dict[@"label"];
  NSString *sfSymbolName = dict[@"sfSymbolName"];
  return [UIMenu menuWithTitle:label
                         image:sfSymbolName ? [UIImage systemImageNamed:sfSymbolName] : nil
                    identifier:nil
                       options:0
                      children:elements];
}

+ (UIAction *)createActionItemFromConfig:(NSDictionary *)dict menuAction:(RNSBarButtonMenuItemAction)menuAction
{
  NSString *menuId = dict[@"menuId"];
  NSString *label = dict[@"label"];
  NSString *sfSymbolName = dict[@"sfSymbolName"];
  UIAction *actionElement = [UIAction actionWithTitle:label
                                                image:sfSymbolName ? [UIImage systemImageNamed:sfSymbolName] : nil
                                           identifier:nil
                                              handler:^(__kindof UIAction *_Nonnull a) {
                                                menuAction(menuId);
                                              }];

  NSString *discoverabilityLabel = dict[@"discoverabilityLabel"];
  if (discoverabilityLabel != nil) {
    actionElement.discoverabilityTitle = discoverabilityLabel;
  }

  NSString *state = dict[@"state"];
  if ([state isEqualToString:@"on"]) {
    actionElement.state = UIMenuElementStateOn;
  } else if ([state isEqualToString:@"off"]) {
    actionElement.state = UIMenuElementStateOff;
  } else if ([state isEqualToString:@"mixed"]) {
    actionElement.state = UIMenuElementStateMixed;
  }

  NSString *attributes = dict[@"attributes"];
  if ([attributes isEqualToString:@"destructive"]) {
    actionElement.attributes = UIMenuElementAttributesDestructive;
  } else if ([attributes isEqualToString:@"disabled"]) {
    actionElement.attributes = UIMenuElementAttributesDisabled;
  } else if ([attributes isEqualToString:@"hidden"]) {
    actionElement.attributes = UIMenuElementAttributesHidden;
  } else if ([attributes isEqualToString:@"keepsMenuPresented"]) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
    if (@available(iOS 16.0, *)) {
      actionElement.attributes = UIMenuElementAttributesKeepsMenuPresented;
    }
#endif
#if TARGET_OS_TV && __TV_OS_VERSION_MAX_ALLOWED >= 160000
    if (@available(tvOS 16.0, *)) {
      actionElement.attributes = UIMenuElementAttributesKeepsMenuPresented;
    }
#endif
  }
  return actionElement;
}

- (void)handleBarButtonItemPress:(UIBarButtonItem *)item
{
  if (_itemAction && _buttonId) {
    _itemAction(_buttonId);
  }
}

- (void)setLabelStyleFromConfig:(NSDictionary *)labelStyle
{
  NSString *fontFamily = labelStyle[@"fontFamily"];
  NSNumber *fontSize = labelStyle[@"fontSize"];
  NSString *fontWeight = labelStyle[@"fontWeight"];
  NSMutableDictionary *attrs = [NSMutableDictionary new];
  if (fontFamily || fontWeight) {
    NSNumber *resolvedFontSize = fontSize;
    if (!resolvedFontSize) {
#if TARGET_OS_TV
      resolvedFontSize = [NSNumber numberWithDouble:17.0];
#else
      resolvedFontSize = [NSNumber numberWithFloat:[UIFont labelFontSize]];
#endif
    }

    attrs[NSFontAttributeName] = [RCTFont updateFont:nil
                                          withFamily:fontFamily
                                                size:resolvedFontSize
                                              weight:fontWeight
                                               style:nil
                                             variant:nil
                                     scaleMultiplier:1.0];
  } else {
    CGFloat resolvedFontSize = fontSize ? [fontSize floatValue] : 0;
    if (resolvedFontSize == 0) {
#if TARGET_OS_TV
      resolvedFontSize = 17.0;
#else
      resolvedFontSize = [UIFont labelFontSize];
#endif
    }

    attrs[NSFontAttributeName] = [UIFont systemFontOfSize:resolvedFontSize];
  }
  id labelColor = labelStyle[@"color"];
  if (labelColor) {
    attrs[NSForegroundColorAttributeName] = [RCTConvert UIColor:labelColor];
  }
  [self setTitleTextAttributes:attrs forState:UIControlStateNormal];
  [self setTitleTextAttributes:attrs forState:UIControlStateHighlighted];
  [self setTitleTextAttributes:attrs forState:UIControlStateDisabled];
  [self setTitleTextAttributes:attrs forState:UIControlStateSelected];
  [self setTitleTextAttributes:attrs forState:UIControlStateFocused];
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
- (void)setBadgeFromConfig:(NSDictionary *)badgeObj
{
  if (@available(iOS 26.0, *)) {
    UIBarButtonItemBadge *badge = [UIBarButtonItemBadge badgeWithString:badgeObj[@"value"]];
    NSDictionary *style = badgeObj[@"style"];
    if (style) {
      id colorObj = style[@"color"];
      if (colorObj) {
        badge.foregroundColor = [RCTConvert UIColor:colorObj];
      }
      id backgroundColorObj = style[@"backgroundColor"];
      if (backgroundColorObj) {
        badge.backgroundColor = [RCTConvert UIColor:backgroundColorObj];
      }
      NSString *fontFamily = style[@"fontFamily"];
      NSNumber *fontSize = style[@"fontSize"];
      NSString *fontWeight = style[@"fontWeight"];
      if (fontSize || fontWeight) {
        badge.font = [RCTFont updateFont:nil
                              withFamily:fontFamily
                                    size:fontSize
                                  weight:fontWeight
                                   style:nil
                                 variant:nil
                         scaleMultiplier:1.0];
      } else {
        CGFloat resolvedFontSize = fontSize ? [fontSize floatValue] : 0;
        if (resolvedFontSize == 0) {
#if TARGET_OS_TV
          resolvedFontSize = 17.0;
#else
          resolvedFontSize = [UIFont labelFontSize];
#endif
        }
        badge.font = [UIFont systemFontOfSize:resolvedFontSize];
      }
    }
    self.badge = badge;
  }
}
#endif

@end
