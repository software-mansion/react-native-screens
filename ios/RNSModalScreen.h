#import "RNSScreen.h"

@interface RCTConvert (RNSModalScreen)

+ (RNSScreenStackPresentation)RNSScreenStackPresentation:(id)json;
+ (RNSScreenStackAnimation)RNSScreenStackAnimation:(id)json;

#if !TARGET_OS_TV
+ (RNSStatusBarStyle)RNSStatusBarStyle:(id)json;
+ (UIStatusBarAnimation)UIStatusBarAnimation:(id)json;
+ (UIInterfaceOrientationMask)UIInterfaceOrientationMask:(id)json;
#endif

@end

@interface RNSModalScreen : RNSScreenView
@end

@interface RNSModalScreenManager : RNSScreenManager

@end
