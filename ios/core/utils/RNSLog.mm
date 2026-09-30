#import "RNSLog.h"

static RNSLogHandler _Nullable gHandler = nil;

static NSString *RNSLogLevelName(RNSLogLevel level)
{
  switch (level) {
    case RNSLogLevelDebug:
      return @"debug";
    case RNSLogLevelWarning:
      return @"warning";
    case RNSLogLevelError:
      return @"error";
  }
}

@implementation RNSLogger

+ (void)setHandler:(nullable RNSLogHandler)handler
{
  gHandler = handler;
}

+ (void)logWithLevel:(RNSLogLevel)level format:(NSString *)format, ...
{
  va_list args;
  va_start(args, format);
  NSString *message = [[NSString alloc] initWithFormat:format arguments:args];
  va_end(args);

  RNSLogHandler handler = gHandler;
  if (handler != nil) {
    handler(level, message);
    return;
  }
  NSLog(@"[RNScreens][%@] %@", RNSLogLevelName(level), message);
}

@end
