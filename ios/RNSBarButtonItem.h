#pragma once

#if defined(__cplusplus)
#import <React/RCTImageLoader.h>
#endif // defined(__cplusplus)
#import <UIKit/UIKit.h>

typedef void (^RNSBarButtonItemAction)(NSString *buttonId);
typedef void (^RNSBarButtonMenuItemAction)(NSString *menuId);
typedef void (^RNSBarButtonMenuPresentedCallback)(void);

@interface RNSBarButtonItem : UIBarButtonItem

#if defined(__cplusplus)
- (instancetype)initWithConfig:(NSDictionary<NSString *, id> *)dict
                        action:(RNSBarButtonItemAction)action
                    menuAction:(RNSBarButtonMenuItemAction)menuAction
                menuPresented:(RNSBarButtonMenuPresentedCallback)menuPresented
                   imageLoader:(RCTImageLoader *)imageLoader;
#endif // defined(__cplusplus)

@end
