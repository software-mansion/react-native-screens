#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

// TODO: investigate objc - swift interop and deduplicate this code
// This class needs to be compatible with the RNSOrientationProvidingSwift.
@protocol RNSOrientationProviding

- (RNSOrientation)evaluateOrientation;

@end

NS_ASSUME_NONNULL_END
