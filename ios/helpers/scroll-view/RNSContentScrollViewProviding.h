@protocol RNSContentScrollViewProviding
/**
 * Finds content ScrollView within provider's hierarchy. The content ScrollView serves as a main interaction on the
 * given screen. Implementations should use `RNSScrollViewFinder.findContentScrollViewWithDelegatingToProvider` to
 * continue continue the search when no more custom logic is necessary (e.g Stack determining the topmost screen (custom
 * part) and forwarding the call directly to its view (going back to regular search)).
 */
- (nullable UIScrollView *)findContentScrollView;
@end
