#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol BarMenuContainer <NSObject>
- (void)updateMenu;
- (void)menuItemSelected:(NSString *)identifier;
- (BOOL)hasSelectedItem;
- (NSArray<NSString *> *)selectedItemIDs;
@end

NS_ASSUME_NONNULL_END
