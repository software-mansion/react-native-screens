#import "RNSStackAnimationMotionBinding.h"
#import "RNSAssert.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationMotionTimeline.h"
#import "RNSStackAnimationTiming.h"
#import "RNSStackAnimationTrack.h"

#import <algorithm>
#import <vector>

// UIKit joins the keyframes with straight lines, so the curve is exact only at the samples. One sample per frame of a
// 120 Hz display, the fastest an iPhone refreshes: a coarser step shows short tracks as a polyline, a finer one changes
// nothing a frame can show.
// https://developer.apple.com/documentation/quartzcore/optimizing-promotion-refresh-rates-for-iphone-13-pro-and-ipad-pro
static const double kRNSStackKeyframeStepMs = 8;

@implementation RNSStackAnimationMotionBinding {
  RNSStackAnimationMotionTimeline *_motion;
  UIView *_view;
  CGSize _containerSize;
  BOOL _animatesTransform;
  BOOL _animatesAlpha;
}

- (instancetype)initWithMotion:(RNSStackAnimationMotionTimeline *)motion
                          view:(UIView *)view
                 containerSize:(CGSize)containerSize
{
  if (self = [super init]) {
    _motion = motion;
    _view = view;
    _containerSize = containerSize;
    for (RNSStackAnimationTrack *track in motion.tracks) {
      if ([track isKindOfClass:RNSStackAnimationTranslateTrack.class]) {
        _animatesTransform = YES;
      } else if ([track isKindOfClass:RNSStackAnimationPropertyTrack.class]) {
        switch (static_cast<RNSStackAnimationPropertyTrack *>(track).viewProperty) {
          case RNSStackAnimationViewPropertyOpacity:
            _animatesAlpha = YES;
            break;
        }
      }
    }
  }
  return self;
}

- (void)addKeyframesForDurationMs:(NSInteger)durationMs
{
  RNSAssert(_motion.durationMs <= durationMs, @"[RNScreens] A motion cannot outlast its transition.");
  if (_motion.tracks.count == 0 || durationMs == 0) {
    return;
  }
  // The property animator starts a keyframe animation from the presentation value of a view that was displayed
  // before, such as the incoming screen of a pop, not from the model. Time 0 is a keyframe of its own so that the
  // first segment starts there.
  [UIView addKeyframeWithRelativeStartTime:0
                          relativeDuration:0
                                animations:^{
                                  [self applyAtMs:0];
                                }];

  // Every track start and end is a sample too, so no track starts or ends between two samples.
  std::vector<double> times;
  for (double timeMs = 0; timeMs < _motion.durationMs; timeMs += kRNSStackKeyframeStepMs) {
    times.push_back(timeMs);
  }
  times.push_back(_motion.durationMs);
  for (RNSStackAnimationTrack *track in _motion.tracks) {
    times.push_back(track.timing.startMs);
    times.push_back(track.timing.endMs);
  }
  std::sort(times.begin(), times.end());
  times.erase(std::unique(times.begin(), times.end()), times.end());

  for (size_t i = 1; i < times.size(); i++) {
    double endMs = times[i];
    double relativeStart = times[i - 1] / durationMs;
    // Derived from the clamped end, so that rounding never puts the end of a keyframe past the animation's.
    double relativeEnd = std::min(endMs / durationMs, 1.0);
    [UIView addKeyframeWithRelativeStartTime:relativeStart
                            relativeDuration:relativeEnd - relativeStart
                                  animations:^{
                                    [self applyAtMs:endMs];
                                  }];
  }
}

- (void)applyAtMs:(double)timeMs
{
  CGFloat translationX = 0;
  CGFloat translationY = 0;
  CGFloat alpha = 1;
  for (RNSStackAnimationTrack *track in _motion.tracks) {
    CGFloat progress = [track.timing progressAtMs:timeMs];
    if ([track isKindOfClass:RNSStackAnimationTranslateTrack.class]) {
      auto translate = static_cast<RNSStackAnimationTranslateTrack *>(track);
      CGFloat from = [self pointsForLength:translate.from axis:translate.axis];
      CGFloat to = [self pointsForLength:translate.to axis:translate.axis];
      CGFloat value = from + (to - from) * progress;
      if (translate.axis == RNSStackAnimationAxisX) {
        translationX += value;
      } else {
        translationY += value;
      }
    } else if ([track isKindOfClass:RNSStackAnimationPropertyTrack.class]) {
      auto propertyTrack = static_cast<RNSStackAnimationPropertyTrack *>(track);
      CGFloat value = propertyTrack.from + (propertyTrack.to - propertyTrack.from) * progress;
      switch (propertyTrack.viewProperty) {
        case RNSStackAnimationViewPropertyOpacity:
          alpha = value;
          break;
      }
    }
  }
  if (_animatesTransform) {
    _view.transform = CGAffineTransformMakeTranslation(translationX, translationY);
  }
  if (_animatesAlpha) {
    _view.alpha = alpha;
  }
}

- (void)restore
{
  if (_animatesTransform) {
    _view.transform = CGAffineTransformIdentity;
  }
  if (_animatesAlpha) {
    _view.alpha = 1;
  }
}

- (CGFloat)pointsForLength:(RNSStackAnimationLength *)length axis:(RNSStackAnimationAxis)axis
{
  if (length.unit == RNSStackAnimationLengthUnitPoints) {
    return length.value;
  }
  return length.value * (axis == RNSStackAnimationAxisX ? _containerSize.width : _containerSize.height);
}

@end
