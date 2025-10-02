#include "RNSBottomTabsAccessoryShadowNode.h"

#include <yoga/Yoga.h>

namespace facebook::react {

using namespace yoga;

extern const char RNSBottomTabsAccessoryComponentName[] =
    "RNSBottomTabsAccessory";

//void RNSBottomTabsAccessoryShadowNode::adjustLayoutWithState() {
//  ensureUnsealed();
//  
//  auto state = std::static_pointer_cast<const RNSBottomTabsAccessoryShadowNode::ConcreteState>(getState());
//  auto stateData = state->getData();
//  
//  auto currentStyle = getConcreteProps().yogaStyle;
//  
//  currentStyle.setPosition(Edge::Top, Style::Length::points(735.0f));
//  currentStyle.setPosition(Edge::Left, Style::Length::points(21.0f));
//  
//  setSize({360, 48});
//  
//  yogaNode_.setStyle(currentStyle);
//  yogaNode_.setDirty(true);
//}

Point RNSBottomTabsAccessoryShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.offset;
//      return {21, 735};
}

} // namespace facebook::react
