// Restart mechanism adapted from `react-native-restart`:
// https://github.com/avishayil/react-native-restart/tree/v0.0.29

#import "RNSAppRestartModule.h"

#import <React/RCTReloadCommand.h>

@implementation RNSAppRestartModule

+ (NSString *)moduleName
{
  return @"RNSAppRestart";
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (void)restart
{
  RCTTriggerReloadCommandListeners(@"RNSAppRestart: restart");
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAppRestartSpecJSI>(params);
}

@end
