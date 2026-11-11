#pragma once

#import <Foundation/Foundation.h>

/**
 * Installs `RNSLog` and `RNSAssert` handlers that forward to `RCTLog*` and `RCTAssert`,
 * so `core` diagnostics show up in LogBox / RedBox like React Native's own.
 */
FOUNDATION_EXTERN void RNSInstallReactDiagnosticHandlers(void);
