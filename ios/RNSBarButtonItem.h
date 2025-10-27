#import <React/RCTImageLoader.h>
#import <UIKit/UIKit.h>

typedef void (^RNSBarButtonItemAction)(NSString *buttonId);
typedef void (^RNSBarButtonMenuItemAction)(NSString *menuId);

@interface RNSBarButtonItem : UIBarButtonItem

- (instancetype)initWithConfig:(NSDictionary<NSString *, id> *)dict
                        action:(RNSBarButtonItemAction)action
                    menuAction:(RNSBarButtonMenuItemAction)menuAction
                   imageLoader:(RCTImageLoader *)imageLoader;

@end
