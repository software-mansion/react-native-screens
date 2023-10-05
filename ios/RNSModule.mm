#import "RNSModule.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import "RNSScreenStack.h"

@implementation RNSModule

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
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(startTransition : (nonnull NSNumber *)reactTag)
{
  RNSScreenStackView *view = [self getScreenStackView:reactTag];

  if (![view isKindOfClass:[RNSScreenStackView class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSScreenStackView, got: %@", view);
    return @(0);
  }

  dispatch_sync(dispatch_get_main_queue(), ^{
    [view startScreenTransition];
  });
  return @(1);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(updateTransition : (nonnull NSNumber *)reactTag progress : (double)progress)
{
  RNSScreenStackView *view = [self getScreenStackView:reactTag];

  if (![view isKindOfClass:[RNSScreenStackView class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSScreenStackView, got: %@", view);
    return @(0);
  }
  dispatch_sync(dispatch_get_main_queue(), ^{
    [view updateScreenTransition:progress];
  });

  return @(1);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(finishTransition : (nonnull NSNumber *)reactTag canceled : (BOOL)canceled)
{
  RNSScreenStackView *view = [self getScreenStackView:reactTag];

  if (![view isKindOfClass:[RNSScreenStackView class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSScreenStackView, got: %@", view);
    return @(0);
  }
  dispatch_sync(dispatch_get_main_queue(), ^{
    [view finishScreenTransition:canceled];
  });
  return @(1);
}

- (RNSScreenStackView *)getScreenStackView:(NSNumber *)reactTag
{
  __block RNSScreenStackView *view;
#ifdef RCT_NEW_ARCH_ENABLED
  dispatch_sync(dispatch_get_main_queue(), ^{
    view = [self.viewRegistry_DEPRECATED viewForReactTag:reactTag];
  });
#else
  dispatch_sync(dispatch_get_main_queue(), ^{
    view = [self.bridge.uiManager viewForReactTag:reactTag];
  });
#endif // RCT_NEW_ARCH_ENABLED
  return view;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeScreensModuleSpecJSI>(params);
}
#endif

@end
