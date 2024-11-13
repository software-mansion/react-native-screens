
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#endif

#import <React/RCTConvert.h>
#import <React/RCTViewManager.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackHeaderSubview :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

@property (nonatomic) RNSScreenStackHeaderSubviewType type;

@property (nonatomic, weak) UIView *reactSuperview;

@end

@interface RNSScreenStackHeaderSubviewManager : RCTViewManager

@property (nonatomic) RNSScreenStackHeaderSubviewType type;

@end

@interface RCTConvert (RNSScreenStackHeaderSubview)

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewType:(id)json;

@end

NS_ASSUME_NONNULL_END
