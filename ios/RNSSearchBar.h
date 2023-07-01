#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#endif

#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import <React/RCTViewManager.h>

@interface RCTConvert (RNSSearchBar)

// Defined in RCTConvert itself
//+ (UIBarStyle)UIBarStyle:(id)json;
+ (UISearchBarStyle)UISearchBarStyle:(id)json;

@end

@interface RNSSearchBar :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView <UISearchBarDelegate, RCTRNSSearchBarViewProtocol>
#else
    UIView <UISearchBarDelegate>
#endif

@property (nonatomic) BOOL hideWhenScrolling;

@property (nonatomic, retain) UISearchController *controller;

#ifdef RCT_NEW_ARCH_ENABLED
#else
@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;
@property (nonatomic, copy) RCTBubblingEventBlock onCancelButtonPress;
@property (nonatomic, copy) RCTBubblingEventBlock onSearchButtonPress;
@property (nonatomic, copy) RCTBubblingEventBlock onFocus;
@property (nonatomic, copy) RCTBubblingEventBlock onBlur;
#endif

@end

@interface RNSSearchBarManager : RCTViewManager

@end
