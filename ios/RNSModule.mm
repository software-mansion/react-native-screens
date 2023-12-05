#import "RNSModule.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import "RNSScreenStack.h"

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

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(startTransition : (NSNumber *)stackTag)
{
  return [self _startTransition:stackTag];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(updateTransition : (NSNumber *)stackTag progress : (double)progress)
{
  return @([self _updateTransition:stackTag progress:progress]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(finishTransition : (NSNumber *)stackTag canceled : (BOOL)canceled)
{
  return @([self _finishTransition:stackTag canceled:canceled]);
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

- (NSArray<NSNumber *> *)_startTransition:(NSNumber *)stackTag
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
    NSNumber *topScreen = screens[screenCount - 1].view.reactTag;
    NSNumber *belowTopScreen = screens[screenCount - 2].view.reactTag;
    screens[screenCount - 2].view.transform = CGAffineTransformMake(1, 0, 0, 1, 0, 0);
    isActiveTransition = true;
    screenTags = @[ topScreen, belowTopScreen ];
  }
  [stackView startScreenTransition];
  return screenTags;
}

- (bool)_updateTransition:(NSNumber *)stackTag progress:(double)progress
{
  RCTAssertMainQueue();
  RNSScreenStackView *stackView = [self getStackView:stackTag];
  if (stackView == nil || !isActiveTransition) {
    return false;
  }
  [stackView updateScreenTransition:progress];
  return true;
}

- (bool)_finishTransition:(NSNumber *)stackTag canceled:(bool)canceled
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
  return std::make_shared<facebook::react::NativeScreensModuleSpecJSI>(params);
}
#endif

@end

NS_ASSUME_NONNULL_END
