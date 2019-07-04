#import <React/RCTViewManager.h>

@interface RNSScreenStackHeaderConfig : UIView

@property (nonatomic, retain) NSString *title;
@property (nonatomic, retain) NSString *backTitle;
@property (nonatomic, retain) UIColor *backgroundColor;
@property (nonatomic, retain) UIColor *tintColor;
@property (nonatomic) BOOL hidden;
@property (nonatomic) BOOL largeTitle;


- (void)willShowViewController:(UIViewController *)vc;

@end

@interface RNSScreenStackHeaderConfigManager : RCTViewManager

@end

@interface RNSScreenStackHeaderTitleViewManager : RCTViewManager

@end
