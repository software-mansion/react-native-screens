#include "pch.h"

#include "RNScreens.h"

namespace winrt::ReactNativeScreens {
// See https://microsoft.github.io/react-native-windows/docs/native-platform for help writing native modules

void RnScreens::Initialize(const React::ReactContext &reactContext) noexcept {
  m_context = reactContext;
}

double RnScreens::multiply(double a, double b) noexcept {
  return a * b;
}
} // namespace winrt::ReactNativeScreens