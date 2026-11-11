#import "RNSReactBaseView.h"

#import "RNSReactDiagnosticHandlers.h"

@implementation RNSReactBaseView

+ (void)initialize
{
  // Runs once per subclass that does not override it, hence `dispatch_once`.
  // Every component view subclasses this class, so the handlers are in place before any of them
  // creates a `core` object.
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    RNSInstallReactDiagnosticHandlers();
  });
}

@end
