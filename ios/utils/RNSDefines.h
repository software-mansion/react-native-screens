#pragma once

#define RNS_IGNORE_SUPER_CALL_BEGIN \
  _Pragma("clang diagnostic push")  \
      _Pragma("clang diagnostic ignored \"-Wobjc-missing-super-calls\"")

#define RNS_IGNORE_SUPER_CALL_END _Pragma("clang diagnostic pop")
