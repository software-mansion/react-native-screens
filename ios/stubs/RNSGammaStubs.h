#import <Foundation/Foundation.h>

// These symbols are a stubs for components defined in Gamma project implementation.
// We need these, because we can not really trick codegen to generate code only for components
// that satisfy some condition (e.g. when env var is defined). If these symbols are missing,
// the application will fail in runtime when RN attempts to create components class registry.

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackHostComponentView : NSObject
@end

@interface RNSStackScreenComponentView : NSObject
@end

@interface RNSSplitViewHostComponentView : NSObject
@end

@interface RNSSplitViewScreenComponentView : NSObject
@end

NS_ASSUME_NONNULL_END
