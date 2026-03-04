#pragma once

#if (                                                 \
    !defined(NDEBUG) && defined(RNS_DEBUG_LOGGING) && \
    RNS_DEBUG_LOGGING == 0) ||                        \
    (defined(NDEBUG) &&                               \
     (!defined(RNS_DEBUG_LOGGING) || RNS_DEBUG_LOGGING == 0))
// Replace with NOOP
#define RNSLog(...) \
  do {              \
  } while (0)
#else
#define RNSLog(...) NSLog(__VA_ARGS__)
#endif