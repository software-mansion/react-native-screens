@import React_RCTAppDelegate;

// Detox 20.45.1 decides whether the app runs the New Architecture by calling
// -[RCTAppDelegate newArchEnabled]. React Native 0.89 removed that method together with the
// legacy architecture; without it Detox takes its legacy path and crashes the app while the
// Detox framework loads. Putting the method back keeps Detox on the New Architecture path.
//
// This has to be Objective-C: Detox calls the implementation with a nil receiver, which the
// method thunk Swift emits in debug builds does not survive.
//
// Remove once the Detox release in use supports React Native 0.89.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-implementations"

@interface RCTAppDelegate (DetoxNewArchProbe)
@end

@implementation RCTAppDelegate (DetoxNewArchProbe)

- (BOOL)newArchEnabled
{
  return YES;
}

@end

#pragma clang diagnostic pop
