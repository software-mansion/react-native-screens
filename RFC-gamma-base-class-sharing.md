# RFC: Base Class Sharing for Gamma Stack and Split Navigator Components

---

## Summary

Extract a shared base class hierarchy for the gamma Stack and Split navigator components to eliminate structural duplication between their screen controllers, screen component views, navigator controllers, and navigator component views.

---

## Motivation

The gamma architecture introduced two separate navigator implementations: **Stack** (`RNSStackHost` + `RNSStackScreen`) and **Split** (`RNSSplitNavigator` + `RNSSplitScreen`). As Split was built after Stack, it reproduced several non-trivial patterns verbatim:

| Pattern | Stack | Split |
|---|---|---|
| Screen lifecycle event emission | `RNSStackScreenController` `viewWillAppear` etc. | `RNSSplitScreenController` identical overrides |
| Native dismiss detection | `didMove(toParent:)` logic | Same logic, different emitter call |
| Navigator mounting transaction deferral | `RNSStackHostComponentView` private transaction observation | `RNSSplitNavigatorComponentView` identical block |
| `updateChildViewControllers()` | `RNSStackController` filters `isAttached`, maps to `screenViewController` | `RNSSplitNavigatorController` identical logic |
| `reactSubviews` storage | `_reactSubviews` ivar + init + accessor in `RNSStackHostComponentView` | Identical in `RNSSplitNavigatorComponentView` |

Adding features (e.g. `preventNativeDismiss`) to the screen level currently requires touching both components independently. This RFC consolidates the shared logic into base classes.

---

## Design Overview

Four base classes are introduced, one for each layer of the component hierarchy:

```
RNSBaseScreenController          (Swift: UIViewController subclass)
RNSBaseScreenComponentView       (ObjC: RNSReactBaseView subclass)
RNSBaseNavigatorController       (Swift: UINavigationController subclass)
RNSBaseNavigatorComponentView    (ObjC: RNSReactBaseView subclass)
```

Plus one shared protocol:

```
RNSScreenEventEmitting           (ObjC protocol: screen lifecycle event emission)
```

---

## Detailed Design

### `RNSScreenEventEmitting` — `ios/bridging/RNSScreenEventEmitting.h`

An ObjC protocol that abstracts the event-emitting surface shared by stack and split screen event emitters. Follows the Stack pattern with separate dismiss methods:

```objc
@protocol RNSScreenEventEmitting <NSObject>
- (BOOL)emitOnWillAppear;
- (BOOL)emitOnDidAppear;
- (BOOL)emitOnWillDisappear;
- (BOOL)emitOnDidDisappear;
- (BOOL)emitOnDismiss;
- (BOOL)emitOnNativeDismiss;
@end
```

Adopted by `RNSStackScreenComponentEventEmitter` (conformance addition only, no method changes) and `RNSSplitScreenComponentEventEmitter` (replaces previous unified `emitOnDismiss:(BOOL)isNative` with the two-method pattern).

Imported in `Swift-Bridging.h` so Swift screen controllers can reference it.

---

### `RNSBaseScreenController` — `ios/gamma/RNSBaseScreenController.swift`

Swift base for both `RNSStackScreenController` and `RNSSplitScreenController`. Owns the lifecycle-emission and dismiss-detection logic that was previously duplicated in both.

**Abstract computed properties** (subclasses override):
```swift
@objc open var screenEventEmitter: RNSScreenEventEmitting? { nil }
@objc open var isAttached: Bool { false }
@objc open var preventNativeDismiss: Bool { false }
```

**Concrete behaviour**:
- `viewWillAppear/DidAppear/WillDisappear/DidDisappear` → emit lifecycle events via `screenEventEmitter`
- `didMove(toParent:)` → when `parent == nil`: if `isAttached` emit `emitOnNativeDismiss`, else `emitOnDismiss`

**Subclass overrides**:

| Class | `screenEventEmitter` | `isAttached` | `preventNativeDismiss` |
|---|---|---|---|
| `RNSStackScreenController` | from component view | `activityMode == .attached` | — |
| `RNSSplitScreenController` | from component view | `activityMode == .attached` | from component view prop |

---

### `RNSBaseScreenComponentView` — `ios/gamma/RNSBaseScreenComponentView.{h,mm}`

ObjC base for both `RNSStackScreenComponentView` and `RNSSplitScreenComponentView`. Owns shared state (`screenKey`, `_hasUpdatedActivityMode`) and the two-phase init pattern.

**Public interface**:
```objc
@interface RNSBaseScreenComponentView : RNSReactBaseView
@property (nonatomic, strong, readonly, nullable) NSString *screenKey;
@property (nonatomic, readonly) BOOL isAttached;           // abstract
@property (nonatomic, strong, readonly, nonnull) UIViewController *screenViewController; // abstract
@end
```

**Subclass API** (class extension, callable by subclasses):
- `markActivityModeChanged` — sets flag, calls `finalizeUpdates:` on next Fabric cycle
- `updateScreenKey:` — updates `_screenKey`

**Abstract methods** (raise `NSInternalInconsistencyException` in base):
- `setupController` — create controller + event emitter
- `resetProps` — set `_props` to default props, reset activity mode
- `notifyParentOfActivityModeChange` — call parent navigator's `screenChangedActivityMode:`

**`initWithFrame:`** in the base calls `resetProps → setupController → resetActivityModeChanged`.

Subclasses implement the three abstract methods and add `isAttached`/`screenViewController` concrete accessors.

---

### `RNSBaseNavigatorController` — `ios/gamma/RNSBaseNavigatorController.swift`

Swift base for `RNSStackController` and `RNSSplitNavigatorController`. Owns the navigator component view reference, deferred child-VC update scheduling, and the canonical `updateChildViewControllers` implementation.

```swift
@objc public class RNSBaseNavigatorController: UINavigationController {
  @objc public private(set) weak var navigatorComponentView: RNSBaseNavigatorComponentView?

  @objc public init(navigatorComponentView: RNSBaseNavigatorComponentView)
  @objc public func setNeedsUpdateOfChildViewControllers()
  @objc public func reactMountingTransactionDidMount()  // drains the deferred flag
  @objc public func updateChildViewControllers()        // reads isAttached / screenViewController
}
```

`updateChildViewControllers` reads the abstract `reactSubviews()` → filters by `isAttached` → maps to `screenViewController` → calls `setViewControllers(_:animated:)`. This works against the base types, so no override is needed in subclasses for the common case.

**Subclass collapse**:

`RNSStackController` reduces to:
- Typed `stackHostComponentView` accessor (cast from `navigatorComponentView`)
- Typed convenience init (`initWithStackHostComponentView:`)
- `ReactMountingTransactionObserving` no-op (`reactMountingTransactionWillMount`)

`RNSSplitNavigatorController` retains only Split-specific logic:
- KVO on `view.frame` for shadow tree sync
- `viewDidLayoutSubviews` shadow state update
- `UINavigationControllerDelegate` for per-screen header colour
- `findSplitHostController()`

---

### `RNSBaseNavigatorComponentView` — `ios/gamma/RNSBaseNavigatorComponentView.{h,mm}`

ObjC base for `RNSStackHostComponentView` and `RNSSplitNavigatorComponentView`. Owns `reactSubviews` storage, the mounting transaction deferral pattern, and screen-activity-mode forwarding.

**Public interface**:
```objc
@interface RNSBaseNavigatorComponentView : RNSReactBaseView <RCTMountingTransactionObserving>
- (nonnull NSMutableArray<RNSBaseScreenComponentView *> *)reactSubviews;
@end
```

**Abstract** (class extension, raises exception in base):
```objc
- (nonnull RNSBaseNavigatorController *)navigatorController;
```

**Screen communication** (class extension):
```objc
- (void)screenChangedActivityMode:(nonnull RNSBaseScreenComponentView *)screen;
- (void)markSubviewsModifiedInCurrentTransaction;
@property (nonatomic, readonly) BOOL hadSubviewsModifiedInCurrentTransaction;
```

**Subclass hook** (class extension):
```objc
- (void)navigatorDidMountTransaction;  // no-op default; called after transaction processing
```

**Key design decisions**:
- `RCTMountingTransactionObserving` conformance is declared in the `.mm` private class extension to keep C++ headers (`MountingTransaction.h` → `<vector>`) out of the public module umbrella header. Subclasses hook in via `navigatorDidMountTransaction` instead of overriding the C++ method.
- `reactSubviews` storage (`NSMutableArray<RNSBaseScreenComponentView *>`) lives in the base. Subclasses provide typed override accessors (covariant cast) in their `.mm` files where needed.
- `screenChangedActivityMode:` forwards to `[self.navigatorController setNeedsUpdateOfChildViewControllers]`. Subclass mount/unmount call `markSubviewsModifiedInCurrentTransaction` directly.

**`RNSStackHostComponentView`** retains only:
- `_controller` ivar + init + `navigatorController` override
- `didMoveToWindow` + `reactAddControllerToClosestParent:`
- `mountChildComponentView:` / `unmountChildComponentView:` (type-check, set `stackHost`, update array)
- `navigatorDidMountTransaction` override for the debug subviews dump

**`RNSSplitNavigatorComponentView`** retains only:
- `_controller` ivar + init + `navigatorController` override
- `shadowStateProxy` + `updateState:` forwarding
- `mountChildComponentView:` / `unmountChildComponentView:` (type-check, set `splitNavigator`, update array)
- `updateProps:` for `columnType`

---

### `preventNativeDismiss` for `SplitScreen`

Feature addition enabled by the base screen controller. Adds the property to:
- `src/components/gamma/split/SplitScreen.types.ts`
- `src/fabric/gamma/split/SplitScreenNativeComponent.ts` (codegen spec)
- `RNSSplitScreenComponentView.h/.mm` (prop handling)
- `RNSSplitScreenController.swift` (overrides `preventNativeDismiss`)

---

### `RNSSplitNavigatorComponentEventEmitter` removal

`RNSSplitNavigatorComponentView` had a wrapper event emitter class for navigator-level lifecycle events (`onWillAppear` etc.) emitted from `RNSSplitNavigatorController`'s `viewWillAppear/Did/WillDisappear/DidDisappear` overrides.

`RNSStackHostComponentView` has no equivalent. The events were removed:
- `RNSSplitNavigatorComponentEventEmitter.{h,mm}` deleted
- Navigator-level lifecycle overrides removed from `RNSSplitNavigatorController.swift`
- `onWillAppear/DidAppear/WillDisappear/DidDisappear` removed from `SplitNavigatorNativeComponent.ts`

---

## PR Sequence

Dependencies flow left → right. PRs on the same row can be merged in parallel after their prerequisite.

```
PR 1: RNSScreenEventEmitting protocol
  └─ PR 2: RNSBaseScreenController + stack/split screen controller adoption
        ├─ PR 3: RNSBaseScreenComponentView + stack/split screen component view adoption
        │     └─ PR 5: RNSBaseNavigatorController + stack/split navigator controller adoption
        │           └─ PR 6: RNSBaseNavigatorComponentView + reactSubviews consolidation
        │                    (stack host + split navigator component view adoption)
        └─ PR 4: preventNativeDismiss for SplitScreen (feature, independent after PR 2)

PR 7: Remove RNSSplitNavigatorComponentEventEmitter (independent, any point)
```

### PR descriptions

| # | Title | Files | Depends on |
|---|---|---|---|
| 1 | Shared screen event emission protocol | `RNSScreenEventEmitting.h`, `Swift-Bridging.h`, both screen event emitters | — |
| 2 | Base screen controller | `RNSBaseScreenController.swift`, `RNSStackScreenController`, `RNSSplitScreenController` | PR 1 |
| 3 | Base screen component view | `RNSBaseScreenComponentView.{h,mm}`, both screen component views | PR 2 |
| 4 | `preventNativeDismiss` for SplitScreen | JS types, codegen spec, split screen component view + controller | PR 2 |
| 5 | Base navigator controller | `RNSBaseNavigatorController.swift`, `RNSStackController`, `RNSSplitNavigatorController` | PR 3 |
| 6 | Base navigator component view + `reactSubviews` | `RNSBaseNavigatorComponentView.{h,mm}`, `RNSStackHostComponentView`, `RNSSplitNavigatorComponentView` | PR 5 |
| 7 | Remove `RNSSplitNavigatorComponentEventEmitter` | Deleted emitter files, `RNSSplitNavigatorController`, `SplitNavigatorNativeComponent.ts` | — |

---

## Alternatives Considered

### `RNSSplitNavigatorController` inheriting `RNSStackController`

Rejected. `RNSStackController` holds a typed `RNSStackHostComponentView` reference — dead weight in a Split context. Direct inheritance would create misleading coupling between two independent navigator types that happen to share implementation patterns.

### Single base screen type for both navigators

Considered having one `RNSBaseScreenComponentView` that the **navigator** component views also receive directly, removing the need for separate `RNSStackScreenComponentView` / `RNSSplitScreenComponentView` types. Rejected because the screen-level prop sets (header config, `activityMode` semantics, dismiss behaviour) are sufficiently different that a shared concrete type would need more conditional branching than two clean subclasses.

---

## Open Questions

- **`preventNativeDismiss` on Stack**: The property is added only to Split in this RFC. Stack's dismiss handling lives in a different part of the codebase. Should Stack adopt `preventNativeDismiss` from the same base in a follow-up?
- **Codegen re-run**: Adding `preventNativeDismiss` to `SplitScreenNativeComponent.ts` requires `yarn codegen` before the native build picks up the generated C++ props struct change.
