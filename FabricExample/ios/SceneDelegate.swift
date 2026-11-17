#if RNS_USE_SCENE_DELEGATE

  import React
  import ReactAppDependencyProvider
  import React_RCTAppDelegate
  import UIKit

  class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    func scene(
      _ scene: UIScene, willConnectTo session: UISceneSession,
      options connectionOptions: UIScene.ConnectionOptions
    ) {
      guard let scene = (scene as? UIWindowScene) else { return }

      let delegate = ReactNativeDelegate()
      let factory = RCTReactNativeFactory(delegate: delegate)
      delegate.dependencyProvider = RCTAppDependencyProvider()

      reactNativeDelegate = delegate
      reactNativeFactory = factory

      window = UIWindow(windowScene: scene)

      #if DEBUG
        let devMenuConfiguration = RCTDevMenuConfiguration(
          devMenuEnabled: true,
          shakeGestureEnabled: true,
          keyboardShortcutsEnabled: true
        )
        factory.devMenuConfiguration = devMenuConfiguration
      #endif

      factory.startReactNative(
        withModuleName: "FabricExample",
        in: window,
        connectionOptions: connectionOptions
      )
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
      RCTLinkingManager.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
      RCTLinkingManager.scene(scene, continue: userActivity)
    }

    func sceneDidDisconnect(_ scene: UIScene) {
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
    }

    func sceneWillResignActive(_ scene: UIScene) {
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
    }
  }

#endif  // RNS_USE_SCENE_DELEGATE
