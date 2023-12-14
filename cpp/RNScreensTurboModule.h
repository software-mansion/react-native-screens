#include <array>
#include <jsi/jsi.h>

using namespace facebook;

namespace RNScreens {

class RNScreensTurboModule : public jsi::HostObject {

  static std::function<std::array<int, 2>(int)> startTransitionBlock_;
  static std::function<void(int, double)> updateTransitionBlock_;
  static std::function<void(int, bool)> finishTransitionBlock_;

public:
  static const char MODULE_NAME[];

  RNScreensTurboModule(
    std::function<std::array<int, 2>(int)> startTransitionBlock,
    std::function<void(int, double)> updateTransitionBlock,
    std::function<void(int, bool)> finishTransitionBlock
  );
  ~RNScreensTurboModule() override;
  jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& name) override;
  void set(jsi::Runtime&, const jsi::PropNameID&, const jsi::Value&) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;
  static jsi::Value startTransition(
    jsi::Runtime &rt, 
    const jsi::Value &thisValue,
    const jsi::Value *arguments, 
    size_t count
  );
  static jsi::Value updateTransition(
    jsi::Runtime &rt, 
    const jsi::Value &thisValue,
    const jsi::Value *arguments, 
    size_t count
  );
  static jsi::Value finishTransition(
    jsi::Runtime &rt, 
    const jsi::Value &thisValue,
    const jsi::Value *arguments, 
    size_t count
  );

};

}
