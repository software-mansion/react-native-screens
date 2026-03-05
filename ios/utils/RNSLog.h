#pragma once

#ifndef RNS_DEBUG_LOGGING
// Replace with NOOP
#define RNSLog(...) \
  do {              \
  } while (0)
#else
#define RNSLog(...) NSLog(__VA_ARGS__)
#endif