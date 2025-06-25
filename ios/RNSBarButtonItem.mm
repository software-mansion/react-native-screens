#import "RNSBarButtonItem.h"
#import <React/RCTConvert.h>
#import <objc/runtime.h>

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
      
    id tintColorObj = dict[@"tintColor"];
    if (tintColorObj) {
      self.tintColor = [RCTConvert UIColor:tintColorObj];
    }
      
    if (@available(iOS 16.0, *)) {
      NSNumber *hiddenNum = dict[@"hidden"];
      if (hiddenNum != nil) {
        self.hidden = [hiddenNum boolValue];
      }
    }
    
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
    
    if (@available(iOS 15.0, *)) {
      NSNumber *changesSelectionAsPrimaryActionNum = dict[@"changesSelectionAsPrimaryAction"];
      if (changesSelectionAsPrimaryActionNum != nil) {
        self.changesSelectionAsPrimaryAction = [changesSelectionAsPrimaryActionNum boolValue];
      }
    }
    
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
        //self.identifier = identifier;
      }
    }
  
    
    NSString *style = dict[@"style"];
    if (style) {
      if ([style isEqualToString:@"Done"]) {
        self.style = UIBarButtonItemStyleDone;
      } else if ([style isEqualToString:@"Prominent"]) {
        if (@available(iOS 26.0, *)) {
          self.style = UIBarButtonItemStyleProminent;
        }
      } else {
        self.style = UIBarButtonItemStylePlain;
      }
    }
    
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
