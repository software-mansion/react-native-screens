#import <UIKit/UIKit.h>

typedef void (^RNSBarButtonItemAction)(NSString *buttonId);
typedef void (^RNSBarButtonMenuItemAction)(NSString *menuId);

@interface RNSBarButtonItem : UIBarButtonItem

- (instancetype)initWithDictionary:(NSDictionary<NSString *, id> *)dict
                            action:(RNSBarButtonItemAction)action
                        menuAction:(RNSBarButtonMenuItemAction)menuAction;

@end
