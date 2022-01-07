#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>

#import "RNSScreenComponentView.h"
#import "RNSScreenStackHeaderSubviewComponentView.h"

@interface RNSScreenStackHeaderConfigComponentView : RCTViewComponentView

@property (nonatomic, weak) RNSScreenComponentView *screenView;

@property (nonatomic) BOOL show;
@property (nonatomic) BOOL translucent;
@property (nonatomic) NSMutableArray<RNSScreenStackHeaderSubviewComponentView *> * reactSubviews;

+ (void)willShowViewController:(UIViewController *)vc
                      animated:(BOOL)animated
                    withConfig:(RNSScreenStackHeaderConfigComponentView *)config;

@end
