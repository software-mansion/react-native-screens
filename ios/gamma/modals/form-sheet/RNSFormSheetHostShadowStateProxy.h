#import <UIKit/UIKit.h>

#ifdef __cplusplus
#import <React/RCTComponentViewProtocol.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetHostShadowStateProxy : NSObject

#ifdef __cplusplus
- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState;
#endif

- (void)updateShadowStateWithBounds:(CGRect)bounds origin:(CGPoint)origin;
- (void)resetShadowState;

@end

NS_ASSUME_NONNULL_END
