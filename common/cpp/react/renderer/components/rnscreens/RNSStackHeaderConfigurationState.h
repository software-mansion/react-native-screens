#pragma once

#include <jsi/jsi.h>

namespace facebook::react {

class JSI_EXPORT RNSStackHeaderConfigurationState final {
 public:
  using Shared = std::shared_ptr<const RNSStackHeaderConfigurationState>;

  RNSStackHeaderConfigurationState() {};
};

} // namespace facebook::react
