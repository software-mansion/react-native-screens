#import "RNSDeferredTransitionStart.h"
#import <React/RCTLog.h>

static constexpr NSTimeInterval RNSDeferredTransitionStartTimeout = 1.0;

@implementation RNSDeferredTransitionStart {
  __weak RNSScreenView *_screen;
  BOOL _started;
  BOOL _prepared;
  BOOL _releaseRequested;
  BOOL _released;
  BOOL _invalidated;
  BOOL _scheduled;
  BOOL _setupComplete;
}

- (instancetype)initWithScreen:(RNSScreenView *)screen animator:(RNSScreenStackAnimator *)animator
{
  if (self = [super init]) {
    _screen = screen;
    self.animationController = animator;
    screen.deferredTransitionStart = self;
  }
  return self;
}

- (void)startInteractiveTransition:(id<UIViewControllerContextTransitioning>)context
{
  [super startInteractiveTransition:context];
  _started = YES;
  [self schedulePreparation];
}

- (void)animationPrepared
{
  _prepared = YES;
  [self schedulePreparation];
}

- (void)schedulePreparation
{
  if (!_started || !_prepared || _scheduled || _invalidated) {
    return;
  }
  _scheduled = YES;
  // Finish UIKit's setup and the current mounting transaction before releasing.
  __weak auto weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    auto self = weakSelf;
    if (self == nil || self->_invalidated) {
      return;
    }
    [self updateInteractiveTransition:0];
    self->_setupComplete = YES;
    if (self->_releaseRequested || !self->_screen.transitionStartDeferred || self->_screen.isInvalidated) {
      [self releaseTransition];
      return;
    }
    dispatch_after(
        dispatch_time(DISPATCH_TIME_NOW, (int64_t)(RNSDeferredTransitionStartTimeout * NSEC_PER_SEC)),
        dispatch_get_main_queue(),
        ^{
          auto self = weakSelf;
          if (self != nil && !self->_released && !self->_invalidated) {
            RCTLogWarn(@"[RNScreens] Deferred transition was not released within one second. Starting the transition.");
            [self releaseTransition];
          }
        });
  });
}

- (void)releaseTransition
{
  _releaseRequested = YES;
  if (!_started || !_prepared || !_setupComplete || _released || _invalidated) {
    return;
  }
  _released = YES;
  if (_screen.deferredTransitionStart == self) {
    _screen.deferredTransitionStart = nil;
  }
  // Resumes both the property animator and UIKit's accompanying animations,
  // including the native progress probe. Completion remains owned by UIKit.
  [self finishInteractiveTransition];
}

- (void)invalidate
{
  _invalidated = YES;
  if (_screen.deferredTransitionStart == self) {
    _screen.deferredTransitionStart = nil;
  }
  self.animationController = nil;
}

@end
