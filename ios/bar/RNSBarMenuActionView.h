#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

#import "BarMenuContainer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSBarMenuActionView : RCTViewComponentView

@property (nonatomic, weak, nullable) id<BarMenuContainer> menuParent;
@property (nonatomic, copy, nullable) NSString *identifier;
@property (nonatomic, copy, nullable) NSString *title;
@property (nonatomic, copy, nullable) NSString *subtitle;
@property (nonatomic, copy, nullable) NSString *icon;
@property (nonatomic, assign) BOOL disabled;
@property (nonatomic, assign) BOOL destructive;
@property (nonatomic, assign) BOOL keepsMenuPresented;
@property (nonatomic, copy, nullable) NSString *discoverabilityLabel;
@property (nonatomic, assign) UIMenuElementState state;

- (void)emitPress;
- (UIAction *)uiAction;
- (void)applySelectionState:(UIMenuElementState)state;
- (void)clearSelectionState;
- (UIMenuElementState)effectiveState;

@end

NS_ASSUME_NONNULL_END
