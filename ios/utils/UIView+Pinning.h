#import <UIKit/UIKit.h>

@interface UIView (Pinning)

- (void)pinToView:(UIView *_Nullable)view
        fromEdges:(UIRectEdge)edges
       withHeight:(nullable CGFloat *)height
      constraints:(void (^_Nullable)(
                      NSLayoutConstraint *_Nullable top,
                      NSLayoutConstraint *_Nullable bottom,
                      NSLayoutConstraint *_Nullable left,
                      NSLayoutConstraint *_Nullable right,
                      NSLayoutConstraint *_Nullable heightConstraint))block;

- (void)unpin;

@end
