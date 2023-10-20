#import "RNSModule.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import "RNSScreenStack.h"

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
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(startTransition:(nonnull NSNumber *)stackTag)
{
  return [self _startTransition:stackTag];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(updateTransition:(nonnull NSNumber *)stackTag progress:(double)progress)
{
  return @([self _updateTransition:stackTag progress:progress]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(finishTransition:(nonnull NSNumber *)stackTag canceled:(bool)canceled)
{
  return @([self _finishTransition:stackTag canceled:canceled]);
}

- (RNSScreenStackView *)getScreenStackView:(NSNumber *)reactTag
{
  __block RNSScreenStackView *view;
#ifdef RCT_NEW_ARCH_ENABLED
  dispatch_sync(dispatch_get_main_queue(), ^{
    view = [self.viewRegistry_DEPRECATED viewForReactTag:reactTag];
  });
#else
  if ([[NSThread currentThread] isMainThread]) {
    view = [self.bridge.uiManager viewForReactTag:reactTag];
  } else {
    dispatch_sync(dispatch_get_main_queue(), ^{
      view = [self.bridge.uiManager viewForReactTag:reactTag];
    });
  }
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

- (nonnull NSArray<NSNumber *> *)_startTransition:(nonnull NSNumber *)stackTag
{  
  RNSScreenStackView *stackView = [self getStackView:stackTag];
  if (stackView == nil || isActiveTransition) {
    return @[];
  }
  
  if ([[NSThread currentThread] isMainThread]) {
    [stackView startScreenTransition];
  } else {
    dispatch_sync(dispatch_get_main_queue(), ^{
      [stackView startScreenTransition];
    });
  }

  auto screens = stackView.reactSubviews;
  unsigned long screenCount = [screens count];
  if (screenCount > 1) {
    NSNumber *topScreen = screens[screenCount - 1].reactTag;
    NSNumber *belowTopScreen = screens[screenCount - 2].reactTag;
    screens[screenCount - 2].transform = CGAffineTransformMake(1, 0, 0, 1, 0, 0);
    isActiveTransition = true;
    return @[topScreen, belowTopScreen];
  }
  return @[];
}

- (bool)_updateTransition:(nonnull NSNumber *)stackTag progress:(double)progress
{
  RNSScreenStackView *stackView = [self getStackView:stackTag];
  if (stackView == nil || !isActiveTransition) {
    return false;
  }
  
  if ([[NSThread currentThread] isMainThread]) {
    [stackView updateScreenTransition:progress];
  } else {
    dispatch_sync(dispatch_get_main_queue(), ^{
      [stackView updateScreenTransition:progress];
    });
  }
  return true;
}

- (bool)_finishTransition:(nonnull NSNumber *)stackTag canceled:(bool)canceled
{
  RNSScreenStackView *stackView = [self getStackView:stackTag];
  if (stackView == nil || !isActiveTransition) {
    return false;
  }
  
  if ([[NSThread currentThread] isMainThread]) {
    [stackView finishScreenTransition:canceled];
  } else {
    dispatch_sync(dispatch_get_main_queue(), ^{
      [stackView finishScreenTransition:canceled];
    });
  }
  isActiveTransition = false;
  return true;
}

- (RNSScreenStackView *)getStackView:(nonnull NSNumber *)stackTag
{
  RNSScreenStackView *view = [self getScreenStackView:stackTag];
  if (![view isKindOfClass:[RNSScreenStackView class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSScreenStackView, got: %@", view);
    return nil;
  }
  return view;
}

@end
