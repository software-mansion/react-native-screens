#import "RNSReactDiagnosticHandlers.h"

#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import "RNSAssert.h"
#import "RNSLog.h"

static RCTLogLevel RCTLogLevelFromRNSLogLevel(RNSLogLevel level)
{
  switch (level) {
    case RNSLogLevelVerbose:
    case RNSLogLevelDebug:
    case RNSLogLevelInfo:
      // Not `RCTLogLevelTrace`: it is below React Native's default log threshold.
      return RCTLogLevelInfo;
    case RNSLogLevelWarning:
      return RCTLogLevelWarning;
    case RNSLogLevelError:
    case RNSLogLevelWTF:
      return RCTLogLevelError;
  }
  return RCTLogLevelError;
}

void RNSInstallReactDiagnosticHandlers(void)
{
  RNSSetLogHandler(^(RNSLogLevel level, const char *file, int line, NSString *message) {
    _RCTLogNativeInternal(RCTLogLevelFromRNSLogLevel(level), file, line, @"%@", message);
  });

  // Mirrors the body of `RCTAssert`, with the caller's location passed through.
  RNSSetAssertHandler(^(const char *condition, const char *file, int line, const char *function, NSString *message) {
    _RCTAssertFormat(condition, file, line, function, @"%@", message);
    if (RCT_NSASSERT) {
      [[NSAssertionHandler currentHandler] handleFailureInFunction:@(function)
                                                              file:@(file)
                                                        lineNumber:line
                                                       description:@"%@", message];
    }
  });
}
