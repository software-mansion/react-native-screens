#import <Foundation/Foundation.h>
#import "RNSEnums.h"

@interface RNSSharedElementTransitionOptions : NSObject

@property (nonatomic, retain) NSString *from;
@property (nonatomic, retain) NSString *to;
@property (nonatomic) NSTimeInterval delay;
@property (nonatomic) NSTimeInterval duration;
@property (nonatomic) CGFloat damping;
@property (nonatomic) CGFloat initialVelocity;
@property (nonatomic) RNSSharedElementTransitionEasing easing;
@property (nonatomic) BOOL showFromElementDuringAnimation;
@property (nonatomic) BOOL showToElementDuringAnimation;
@property (nonatomic) RNSSharedElementTransitionResizeMode resizeMode;
@property (nonatomic) RNSSharedElementTransitionAlign align;

@end
