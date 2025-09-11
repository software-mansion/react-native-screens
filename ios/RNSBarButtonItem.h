#import <UIKit/UIKit.h>

typedef void (^RNSBarButtonItemAction)(NSString *buttonId);
typedef void (^RNSBarButtonMenuItemAction)(NSString *menuId);

@interface RNSBarButtonItem : UIBarButtonItem

@property (nonatomic, copy) NSString *buttonId;
@property (nonatomic, copy) RNSBarButtonItemAction itemAction;

- (instancetype)initWithConfig:(NSDictionary<NSString *, id> *)dict
                        action:(RNSBarButtonItemAction)action
                    menuAction:(RNSBarButtonMenuItemAction)menuAction;

@end
