#ifdef RN_FABRIC_ENABLED
#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>
#import <react/renderer/components/rnscreens/Props.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackHeaderSubviewComponentView : RCTViewComponentView

@property (nonatomic) facebook::react::RNSScreenStackHeaderSubviewType type;

@end

NS_ASSUME_NONNULL_END

#endif // RN_FABRIC_ENABLED
