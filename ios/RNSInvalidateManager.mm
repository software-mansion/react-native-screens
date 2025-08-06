#import "RNSInvalidateManager.h"

@interface RNSInvalidateManager ()
@property (nonatomic, strong) NSMutableSet<UIView<RNSInvalidateControllerProtocol> *> *invalidViews;
@end

@implementation RNSInvalidateManager

+ (instancetype)sharedManager {
    static RNSInvalidateManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RNSInvalidateManager alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init {
    if (self = [super init]) {
        _invalidViews = [NSMutableSet set];
    }
    return self;
}

- (void)markForInvalidation:(UIView<RNSInvalidateControllerProtocol> *)view {
    [_invalidViews addObject:view];
}

- (void)flushInvalidViews {
    for (id<RNSInvalidateControllerProtocol> view in _invalidViews) {
        [view invalidateController];
    }
    [_invalidViews removeAllObjects];
}

@end
