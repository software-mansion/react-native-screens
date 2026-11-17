#import "RNSLog.h"

#import <os/log.h>

static os_log_type_t RNSOSLogTypeFromLogLevel(RNSLogLevel level)
{
  switch (level) {
    case RNSLogLevelVerbose:
    case RNSLogLevelDebug:
      return OS_LOG_TYPE_DEBUG;
    case RNSLogLevelInfo:
      return OS_LOG_TYPE_INFO;
    case RNSLogLevelWarning:
      return OS_LOG_TYPE_DEFAULT;
    case RNSLogLevelError:
      return OS_LOG_TYPE_ERROR;
    case RNSLogLevelWTF:
      return OS_LOG_TYPE_FAULT;
  }
  return OS_LOG_TYPE_DEFAULT;
}

static void RNSDefaultLogHandler(RNSLogLevel level, const char *file, int line, NSString *message)
{
  os_log_with_type(OS_LOG_DEFAULT, RNSOSLogTypeFromLogLevel(level), "%{public}@", message);
}

static RNSLogHandler currentLogHandler = nil;

void RNSSetLogHandler(RNSLogHandler _Nullable handler)
{
  currentLogHandler = handler;
}

void _RNSLogInternal(RNSLogLevel level, const char *file, int line, NSString *format, ...)
{
  va_list args;
  va_start(args, format);
  NSString *message = [[NSString alloc] initWithFormat:format arguments:args];
  va_end(args);

  RNSLogHandler handler = currentLogHandler;
  if (handler != nil) {
    handler(level, file, line, message);
  } else {
    RNSDefaultLogHandler(level, file, line, message);
  }
}
