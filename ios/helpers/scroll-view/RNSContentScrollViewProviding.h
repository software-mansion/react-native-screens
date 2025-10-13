@protocol RNSContentScrollViewProviding

/**
 * Finds content ScrollView within provider's hierarchy. The content ScrollView serves as a main interaction on the
 * given screen. Implementations may use `RNSScrollViewFinder` to continue the search however they see fit.
 */
- (nullable UIScrollView *)findContentScrollView;

@end
