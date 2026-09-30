#pragma once

#import <Foundation/Foundation.h>

/**
 * Copy of RCTAssert decoupled from React Native.
 */
#ifdef DEBUG
#define RNS_NSASSERT 1
#else // DEBUG
#define RNS_NSASSERT 0
#endif // DEBUG

#ifndef NS_BLOCK_ASSERTIONS
#define RNSAssert(condition, ...)                                                                    \
  do {                                                                                               \
    if ((condition) == 0) {                                                                          \
      if (RNS_NSASSERT) {                                                                            \
        [[NSAssertionHandler currentHandler] handleFailureInFunction:(NSString *_Nonnull)@(__func__) \
                                                                file:(NSString *_Nonnull)@(__FILE__) \
                                                          lineNumber:__LINE__                        \
                                                         description:__VA_ARGS__];                   \
      }                                                                                              \
    }                                                                                                \
  } while (false)
#else // !NS_BLOCK_ASSERTIONS
#define RNSAssert(condition, ...) \
  do {                            \
  } while (false)
#endif // !NS_BLOCK_ASSERTIONS
