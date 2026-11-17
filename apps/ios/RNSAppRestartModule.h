// Restart mechanism adapted from `react-native-restart`:
// https://github.com/avishayil/react-native-restart/tree/v0.0.29

#import <Foundation/Foundation.h>
#import <rnscreensapps/rnscreensapps.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Reloads the whole React Native instance (JS bundle + surfaces), e.g. after `I18nManager.forceRTL`.
 */
@interface RNSAppRestartModule : NSObject <NativeAppRestartSpec>

@end

NS_ASSUME_NONNULL_END
