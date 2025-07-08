NS_ASSUME_NONNULL_BEGIN

@protocol RNSDismissibleModalProtocol <NSObject>

// If NO is returned, the modal will not be dismissed when new modal is presented.
// Use it on your own responsibility, as it can lead to unexpected behavior.
- (BOOL)isDismissible;

@end

NS_ASSUME_NONNULL_END
