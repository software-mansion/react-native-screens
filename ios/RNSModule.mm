#import "RNSModule.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#include <jsi/jsi.h>
#import "RNSScreenStack.h"

using namespace facebook;
class RNScreensTurboModule : public jsi::HostObject {
public:
  static RNSModule *rnsModule_;
  RNScreensTurboModule(RNSModule *rnsModule) {
    rnsModule_ = rnsModule;
  }
  ~RNScreensTurboModule() override {}
  
  jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& name) override {   
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

  void set(jsi::Runtime&, const jsi::PropNameID&, const jsi::Value&) override {}
  
  static jsi::Value startTransition(
    jsi::Runtime &rt, 
    const jsi::Value &thisValue,
    const jsi::Value *arguments, 
    size_t count
  ) {
    if (count < 1) {
      throw jsi::JSError(rt, "startTransition require 1 argument");
    }
    int stackTag = arguments[0].asNumber();
    auto screenTags = [rnsModule_ innerStartTransition:@(stackTag)];
    jsi::Object screenTagsObject(rt);
    jsi::Value topScreenTag, belowTopScreenTag, canStartTransition;
    if (screenTags.count > 1) {
      topScreenTag = jsi::Value([screenTags[0] intValue]);
      belowTopScreenTag = jsi::Value([screenTags[1] intValue]);
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
  
  static jsi::Value updateTransition(
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
    [rnsModule_ innerUpdateTransition:@(stackTag) progress:progress];
    return jsi::Value::undefined();
  }
  
  static jsi::Value finishTransition(
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
    [rnsModule_ innerFinishTransition:@(stackTag) canceled:canceled];
    return jsi::Value::undefined();
  }

  std::vector<facebook::jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override {
    std::vector<facebook::jsi::PropNameID> properties;
    properties.push_back(facebook::jsi::PropNameID::forUtf8(rt, "startTransition"));
    properties.push_back(facebook::jsi::PropNameID::forUtf8(rt, "updateTransition"));
    properties.push_back(facebook::jsi::PropNameID::forUtf8(rt, "finishTransition"));
    return properties;
  }
};

RNSModule *RNScreensTurboModule::rnsModule_;

NS_ASSUME_NONNULL_BEGIN

@implementation RNSModule {
  std::atomic<bool> isActiveTransition;
}

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED
@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;
#endif // RCT_NEW_ARCH_ENABLED
@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
  // It seems that due to how UIBlocks work with uiManager, we need to call the methods there
  // for the blocks to be dispatched before the batch is completed
  return dispatch_get_main_queue();
}

- (NSDictionary *)constantsToExport
{
  [self installHostObject];
  return @{};
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(startTransition : (NSNumber *)stackTag)
{
  return [self innerStartTransition:stackTag];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(updateTransition : (NSNumber *)stackTag progress : (double)progress)
{
  return @([self innerUpdateTransition:stackTag progress:progress]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(finishTransition : (NSNumber *)stackTag canceled : (BOOL)canceled)
{
  return @([self innerFinishTransition:stackTag canceled:canceled]);
}

- (RNSScreenStackView *)getScreenStackView:(NSNumber *)reactTag
{
  RCTAssertMainQueue();
  RNSScreenStackView *view;
#ifdef RCT_NEW_ARCH_ENABLED
  view = (RNSScreenStackView *)[self.viewRegistry_DEPRECATED viewForReactTag:reactTag];
#else
  view = (RNSScreenStackView *)[self.bridge.uiManager viewForReactTag:reactTag];
#endif // RCT_NEW_ARCH_ENABLED
  return view;
}

- (NSArray<NSNumber *> *)innerStartTransition:(NSNumber *)stackTag
{
  RCTAssertMainQueue();
  RNSScreenStackView *stackView = [self getStackView:stackTag];
  if (stackView == nil || isActiveTransition) {
    return @[];
  }
  NSArray<NSNumber *> *screenTags = @[];
  auto screens = stackView.reactViewController.childViewControllers;
  unsigned long screenCount = [screens count];
  if (screenCount > 1) {
    UIView *topScreen = screens[screenCount - 1].view;
    UIView *belowTopScreen = screens[screenCount - 2].view;
    belowTopScreen.transform = CGAffineTransformMake(1, 0, 0, 1, 0, 0);
    isActiveTransition = true;
  #ifdef RCT_NEW_ARCH_ENABLED
    screenTags = @[ @(topScreen.tag), @(belowTopScreen.tag) ];
  #else
    screenTags = @[ topScreen.reactTag, belowTopScreen.reactTag ];
  #endif // RCT_NEW_ARCH_ENABLED
  }
  [stackView startScreenTransition];
  return screenTags;
}

- (bool)innerUpdateTransition:(NSNumber *)stackTag progress:(double)progress
{
  RCTAssertMainQueue();
  RNSScreenStackView *stackView = [self getStackView:stackTag];
  if (stackView == nil || !isActiveTransition) {
    return false;
  }
  [stackView updateScreenTransition:progress];
  return true;
}

- (bool)innerFinishTransition:(NSNumber *)stackTag canceled:(bool)canceled
{
  RCTAssertMainQueue();
  RNSScreenStackView *stackView = [self getStackView:stackTag];
  if (stackView == nil || !isActiveTransition) {
    return false;
  }
  [stackView finishScreenTransition:canceled];
  isActiveTransition = false;
  return true;
}

- (RNSScreenStackView *)getStackView:(NSNumber *)stackTag
{
  RNSScreenStackView *view = [self getScreenStackView:stackTag];
  if (![view isKindOfClass:[RNSScreenStackView class]]) {
    RCTLogError(@"Invalid view type, expecting RNSScreenStackView, got: %@", view);
    return nil;
  }
  return view;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  [self installHostObject];
  return std::make_shared<facebook::react::NativeScreensModuleSpecJSI>(params);
}
#endif

- (void)installHostObject
{
  RCTBridge* bridge = [RCTBridge currentBridge];
  RCTCxxBridge* cxxBridge = (RCTCxxBridge*)bridge;
  if (cxxBridge != nil) {
    auto jsiRuntime = (jsi::Runtime*) cxxBridge.runtime;
    if (jsiRuntime != nil) {
      auto& runtime = *jsiRuntime;
      auto rnScreensModule = std::make_shared<RNScreensTurboModule>(self);
      auto rnScreensModuleHostObject = jsi::Object::createFromHostObject(runtime, rnScreensModule);
      runtime.global().setProperty(runtime, "RNScreensTurboModule", std::move(rnScreensModuleHostObject));
    }
  }
}

@end

NS_ASSUME_NONNULL_END
