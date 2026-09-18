#if RNS_USE_SCENE_DELEGATE

  import React_RCTAppDelegate
  import UIKit

  class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
      _ scene: UIScene, willConnectTo session: UISceneSession,
      options connectionOptions: UIScene.ConnectionOptions
    ) {
      guard let windowScene = scene as? UIWindowScene,
        let appDelegate = UIApplication.shared.delegate as? AppDelegate,
        let factory = appDelegate.reactNativeFactory
      else {
        return
      }

      let window = UIWindow(windowScene: windowScene)
      self.window = window

      factory.startReactNative(
        withModuleName: "FabricExample",
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
