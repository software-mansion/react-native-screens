#import "RNSBarButtonItem.h"
#import <React/RCTConvert.h>
#import <React/RCTFont.h>
#import <objc/runtime.h>

static char RNSBarButtonItemActionKey;
static char RNSBarButtonItemIdKey;

@implementation RNSBarButtonItem

- (instancetype)initWithDictionary:(NSDictionary<NSString *, id> *)dict
                            action:(RNSBarButtonItemAction)action
                        menuAction:(RNSBarButtonMenuItemAction)menuAction

{
  self = [super init];
  if (!self) {
    return self;
  }

  self.title = dict[@"title"];

  NSDictionary *imageObj = dict[@"image"];
  if (imageObj) {
    self.image = [RCTConvert UIImage:imageObj];
  }
  NSString *sfSymbolName = dict[@"sfSymbolName"];
  if (sfSymbolName) {
    self.image = [UIImage systemImageNamed:sfSymbolName];
  }

  NSDictionary *titleStyle = dict[@"titleStyle"];
  if (titleStyle) {
    NSString *fontFamily = titleStyle[@"fontFamily"];
    NSNumber *fontSize = titleStyle[@"fontSize"];
    NSString *fontWeight = titleStyle[@"fontWeight"];
    NSMutableDictionary *attrs = [NSMutableDictionary new];
    if (fontFamily || fontWeight) {
      NSNumber *resolvedFontSize = fontSize ? fontSize : [NSNumber numberWithFloat:[UIFont labelFontSize]];
      attrs[NSFontAttributeName] = [RCTFont updateFont:nil
                                            withFamily:fontFamily
                                                  size:resolvedFontSize
                                                weight:fontWeight
                                                 style:nil
                                               variant:nil
                                       scaleMultiplier:1.0];
    } else {
      CGFloat resolvedFontSize = fontSize ? [fontSize floatValue] : [UIFont labelFontSize];
      attrs[NSFontAttributeName] = [UIFont systemFontOfSize:resolvedFontSize];
    }
    id titleColor = titleStyle[@"color"];
    if (titleColor) {
      attrs[NSForegroundColorAttributeName] = [RCTConvert UIColor:titleColor];
    }
    [self setTitleTextAttributes:attrs forState:UIControlStateNormal];
    [self setTitleTextAttributes:attrs forState:UIControlStateHighlighted];
    [self setTitleTextAttributes:attrs forState:UIControlStateDisabled];
    [self setTitleTextAttributes:attrs forState:UIControlStateSelected];
    [self setTitleTextAttributes:attrs forState:UIControlStateFocused];
  }

  id tintColorObj = dict[@"tintColor"];
  if (tintColorObj) {
    self.tintColor = [RCTConvert UIColor:tintColorObj];
  }

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0
  if (@available(iOS 16.0, *)) {
    NSNumber *hiddenNum = dict[@"hidden"];
    if (hiddenNum != nil) {
      self.hidden = [hiddenNum boolValue];
    }
  }
#endif

  NSNumber *selectedNum = dict[@"selected"];
  if (selectedNum != nil) {
    self.selected = [selectedNum boolValue];
  }

  NSNumber *enabledNum = dict[@"enabled"];
  if (enabledNum != nil) {
    self.enabled = [enabledNum boolValue];
  }

  NSNumber *width = dict[@"width"];
  if (width) {
    self.width = [width doubleValue];
  }

  NSNumber *changesSelectionAsPrimaryActionNum = dict[@"changesSelectionAsPrimaryAction"];
  if (changesSelectionAsPrimaryActionNum != nil) {
    self.changesSelectionAsPrimaryAction = [changesSelectionAsPrimaryActionNum boolValue];
  }

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
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
    NSDictionary *badgeObj = dict[@"badge"];
    if (badgeObj != nil) {
      UIBarButtonItemBadge *badge = [UIBarButtonItemBadge badgeWithString:badgeObj[@"value"]];
      id colorObj = badgeObj[@"color"];
      if (colorObj) {
        badge.foregroundColor = [RCTConvert UIColor:colorObj];
      }
      id backgroundColorObj = badgeObj[@"backgroundColor"];
      if (colorObj) {
        badge.backgroundColor = [RCTConvert UIColor:backgroundColorObj];
      }
      NSDictionary *style = badgeObj[@"style"];
      if (style) {
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
          badge.font = [UIFont systemFontOfSize:[fontSize floatValue]];
        }
      }
      self.badge = badge;
    }
  }
#endif

  NSString *style = dict[@"style"];
  if (style) {
    if ([style isEqualToString:@"done"]) {
      self.style = UIBarButtonItemStyleDone;
    } else if ([style isEqualToString:@"prominent"]) {
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
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

  NSDictionary *menu = dict[@"menu"];
  if (menu) {
    self.menu = [[self class] initUIMenuWithDict:menu menuAction:menuAction];
  }

  NSString *buttonId = dict[@"buttonId"];
  if (buttonId && action) {
    self.target = self;
    self.action = @selector(handleBarButtonItemPress:);
    objc_setAssociatedObject(self, &RNSBarButtonItemIdKey, buttonId, OBJC_ASSOCIATION_COPY_NONATOMIC);
    objc_setAssociatedObject(self, &RNSBarButtonItemActionKey, action, OBJC_ASSOCIATION_COPY_NONATOMIC);
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
        NSString *title = item[@"title"];
        NSString *sfSymbolName = item[@"sfSymbolName"];
        UIAction *actionElement = [UIAction actionWithTitle:title
                                                      image:sfSymbolName ? [UIImage systemImageNamed:sfSymbolName] : nil
                                                 identifier:nil
                                                    handler:^(__kindof UIAction *_Nonnull a) {
                                                      menuAction(menuId);
                                                    }];
        NSString *state = item[@"state"];
        if ([state isEqualToString:@"on"]) {
          actionElement.state = UIMenuElementStateOn;
        } else if ([state isEqualToString:@"off"]) {
          actionElement.state = UIMenuElementStateOff;
        } else if ([state isEqualToString:@"mixed"]) {
          actionElement.state = UIMenuElementStateMixed;
        }

        NSString *attributes = item[@"attributes"];
        if ([attributes isEqualToString:@"destructive"]) {
          actionElement.attributes = UIMenuElementAttributesDestructive;
        } else if ([attributes isEqualToString:@"disabled"]) {
          actionElement.attributes = UIMenuElementAttributesDisabled;
        } else if ([attributes isEqualToString:@"hidden"]) {
          actionElement.attributes = UIMenuElementAttributesHidden;
        }
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0
        else if (@available(iOS 16.0, *)) {
          if ([attributes isEqualToString:@"keepsMenuPresented"]) {
            actionElement.attributes = UIMenuElementAttributesKeepsMenuPresented;
          }
        }
#endif
        [elements addObject:actionElement];
      } else {
        UIMenu *childMenu = [self initUIMenuWithDict:item menuAction:menuAction];
        if (childMenu) {
          [elements addObject:childMenu];
        }
      }
    }
  }
  NSString *title = dict[@"title"];
  return [UIMenu menuWithTitle:title children:elements];
}

- (void)handleBarButtonItemPress:(UIBarButtonItem *)item
{
  NSString *buttonId = objc_getAssociatedObject(self, &RNSBarButtonItemIdKey);
  RNSBarButtonItemAction action = objc_getAssociatedObject(self, &RNSBarButtonItemActionKey);
  if (action && buttonId) {
    action(buttonId);
  }
}

@end
