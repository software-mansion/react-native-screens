#import "RNSAssert.h"

#import <os/log.h>

static void RNSDefaultAssertHandler(const char *condition,
                                    const char *file,
                                    int line,
                                    const char *function,
                                    NSString *message)
{
  os_log_fault(OS_LOG_DEFAULT,
               "[RNScreens] Assertion failed: (%{public}s) in %{public}s, %{public}s:%d: %{public}@",
               condition,
               function,
               file,
               line,
               message);
#if DEBUG
  abort();
#endif
}

static RNSAssertHandler currentAssertHandler = nil;

void RNSSetAssertHandler(RNSAssertHandler _Nullable handler)
{
  currentAssertHandler = handler;
}

void _RNSAssertFormat(const char *condition, const char *file, int line, const char *function, NSString *format, ...)
{
  va_list args;
  va_start(args, format);
  NSString *message = [[NSString alloc] initWithFormat:format arguments:args];
  va_end(args);

  RNSAssertHandler handler = currentAssertHandler;
  if (handler != nil) {
    handler(condition, file, line, function, message);
  } else {
    RNSDefaultAssertHandler(condition, file, line, function, message);
  }
}
