#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSLogLevel) {
  RNSLogLevelDebug,
  RNSLogLevelWarning,
  RNSLogLevelError,
};

typedef void (^RNSLogHandler)(RNSLogLevel level, NSString *message);

@interface RNSLogger : NSObject

+ (void)setHandler:(nullable RNSLogHandler)handler;

+ (void)logWithLevel:(RNSLogLevel)level format:(NSString *)format, ... NS_FORMAT_FUNCTION(2, 3);

@end

NS_ASSUME_NONNULL_END

#define RNSLogWarn(...) [RNSLogger logWithLevel:RNSLogLevelWarning format:__VA_ARGS__]
#define RNSLogError(...) [RNSLogger logWithLevel:RNSLogLevelError format:__VA_ARGS__]

#ifdef RNS_DEBUG_LOGGING
#define RNSLog(...) [RNSLogger logWithLevel:RNSLogLevelDebug format:__VA_ARGS__]
#else
// Replace with NOOP
#define RNSLog(...) \
  do {              \
  } while (0)
#endif
