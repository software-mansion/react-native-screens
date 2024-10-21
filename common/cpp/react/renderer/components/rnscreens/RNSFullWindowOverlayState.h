/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

#if defined(__APPLE__) && TARGET_OS_IOS
#include "ModalHostViewUtils.h"
#endif

namespace facebook::react {

/*
 * State for <RNSFullWindowOverlay> component.
 */
class RNSFullWindowOverlayState final {
 public:
  using Shared = std::shared_ptr<const RNSFullWindowOverlayState>;

#if defined(__APPLE__) && TARGET_OS_IOS
  RNSFullWindowOverlayState() : screenSize(RCTModalHostViewScreenSize()) {
#else
  RNSFullWindowOverlayState(){
#endif
  };
  RNSFullWindowOverlayState(Size screenSize_) : screenSize(screenSize_){};

#ifdef ANDROID
  RNSFullWindowOverlayState(
      const RNSFullWindowOverlayState &previousState,
      folly::dynamic data)
      : screenSize(Size{
            (Float)data["screenWidth"].getDouble(),
            (Float)data["screenHeight"].getDouble()}){};
#endif

  const Size screenSize{};

#ifdef ANDROID
  folly::dynamic getDynamic() const;
#endif

#pragma mark - Getters
};

} // namespace facebook::react