
#ifdef RN_FABRIC_ENABLED
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>
#import <react/renderer/components/rnscreens/Props.h>
#endif

#import <react/RCTViewManager.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackHeaderSubview :
#ifdef RN_FABRIC_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

#ifdef RN_FABRIC_ENABLED
@property (nonatomic) facebook::react::RNSScreenStackHeaderSubviewType type;
#else
@property (nonatomic, weak) RCTBridge *bridge; // TODO: consider moving this to paper only section
@property (nonatomic, weak) UIView *reactSuperview;
@property (nonatomic) RNSScreenStackHeaderSubviewType type;

- (instancetype)initWithBridge:(RCTBridge *)bridge; // TODO: consider moving this to paper only section
#endif
@end

@interface RNSScreenStackHeaderSubviewManager : RCTViewManager

@property (nonatomic) RNSScreenStackHeaderSubviewType type;

@end

NS_ASSUME_NONNULL_END
