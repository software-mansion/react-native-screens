#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/utils/RectUtil.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenStackHeaderSubviewShadowNode.h"

namespace facebook::react {

using namespace rnscreens;

class RNSScreenStackHeaderSubviewComponentDescriptor final
    : public ConcreteComponentDescriptor<
          RNSScreenStackHeaderSubviewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSScreenStackHeaderSubviewShadowNode *>(&shadowNode));
    auto &subviewShadowNode =
        static_cast<RNSScreenStackHeaderSubviewShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&subviewShadowNode));
    auto &layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode &>(subviewShadowNode);

    auto state = std::static_pointer_cast<
        const RNSScreenStackHeaderSubviewShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    std::printf(
        "SubviewCD [%d] adopt frameSize {%.2lf, %.2lf}\n",
        shadowNode.getTag(),
        stateData.frameSize.width,
        stateData.frameSize.height);

    // Po zmianie rozmiaru kontentu, shadow node jest klonowany i ustawiany jest
    // tutaj stan z poprzedniego shadow node'a (możliwe, że też ostatni
    // zamontowany), który był obliczony dla poprzedniego rozmiaru kontentu.
    // Strona natywna, nic nie zmieni, bo Yoga wylayoutuje ten subview tak, żeby
    // się zmieścił w tej ograniczonej przestrzeni. Bądź tu mądry. Jak to teraz
    // naprawić? Wydaje się, że potrzebujemy w ST znać zarówno rozmiar jak i
    // content offset, żeby działały pressable. Natomiast jeżeli wymusimy
    // rozmiar SN, to nie będziemy wstanie zareagować na zmiany rozmiaru
    // zrobione nie ze strony natywnej, a z JSa...
    if (!isSizeEmpty(stateData.frameSize)) {
      //      layoutableShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
