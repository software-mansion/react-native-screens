#import <CoreGraphics/CoreGraphics.h>
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RNSSwipeableRegistry : NSObject <RCTBridgeModule>

+ (BOOL)hasOpenSwipeableContainingPoint:(CGPoint)point;

@end
