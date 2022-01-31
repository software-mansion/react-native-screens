#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>

#import "RNSScreenComponentView.h"
#import "RNSScreenStackHeaderSubviewComponentView.h"

@interface RNSScreenStackHeaderConfigComponentView : RCTViewComponentView

@property (nonatomic, weak) RNSScreenComponentView *screenView;
@property (nonatomic) NSMutableArray<RNSScreenStackHeaderSubviewComponentView *> *reactSubviews;

// Properties from props
@property (nonatomic) BOOL show;
@property (nonatomic) BOOL translucent;
@property (nonatomic) BOOL hideShadow;
@property (nonatomic, retain) NSString *title;
@property (nonatomic, retain) NSString *titleFontFamily;
@property (nonatomic, retain) NSNumber *titleFontSize;
@property (nonatomic, retain) NSString *titleFontWeight;
@property (nonatomic, retain) UIColor *titleColor;
@property (nonatomic) BOOL largeTitle;
@property (nonatomic, retain) NSString *largeTitleFontFamily;
@property (nonatomic, retain) NSNumber *largeTitleFontSize;
@property (nonatomic, retain) NSString *largeTitleFontWeight;
@property (nonatomic, retain) UIColor *largeTitleBackgroundColor;
@property (nonatomic) BOOL largeTitleHideShadow;
@property (nonatomic, retain) UIColor *largeTitleColor;
@property (nonatomic, retain) UIColor *backgroundColor;
@property (nonatomic, retain) UIColor *color;
@property (nonatomic) UISemanticContentAttribute direction;
@property (nonatomic, retain) NSString *backTitle;
@property (nonatomic, retain) NSString *backTitleFontFamily;
@property (nonatomic, retain) NSNumber *backTitleFontSize;
@property (nonatomic) BOOL disableBackButtonMenu;
@property (nonatomic) BOOL hideBackButton;

+ (void)willShowViewController:(UIViewController *)vc
                      animated:(BOOL)animated
                    withConfig:(RNSScreenStackHeaderConfigComponentView *)config;

@end
