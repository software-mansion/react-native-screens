#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Receives every failed `RNSAssert`. `condition`, `file` and `function` are the caller's
 * stringified condition, `__FILE__` and `__func__`.
 */
typedef void (
    ^RNSAssertHandler)(const char *condition, const char *file, int line, const char *function, NSString *message);

/**
 * Replaces the handler. Passing `nil` restores the default one, which logs the failure
 * and aborts in `DEBUG` builds.
 * Not thread-safe: install the handler once, before the first assertion is evaluated.
 */
FOUNDATION_EXTERN void RNSSetAssertHandler(RNSAssertHandler _Nullable handler);

FOUNDATION_EXTERN void _RNSAssertFormat(const char *condition,
                                        const char *file,
                                        int line,
                                        const char *function,
                                        NSString *format,
                                        ...) NS_FORMAT_FUNCTION(5, 6);

NS_ASSUME_NONNULL_END

// Compiled out together with `NSAssert` / `RCTAssert`: the condition is not evaluated
// when `NS_BLOCK_ASSERTIONS` is defined.
#ifndef NS_BLOCK_ASSERTIONS
#define RNSAssert(condition, ...)                                              \
  do {                                                                         \
    if ((condition) == 0) {                                                    \
      _RNSAssertFormat(#condition, __FILE__, __LINE__, __func__, __VA_ARGS__); \
    }                                                                          \
  } while (0)
#else
#define RNSAssert(condition, ...) \
  do {                            \
  } while (0)
#endif
