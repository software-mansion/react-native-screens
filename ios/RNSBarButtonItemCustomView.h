#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#endif

#import <React/RCTViewManager.h>

@interface RNSBarButtonItemCustomView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

- (void)setUIBarButtonItem:(UIBarButtonItem *_Nullable)barButtonItem;

@end

@interface RNSBarButtonItemCustomViewManager : RCTViewManager

@end
