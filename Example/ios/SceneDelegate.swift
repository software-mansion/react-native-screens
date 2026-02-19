#if RNS_USE_SCENE_DELEGATE

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

      factory.startReactNative(
        withModuleName: "ScreensExample",
        in: window
      )
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
