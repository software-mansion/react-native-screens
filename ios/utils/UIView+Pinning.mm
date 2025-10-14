#import "UIView+Pinning.h"

@implementation UIView (Pinning)

- (void)pinToView:(UIView *)view
        fromEdges:(UIRectEdge)edges
       withHeight:(CGFloat *)height
      constraints:(void (^)(
                      NSLayoutConstraint *top,
                      NSLayoutConstraint *bottom,
                      NSLayoutConstraint *left,
                      NSLayoutConstraint *right,
                      NSLayoutConstraint *heightConstraint))block
{
  self.translatesAutoresizingMaskIntoConstraints = NO;

  NSLayoutConstraint *topConstraint = nil;
  NSLayoutConstraint *bottomConstraint = nil;
  NSLayoutConstraint *leftConstraint = nil;
  NSLayoutConstraint *rightConstraint = nil;
  NSLayoutConstraint *heightConstraint = nil;

  if (edges & UIRectEdgeTop) {
    topConstraint = [self.topAnchor constraintEqualToAnchor:view.topAnchor];
    topConstraint.active = YES;
  }

  if (edges & UIRectEdgeBottom) {
    bottomConstraint = [self.bottomAnchor constraintEqualToAnchor:view.bottomAnchor];
    bottomConstraint.active = YES;
  }

  if (edges & UIRectEdgeLeft) {
    leftConstraint = [self.leadingAnchor constraintEqualToAnchor:view.leadingAnchor];
    leftConstraint.active = YES;
  }

  if (edges & UIRectEdgeRight) {
    rightConstraint = [self.trailingAnchor constraintEqualToAnchor:view.trailingAnchor];
    rightConstraint.active = YES;
  }

  if (height != nil) {
    heightConstraint = [self.heightAnchor constraintEqualToConstant:*height];
    heightConstraint.active = YES;
  }

  if (block) {
    block(topConstraint, bottomConstraint, leftConstraint, rightConstraint, heightConstraint);
  }
}

- (void)unpin
{
  self.translatesAutoresizingMaskIntoConstraints = YES;
  [self removeConstraints:self.constraints];
}

@end
