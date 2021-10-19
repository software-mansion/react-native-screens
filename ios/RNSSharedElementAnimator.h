@protocol RNSSEA <NSObject>

- (void)reanimatedMockTransitionWithConverterView:(UIView *)converter
                                           fromID:(NSNumber *)fromID
                                             toID:(NSNumber *)toID
                                          rootTag:(NSNumber *)rootTag;

@end

@interface RNSSharedElementAnimator : NSObject

+ (void)setDelegate:(NSObject<RNSSEA> *)delegate;
+ (NSObject<RNSSEA> *)getDelegate;
+ (NSMutableArray<NSArray *> *)prepareSharedElementsArrayForVC:(UIViewController *)vc closing:(BOOL)closing;

@end
