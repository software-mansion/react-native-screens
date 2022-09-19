@interface SharedViewConfig : NSObject
;

- (void)setView:(UIView *)view;
- (UIView *)getView;

@property NSNumber *viewTag;
@property BOOL toRemove;

@end

@interface SharedElementConfig : NSObject
;

@property UIView *fromView;
@property UIView *toView;
@property UIView *fromContainer;
@property int fromViewIndex;
@property CGRect fromViewFrame;

- (instancetype)initWithFromView:(UIView *)fromView
                          toView:(UIView *)toView
                   fromContainer:(UIView *)fromContainer
                   fromViewFrame:(CGRect)fromViewFrame;

@end

@protocol RNSSharedElementTransitionsDelegate <NSObject>

@property NSMutableDictionary<NSString *, NSMutableArray<SharedViewConfig *> *> *sharedTransitionsItems;
@property NSMutableArray<NSString *> *sharedElementsIterationOrder;

- (void)afterPreparingCallback;
- (void)runTransitionWithConverterView:(UIView *)converter
                              fromView:(UIView *)fromView
                     fromViewConverter:(UIView *)startingViewConverter
                                toView:(UIView *)toView
                       toViewConverter:(UIView *)toViewConverter
                        transitionType:(NSString *)transitionType;
- (void)notifyAboutViewDidDisappear:(UIView *)screeen;
- (void)makeSnapshot:(UIView *)view withViewController:(UIView *)viewController;

@end

@interface RNSSharedElementAnimator : NSObject

+ (void)setDelegate:(NSObject<RNSSharedElementTransitionsDelegate> *)delegate;
+ (NSObject<RNSSharedElementTransitionsDelegate> *)getDelegate;
+ (NSMutableArray<SharedElementConfig *> *)
    getSharedElementsForCurrentTransition:(UIViewController *)currentViewController
                     targetViewController:(UIViewController *)targetViewController;
+ (void)notifyAboutViewDidDisappear:(UIView *)screeen;

@end
