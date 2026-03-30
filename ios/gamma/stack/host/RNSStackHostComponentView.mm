#import "RNSStackHostComponentView.h"

#import <React/RCTConversions.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSLog.h"

#import "RNSStackScreenComponentView.h"
#import "Swift-Bridging.h"

namespace react = facebook::react;

static void dumpStackHostSubviewsState(NSArray<RNSStackScreenComponentView *> *reactSubviews);

@implementation RNSStackHostComponentView {
  RNSStackController *_Nonnull _controller;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _controller = [[RNSStackController alloc] initWithStackHostComponentView:self];
  }
  return self;
}

- (void)didMoveToWindow
{
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil while attaching to window");
  [self reactAddControllerToClosestParent:_controller];
}

- (void)reactAddControllerToClosestParent:(UIViewController *)controller
{
  if (!controller.parentViewController) {
    UIView *parentView = (UIView *)self.reactSuperview;
    while (parentView) {
      if (parentView.reactViewController) {
        [parentView.reactViewController addChildViewController:controller];
        [self addSubview:controller.view];
        [controller didMoveToParentViewController:parentView.reactViewController];
        break;
      }
      parentView = (UIView *)parentView.reactSuperview;
    }
    return;
  }
}

- (nonnull NSMutableArray<RNSStackScreenComponentView *> *)reactSubviews
{
  return (NSMutableArray<RNSStackScreenComponentView *> *)[super reactSubviews];
}

- (nonnull RNSStackController *)stackController
{
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil");
  return _controller;
}

// MARK: - RNSBaseNavigatorComponentView abstract override

- (nonnull RNSBaseNavigatorController *)navigatorController
{
  return _controller;
}

// MARK: - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSStackScreenComponentView.class],
      @"[RNScreens] Attempt to mount child of unsupported type: %@, expected %@",
      childComponentView.class,
      RNSStackScreenComponentView.class);

  auto *childScreen = static_cast<RNSStackScreenComponentView *>(childComponentView);
  childScreen.stackHost = self;
  [[self reactSubviews] insertObject:childScreen atIndex:index];
  [self markSubviewsModifiedInCurrentTransaction];

  RNSLog(
      @"StackHost [%ld] mount: StackScreen [%ld] (%@) at %ld",
      self.tag,
      childComponentView.tag,
      childScreen.screenKey,
      index);
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSStackScreenComponentView.class],
      @"[RNScreens] Attempt to unmount child of unsupported type: %@, expected %@",
      childComponentView.class,
      RNSStackScreenComponentView.class);

  auto *childScreen = static_cast<RNSStackScreenComponentView *>(childComponentView);
  [[self reactSubviews] removeObject:childScreen];
  childScreen.stackHost = nil;
  [self markSubviewsModifiedInCurrentTransaction];

  RNSLog(
      @"StackHost [%ld] unmount: StackScreen [%ld] (%@) at %ld",
      self.tag,
      childComponentView.tag,
      childScreen.screenKey,
      index);
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSStackHostComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

// MARK: - RNSBaseNavigatorComponentView hook (debug dump)

- (void)navigatorDidMountTransaction
{
  if (self.hadSubviewsModifiedInCurrentTransaction) {
    dumpStackHostSubviewsState([self reactSubviews]);
  }
}

@end

Class<RCTComponentViewProtocol> RNSStackHostCls(void)
{
  return RNSStackHostComponentView.class;
}

static void dumpStackHostSubviewsState(NSArray<RNSStackScreenComponentView *> *reactSubviews)
{
  NSMutableArray<NSString *> *descs = [[NSMutableArray alloc] initWithCapacity:reactSubviews.count];
  for (RNSStackScreenComponentView *screen in reactSubviews) {
    [descs addObject:[NSString stringWithFormat:@"StackScreen [%ld] %@ activityMode=%d",
                                                screen.tag,
                                                screen.screenKey,
                                                screen.activityMode]];
  }
  RNSLog(@"%@", descs);
}
