#import "RNSReactLogHandler.h"

#import <React/RCTLog.h>
#import "RNSLog.h"

@implementation RNSReactLogHandler

+ (void)load
{
  [RNSLogger setHandler:^(RNSLogLevel level, NSString *message) {
    switch (level) {
      case RNSLogLevelDebug:
        RCTLogInfo(@"%@", message);
        break;
      case RNSLogLevelWarning:
        RCTLogWarn(@"%@", message);
        break;
      case RNSLogLevelError:
        RCTLogError(@"%@", message);
        break;
    }
  }];
}

@end
