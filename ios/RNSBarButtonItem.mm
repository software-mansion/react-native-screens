#import "RNSBarButtonItem.h"
#import <React/RCTConvert.h>
#import <objc/runtime.h>
#import <React/RCTFont.h>

static char RNSBarButtonItemActionKey;
static char RNSBarButtonItemIdKey;

@implementation RNSBarButtonItem

- (instancetype)initWithDictionary:(NSDictionary<NSString *, id> *)dict
                           action:(RNSBarButtonItemAction)action
{
  self = [super init];
  if (self) {
    self.title = dict[@"title"];

    NSDictionary *imageObj = dict[@"image"];
    if (imageObj) {
      self.image = [RCTConvert UIImage:imageObj];
    }
    
    NSDictionary *titleStyle = dict[@"titleStyle"];
    if (titleStyle) {
      NSString *fontFamily = titleStyle[@"fontFamily"];
      NSNumber *fontSize = titleStyle[@"fontSize"];
      NSString *fontWeight = titleStyle[@"fontWeight"];
      NSMutableDictionary *attrs = [NSMutableDictionary new];
      if (fontFamily || fontWeight) {
        attrs[NSFontAttributeName] = [RCTFont updateFont:nil
                                              withFamily:fontFamily
                                                    size:fontSize
                                                  weight:fontWeight
                                                   style:nil
                                                 variant:nil
                                         scaleMultiplier:1.0];
      } else {
        attrs[NSFontAttributeName] = [UIFont systemFontOfSize:[fontSize floatValue]];
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
    #if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_15_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_15_0
    if (@available(iOS 15.0, *)) {
      NSNumber *changesSelectionAsPrimaryActionNum = dict[@"changesSelectionAsPrimaryAction"];
      if (changesSelectionAsPrimaryActionNum != nil) {
        self.changesSelectionAsPrimaryAction = [changesSelectionAsPrimaryActionNum boolValue];
      }
    }
    #endif
    
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
    }
    #endif
  
    
    NSString *style = dict[@"style"];
    if (style) {
      if ([style isEqualToString:@"Done"]) {
        self.style = UIBarButtonItemStyleDone;
      } else if ([style isEqualToString:@"Prominent"]) {
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
    
    #if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 140000
    if (@available(iOS 14.0, *)) {
      NSArray *menuItems = dict[@"menu"];
      if (menuItems.count > 0) {
        NSMutableArray<UIMenuElement *> *actions = [NSMutableArray new];
        for (NSDictionary *item in menuItems) {
          NSString *title = item[@"title"];
          if (![title isKindOfClass:[NSString class]]) continue;
          UIAction *actionElement = [UIAction actionWithTitle:title
                                                        image:nil
                                                   identifier:nil
                                                      handler:^(__kindof UIAction * _Nonnull a) {
            RNSBarButtonItemAction parentAction = objc_getAssociatedObject(self, &RNSBarButtonItemActionKey);
            if (parentAction) {
              parentAction(title);
            }
          }];
          [actions addObject:actionElement];
        }
        NSMutableArray<UIMenuElement *> *children = [NSMutableArray new];
        
        [children addObject:[UIMenu menuWithTitle:@"på" children:actions]];
        self.menu = [UIMenu menuWithTitle:@"hej" children:children];
      }
    }
    #endif
    
    NSString *buttonId = dict[@"buttonId"];
    if (buttonId && action) {
      self.target = self;
      self.action = @selector(handleBarButtonItemPress:);
      objc_setAssociatedObject(self, &RNSBarButtonItemIdKey, buttonId, OBJC_ASSOCIATION_COPY_NONATOMIC);
      objc_setAssociatedObject(self, &RNSBarButtonItemActionKey, action, OBJC_ASSOCIATION_COPY_NONATOMIC);
    }
  }
  return self;
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
