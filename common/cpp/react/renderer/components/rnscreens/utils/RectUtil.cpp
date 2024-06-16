#include "RectUtil.h"

namespace rnscreens {

bool compareFrameSizes(
    const react::Size &first,
    const react::Size &second,
    float eps) {
  return equalWithRespectToEps(first.width, second.width, eps) &&
      equalWithRespectToEps(first.height, second.height, eps);
}

} // namespace rnscreens
