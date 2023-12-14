#include "RNScreensTurboModule.h"

using namespace facebook;

namespace RNScreens {

const char RNScreensTurboModule::MODULE_NAME[] = "RNScreensTurboModule";

std::function<std::array<int, 2>(int)> RNScreensTurboModule::startTransitionBlock_;
std::function<void(int, double)> RNScreensTurboModule::updateTransitionBlock_;
std::function<void(int, bool)> RNScreensTurboModule::finishTransitionBlock_;

RNScreensTurboModule::RNScreensTurboModule(
  std::function<std::array<int, 2>(int)> startTransitionBlock,
  std::function<void(int, double)> updateTransitionBlock,
  std::function<void(int, bool)> finishTransitionBlock
) {
  startTransitionBlock_ = startTransitionBlock;
  updateTransitionBlock_ = updateTransitionBlock;
  finishTransitionBlock_ = finishTransitionBlock;
}

RNScreensTurboModule::~RNScreensTurboModule() {};

jsi::Value RNScreensTurboModule::get(jsi::Runtime& rt, const jsi::PropNameID& name) {   
  if (name.utf8(rt) == "startTransition") {
    return jsi::Function::createFromHostFunction(rt, name, 1, startTransition);
  }
  else if (name.utf8(rt) == "updateTransition") {
    return jsi::Function::createFromHostFunction(rt, name, 2, updateTransition);
  }
  else if (name.utf8(rt) == "finishTransition") {
    return jsi::Function::createFromHostFunction(rt, name, 2, finishTransition);
  }
  return jsi::Value::undefined();
}

void RNScreensTurboModule::set(jsi::Runtime&, const jsi::PropNameID&, const jsi::Value&) {};

std::vector<jsi::PropNameID> RNScreensTurboModule::getPropertyNames(jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> properties;
  properties.push_back(jsi::PropNameID::forUtf8(rt, "startTransition"));
  properties.push_back(jsi::PropNameID::forUtf8(rt, "updateTransition"));
  properties.push_back(jsi::PropNameID::forUtf8(rt, "finishTransition"));
  return properties;
}

jsi::Value RNScreensTurboModule::startTransition(
  jsi::Runtime &rt, 
  const jsi::Value &thisValue,
  const jsi::Value *arguments, 
  size_t count
) {
  if (count < 1) {
    throw jsi::JSError(rt, "startTransition require 1 argument");
  }
  int stackTag = arguments[0].asNumber();
  auto screenTags = startTransitionBlock_(stackTag);
  jsi::Object screenTagsObject(rt);
  jsi::Value topScreenTag, belowTopScreenTag, canStartTransition;
  if (screenTags[0] > -1) {
    topScreenTag = jsi::Value(screenTags[0]);
    belowTopScreenTag = jsi::Value(screenTags[1]);
    canStartTransition = jsi::Value(true);
  } else {
    topScreenTag = jsi::Value(-1);
    belowTopScreenTag = jsi::Value(-1);
    canStartTransition = jsi::Value(false);
  }
  screenTagsObject.setProperty(rt, "topScreenTag", topScreenTag);
  screenTagsObject.setProperty(rt, "belowTopScreenTag", belowTopScreenTag);
  screenTagsObject.setProperty(rt, "canStartTransition", canStartTransition);
  return screenTagsObject;
}
  
jsi::Value RNScreensTurboModule::updateTransition(
  jsi::Runtime &rt, 
  const jsi::Value &thisValue,
  const jsi::Value *arguments, 
  size_t count
) {
  if (count < 2) {
    throw jsi::JSError(rt, "updateTransition require 2 argument");
  }
  int stackTag = arguments[0].asNumber();
  double progress = arguments[1].asNumber();
  updateTransitionBlock_(stackTag, progress);
  return jsi::Value::undefined();
}
  
jsi::Value RNScreensTurboModule::finishTransition(
  jsi::Runtime &rt, 
  const jsi::Value &thisValue,
  const jsi::Value *arguments, 
  size_t count
) {
  if (count < 2) {
    throw jsi::JSError(rt, "finishTransition require 2 argument");
  }
  int stackTag = arguments[0].asNumber();
  bool canceled = arguments[1].getBool();
  finishTransitionBlock_(stackTag, canceled);
  return jsi::Value::undefined();
}

}
