#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Log levels, ordered by priority (same set as `RNSLog` on Android).
 *
 * `Verbose`, `Debug` and `Info` are compiled in only when `RNS_DEBUG_LOGGING` is defined;
 * `Warning`, `Error` and `WTF` are always emitted.
 */
typedef NS_ENUM(NSInteger, RNSLogLevel) {
  RNSLogLevelVerbose = 0,
  RNSLogLevelDebug,
  RNSLogLevelInfo,
  RNSLogLevelWarning,
  RNSLogLevelError,
  RNSLogLevelWTF,
};

/**
 * Receives every emitted log entry. `file` is the caller's `__FILE__`.
 */
typedef void (^RNSLogHandler)(RNSLogLevel level, const char *file, int line, NSString *message);

/**
 * Replaces the handler. Passing `nil` restores the default one, which writes to `os_log`.
 * Not thread-safe: install the handler once, before the first log is emitted.
 */
FOUNDATION_EXTERN void RNSSetLogHandler(RNSLogHandler _Nullable handler);

FOUNDATION_EXTERN void _RNSLogInternal(RNSLogLevel level, const char *file, int line, NSString *format, ...)
    NS_FORMAT_FUNCTION(4, 5);

NS_ASSUME_NONNULL_END

#define _RNSLog(level, ...) _RNSLogInternal(level, __FILE__, __LINE__, __VA_ARGS__)

#ifdef RNS_DEBUG_LOGGING
#define RNSLogV(...) _RNSLog(RNSLogLevelVerbose, __VA_ARGS__)
#define RNSLogD(...) _RNSLog(RNSLogLevelDebug, __VA_ARGS__)
#define RNSLogI(...) _RNSLog(RNSLogLevelInfo, __VA_ARGS__)
#else
// Arguments are not evaluated when the level is disabled.
#define RNSLogV(...) \
  do {               \
  } while (0)
#define RNSLogD(...) \
  do {               \
  } while (0)
#define RNSLogI(...) \
  do {               \
  } while (0)
#endif

#define RNSLogW(...) _RNSLog(RNSLogLevelWarning, __VA_ARGS__)
#define RNSLogE(...) _RNSLog(RNSLogLevelError, __VA_ARGS__)
#define RNSLogWTF(...) _RNSLog(RNSLogLevelWTF, __VA_ARGS__)
