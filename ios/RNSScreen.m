#import "RNSScreen.h"
#import "RNSScreenContainer.h"
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@interface RNSScreen : UIViewController<UIViewControllerPreviewingDelegate>

- (instancetype)initWithView:(UIView *)view;
- (void)notifyFinishTransitioning;
- (void)setPreview:(UIView*)preview;
- (void)setActions:(NSArray *)actions;
@property (nonatomic, copy) RCTDirectEventBlock onPop;
@property (nonatomic, copy) RCTDirectEventBlock onAction;

@end

@interface RNPreviewViewController : UIViewController

- (instancetype)initWithPreviewingActions:(NSArray<id<UIPreviewActionItem>> *)actions;

@end


@implementation RNPreviewViewController {
  NSArray<id<UIPreviewActionItem>> *_previewingActions;
}

- (instancetype)initWithPreviewingActions:(NSArray<id<UIPreviewActionItem>> *)actions
{
  if (self = [super init]) {
    _previewingActions = actions;
  }
  return self;
}

- (NSArray<id<UIPreviewActionItem>> *)previewActionItems {
  return _previewingActions;
}

@end

@implementation RNSScreenView {
  RNSScreen *_controller;
  RNSScreen *_previewController;
  RCTUIManager *_uiManager;
}

@synthesize controller = _controller;

- (instancetype)initWithUIManager:(RCTUIManager *)uiManager
{
  if (self = [super init]) {
    _uiManager = uiManager;
    _controller = [[RNSScreen alloc] initWithView:self];
    _controller.modalPresentationStyle = UIModalPresentationOverCurrentContext;
  }
  return self;
}

- (void)setActive:(BOOL)active
{
  if (active != _active) {
    _active = active;
    [_reactSuperview markChildUpdated];
  }
}

- (void)setPointerEvents:(RCTPointerEvents)pointerEvents
{
  // pointer events settings are managed by the parent screen container, we ignore any attempt
  // of setting that via React props
}

- (UIView *)reactSuperview
{
  return _reactSuperview;
}

- (void)invalidate
{
  _controller.view = nil;
  _controller = nil;
}

- (void)notifyFinishTransitioning
{
  [_controller notifyFinishTransitioning];
}

// peek and pop

- (void)setOnPop:(RCTDirectEventBlock)onPop
{
  [_controller setOnPop:onPop];
}

- (void)setOnAction:(RCTDirectEventBlock)onAction
{
  [_controller setOnAction:onAction];
}

- (void)setPreviewActions:(NSArray *)actions
{
  [_controller setActions:actions];
  
}
- (void)setPreviewView:(NSInteger)reactTag
{
  [_controller registerForPreviewingWithDelegate:_controller sourceView:self];
  RNSScreenView *view = (RNSScreenView *)[_uiManager viewForReactTag:[NSNumber numberWithInteger: reactTag]];
  [_controller setPreview:view];
}

@end

@implementation RNSScreen {
  __weak UIView *_view;
  __weak id _previousFirstResponder;
  __weak UIView *_preview;
  NSArray *_actionsForPreviewing;
}

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    _view = view;
  }
  return self;
}

- (id)findFirstResponder:(UIView*)parent
{
  if (parent.isFirstResponder) {
    return parent;
  }
  for (UIView *subView in parent.subviews) {
    id responder = [self findFirstResponder:subView];
    if (responder != nil) {
      return responder;
    }
  }
  return nil;
}

- (void)willMoveToParentViewController:(UIViewController *)parent
{
  if (parent == nil) {
    id responder = [self findFirstResponder:self.view];
    if (responder != nil) {
      _previousFirstResponder = responder;
    }
  }
}

- (void)notifyFinishTransitioning
{
  [_previousFirstResponder becomeFirstResponder];
  _previousFirstResponder = nil;
}

- (void)loadView
{
  self.view = _view;
  _view = nil;
}

// peek and pop

- (void)setPreview:(UIView *)preview
{
  _preview = preview;
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

- (void)setActions:(NSArray *)actions
{
  _actionsForPreviewing = [self translateToUIPreviewActionStyles: actions];
}


- (UIViewController *)previewingContext:(id<UIViewControllerPreviewing>)previewingContext viewControllerForLocation:(CGPoint)location
{
  UIViewController *controller = [[RNPreviewViewController alloc] initWithPreviewingActions:_actionsForPreviewing];
  [controller.view addSubview:_preview];
  return  controller;
}

- (void)previewingContext:(id<UIViewControllerPreviewing>)previewingContext
     commitViewController:(UIViewController *)viewControllerToCommit
{
  if (_onPop) {
    _onPop(@{});
  }
}

@end



@implementation RNSScreenManager


RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(active, BOOL)
RCT_EXPORT_VIEW_PROPERTY(previewView, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(previewActions, NSArray)
RCT_EXPORT_VIEW_PROPERTY(onPop, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onAction, RCTDirectEventBlock);

- (UIView *)view
{
  
  return [[RNSScreenView alloc] initWithUIManager:self.bridge.uiManager];
}

@end
