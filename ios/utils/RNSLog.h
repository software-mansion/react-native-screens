#ifdef RNS_DEBUG_LOGGING
#define RNSLog(...) NSLog(__VA_ARGS__)
#else
// Replace with NOOP
#define RNSLog(...) \
  do {              \
  } while (0)
#endif