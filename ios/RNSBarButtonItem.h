#import <UIKit/UIKit.h>

typedef void (^RNSBarButtonItemAction)(NSString *buttonId);

@interface RNSBarButtonItem : UIBarButtonItem

- (instancetype)initWithDictionary:(NSDictionary<NSString *, id> *)dict
                           action:(RNSBarButtonItemAction)action;

@end 
