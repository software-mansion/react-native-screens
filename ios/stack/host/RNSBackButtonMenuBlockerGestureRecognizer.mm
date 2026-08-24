#import "RNSBackButtonMenuBlockerGestureRecognizer.h"
#import <UIKit/UIGestureRecognizerSubclass.h>

@implementation RNSBackButtonMenuBlockerGestureRecognizer {
  NSUInteger _activeTouchCount;
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesBegan:touches withEvent:event];
  _activeTouchCount += touches.count;
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesEnded:touches withEvent:event];
  [self touchesFinished:touches];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesCancelled:touches withEvent:event];
  [self touchesFinished:touches];
}

- (void)touchesFinished:(NSSet<UITouch *> *)touches
{
  // Fail only once ALL tracked touches lifted. Failing on the first lift
  // would release the failure requirement mid-sequence, letting a remaining
  // finger complete the blocked gesture.
  _activeTouchCount -= MIN(_activeTouchCount, touches.count);
  if (_activeTouchCount == 0) {
    self.state = UIGestureRecognizerStateFailed;
  }
}

- (void)reset
{
  [super reset];
  _activeTouchCount = 0;
}

@end
