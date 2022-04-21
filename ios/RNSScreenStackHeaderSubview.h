
#ifdef RN_FABRIC_ENABLED
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>
#import <react/renderer/components/rnscreens/Props.h>
#endif

#import <React/RCTConvert.h>
#import <react/RCTViewManager.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackHeaderSubview :
#ifdef RN_FABRIC_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

@property (nonatomic) RNSScreenStackHeaderSubviewType type;
@property (nonatomic, weak) RCTBridge *bridge; // TODO: consider moving this to paper only section
- (instancetype)initWithBridge:(RCTBridge *)bridge; // TODO: consider moving this to paper only section
                                                    // right now it is possible to call this code in Fabric impl

#ifndef RN_FABRIC_ENABLED
@property (nonatomic, weak) UIView *reactSuperview;
#endif

@end

@interface RNSScreenStackHeaderSubviewManager : RCTViewManager

@property (nonatomic) RNSScreenStackHeaderSubviewType type;

@end

@interface RCTConvert (RNSScreenStackHeaderSubview)

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewType:(id)json;

@end

NS_ASSUME_NONNULL_END
