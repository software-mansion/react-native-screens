#pragma once

#if defined(__cplusplus)
#import <React/RCTImageLoader.h>
#endif // defined(__cplusplus)
#import <UIKit/UIKit.h>

typedef void (^RNSBarButtonItemAction)(NSString *buttonId);
typedef void (^RNSBarButtonMenuItemAction)(NSString *menuId);

@interface RNSBarButtonItem : UIBarButtonItem

#if defined(__cplusplus)
- (instancetype)initWithConfig:(NSDictionary<NSString *, id> *)dict
                        action:(RNSBarButtonItemAction)action
                    menuAction:(RNSBarButtonMenuItemAction)menuAction
                   imageLoader:(RCTImageLoader *)imageLoader;
#endif // defined(__cplusplus)

@end
