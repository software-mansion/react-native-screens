#import <React/RCTViewManager.h>
#import <React/RCTConvert.h>

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

typedef NS_ENUM(NSInteger, RNSScreenStackHeaderSubviewType) {
  RNSScreenStackHeaderSubviewTypeLeft,
  RNSScreenStackHeaderSubviewTypeRight,
  RNSScreenStackHeaderSubviewTypeTitle,
};

@interface RCTConvert (RNSScreenStackHeader)

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewType:(id)json;

@end

@interface RNSScreenStackHeaderSubviewManager : RCTViewManager

@property (nonatomic) RNSScreenStackHeaderSubviewType type;

@end
