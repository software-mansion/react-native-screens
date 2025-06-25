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
