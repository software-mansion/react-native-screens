#import "RNSPeekableView.h"
#import "RNSScreenContainer.h"
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTUIManager.h>
#import "RNSScreen.h"
#import <React/RCTUIManagerUtils.h>


@implementation RNPreviewViewController {
  RNSPeekableWrapper *_wrapper;
}


- (instancetype)initWithWrapper:(RNSPeekableWrapper *) wrapper
{
  if (self = [super init]) {
    _wrapper = wrapper;
  }
  return self;
}

- (UIViewController *)previewingContext:(id<UIViewControllerPreviewing>)previewingContext viewControllerForLocation:(CGPoint)location
{
  if (_wrapper.onPeek) {
    _wrapper.onPeek(@{});
  }
  return _wrapper.previewController;
}

- (void)previewingContext:(id<UIViewControllerPreviewing>)  previewingContext
     commitViewController:(UIViewController *)viewControllerToCommit
{
  if (_wrapper.onPop) {
    _wrapper.onPop(@{});
  }
}

- (NSArray<id<UIPreviewActionItem>> *)previewActionItems {
  return _wrapper.actionsForPreviewing;
}

- (void)viewDidDisappear:(BOOL)animated {
  if (_wrapper.onDisappear) {
    _wrapper.onDisappear(@{});
  }
}

@end


@implementation RNSPeekableWrapper {
  RCTUIManager *_uiManager;
  UIView *_child;
}


- (instancetype)initWithUIManager:(RCTUIManager *)uiManager
{
  if (self = [super init]) {
    _uiManager = uiManager;
  }
  _previewController = [[RNPreviewViewController alloc] initWithWrapper:self];
  
  return self;
}

- (void)setOnPop:(RCTDirectEventBlock)onPop
{
  _onPop = onPop;
}

- (void)setOnPeek:(RCTDirectEventBlock)onPeek
{
  _onPeek = onPeek;
}

- (void)setOnDisappear:(RCTDirectEventBlock)onDisappear
{
  _onDisappear = onDisappear;
}

- (void)setOnAction:(RCTDirectEventBlock)onAction
{
  _onAction = onAction;
}

- (void)setPreviewActions:(NSArray *)actions
{
  _actionsForPreviewing = [self translateToUIPreviewActionStyles: actions];
}

- (NSArray<UIPreviewAction *> *) translateToUIPreviewActionStyles:(NSArray *)actions
{
  NSMutableArray *result = [[NSMutableArray alloc] init];
  for (NSDictionary *action in actions) {
    if ([action objectForKey:@"group"]) {
      NSArray<UIPreviewAction *> *innerActions = [self translateToUIPreviewActionStyles: action[@"group"]];
      UIPreviewActionGroup *previewAction = [UIPreviewActionGroup actionGroupWithTitle:action[@"caption"] style:UIPreviewActionStyleDefault actions:innerActions];
      [result addObject:previewAction];
    } else if ([@"selected" isEqualToString:action[@"type"]]) {
      UIPreviewAction *previewAction = [UIPreviewAction actionWithTitle:action[@"caption"] style:UIPreviewActionStyleSelected handler:^(UIPreviewAction * _Nonnull _, UIViewController * _Nonnull previewViewController) {
        _onAction(@{@"key": action[@"_key"]});
      }];
      [result addObject:previewAction];
    } else if ([@"destructive" isEqualToString:action[@"type"]]) {
      UIPreviewAction *previewAction = [UIPreviewAction actionWithTitle:action[@"caption"] style:UIPreviewActionStyleDestructive handler:^(UIPreviewAction * _Nonnull _, UIViewController * _Nonnull previewViewController) {
        _onAction(@{@"key": action[@"_key"]});
      }];
      [result addObject:previewAction];
    } else {
      UIPreviewAction *previewAction = [UIPreviewAction actionWithTitle:action[@"caption"] style:UIPreviewActionStyleDefault handler:^(UIPreviewAction * _Nonnull _, UIViewController * _Nonnull previewViewController) {
        _onAction(@{@"key": action[@"_key"]});
      }];
      [result addObject:previewAction];
    }
  }
  return result;
}

- (void)setScreenRef:(NSInteger)reactTag
{
  RNSScreenView *view = (RNSScreenView *)[_uiManager viewForReactTag:[NSNumber numberWithInteger: reactTag]];
  _screenController = view.controller;
  [view.controller registerForPreviewingWithDelegate:_previewController sourceView:_child];
  
}

- (void)setChildRef:(NSInteger)reactTag
{
  _child = [_uiManager viewForReactTag:[NSNumber numberWithInteger: reactTag]];
  _previewController.view = super.reactSubviews[0];
}

- (NSArray<UIView *> *)reactSubviews
{
  return nil;
}

- (void)invalidate
{
  _previewController.view = nil;
  _previewController = nil;
}

@end


@implementation RNSPeekableView

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(active, BOOL)
RCT_EXPORT_VIEW_PROPERTY(screenRef, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(childRef, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(previewActions, NSArray)
RCT_EXPORT_VIEW_PROPERTY(onPop, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPeek, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onAction, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDisappear, RCTDirectEventBlock);

- (UIView *)view
{
  return [[RNSPeekableWrapper alloc] initWithUIManager:self.bridge.uiManager];
}

@end
