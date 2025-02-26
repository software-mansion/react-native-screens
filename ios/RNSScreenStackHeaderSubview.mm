#import "RNSScreenStackHeaderSubview.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSScreenStackHeaderConfig.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#endif // RCT_NEW_ARCH_ENABLED

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@interface RCTBridge (Private)
+ (RCTBridge *)currentBridge;
@end

@implementation RNSScreenStackHeaderSubview

#pragma mark - Common

- (nullable RNSScreenStackHeaderConfig *)getHeaderConfig
{
  RNSScreenStackHeaderConfig *headerConfig = (RNSScreenStackHeaderConfig *_Nullable)self.reactSuperview;
#ifndef NDEBUG
  if (headerConfig != nil && ![headerConfig isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
    RCTLogError(@"[RNScreens] Invalid view type, expecting RNSScreenStackHeaderConfig, got: %@", headerConfig);
    return nil;
  }
#endif
  return headerConfig;
}

// We're forcing the navigation controller's view to re-layout
// see: https://github.com/software-mansion/react-native-screens/pull/2385
- (void)layoutNavigationBarIfNeeded
{
  RNSScreenStackHeaderConfig *headerConfig = [self getHeaderConfig];
  UINavigationController *navctr = headerConfig.screenView.reactViewController.navigationController;
  [navctr.navigationBar layoutIfNeeded];
}

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - Fabric specific

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSScreenStackHeaderSubviewProps>();
    _props = defaultProps;
  }

  return self;
}

#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
  [super prepareForRecycle];
}

- (void)updateProps:(react::Props::Shared const &)props oldProps:(react::Props::Shared const &)oldProps
{
  const auto &newHeaderSubviewProps = *std::static_pointer_cast<const react::RNSScreenStackHeaderSubviewProps>(props);

  [self setType:[RNSConvert RNSScreenStackHeaderSubviewTypeFromCppEquivalent:newHeaderSubviewProps.type]];
  [super updateProps:props oldProps:oldProps];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenStackHeaderSubviewComponentDescriptor>();
}

RNS_IGNORE_SUPER_CALL_BEGIN
// System layouts the subviews.
- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  CGRect frame = RCTCGRectFromRect(layoutMetrics.frame);
  // CALayer will crash if we pass NaN or Inf values.
  // It's unclear how to detect this case on cross-platform manner holistically, so we have to do it on the mounting
  // layer as well. NaN/Inf is a kinda valid result of some math operations. Even if we can (and should) detect (and
  // report early) incorrect (NaN and Inf) values which come from JavaScript side, we sometimes cannot backtrace the
  // sources of a calculation that produced an incorrect/useless result.
  if (!std::isfinite(frame.size.width) || !std::isfinite(frame.size.height)) {
    RCTLogWarn(
        @"-[UIView(ComponentViewProtocol) updateLayoutMetrics:oldLayoutMetrics:]: Received invalid layout metrics (%@) for a view (%@).",
        NSStringFromCGRect(frame),
        self);
  } else {
    self.bounds = CGRect{CGPointZero, frame.size};
    [self layoutNavigationBarIfNeeded];
  }
}
RNS_IGNORE_SUPER_CALL_BEGIN

+ (BOOL)shouldBeRecycled
{
  return NO;
}

#else
#pragma mark - Paper specific

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
  }
  return self;
}

- (void)reactSetFrame:(CGRect)frame
{
  // Block any attempt to set coordinates on RNSScreenStackHeaderSubview. This
  // makes UINavigationBar the only one to control the position of header content.
  [super reactSetFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
  [self layoutNavigationBarIfNeeded];
}

#endif // RCT_NEW_ARCH_ENABLED

- (RCTBridge *)bridge
{
#ifdef RCT_NEW_ARCH_ENABLED
  return [RCTBridge currentBridge];
#else
  return _bridge;
#endif // RCT_NEW_ARCH_ENABLED
}

@end

@implementation RNSScreenStackHeaderSubviewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(type, RNSScreenStackHeaderSubviewType)

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
  return [[RNSScreenStackHeaderSubview alloc] initWithBridge:self.bridge];
}
#endif

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSScreenStackHeaderSubviewCls(void)
{
  return RNSScreenStackHeaderSubview.class;
}
#endif

@implementation RCTConvert (RNSScreenStackHeaderSubview)

RCT_ENUM_CONVERTER(
    RNSScreenStackHeaderSubviewType,
    (@{
      @"back" : @(RNSScreenStackHeaderSubviewTypeBackButton),
      @"left" : @(RNSScreenStackHeaderSubviewTypeLeft),
      @"right" : @(RNSScreenStackHeaderSubviewTypeRight),
      @"title" : @(RNSScreenStackHeaderSubviewTypeTitle),
      @"center" : @(RNSScreenStackHeaderSubviewTypeCenter),
      @"searchBar" : @(RNSScreenStackHeaderSubviewTypeSearchBar),
    }),
    RNSScreenStackHeaderSubviewTypeTitle,
    integerValue)

@end
