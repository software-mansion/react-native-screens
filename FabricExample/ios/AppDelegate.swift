#if !RNS_USE_SCENE_DELEGATE

  import ReactAppDependencyProvider
  import React_RCTAppDelegate
  import UIKit

  @main
  class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    func application(
      _ application: UIApplication,
      didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
      let delegate = ReactNativeDelegate()
      let factory = RCTReactNativeFactory(delegate: delegate)
      delegate.dependencyProvider = RCTAppDependencyProvider()

      reactNativeDelegate = delegate
      reactNativeFactory = factory

      window = UIWindow(frame: UIScreen.main.bounds)

      factory.startReactNative(
        withModuleName: "FabricExample",
        in: window,
        launchOptions: launchOptions
      )

      return true
    }
  }

#else

  import UIKit

  @main
  class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
      _ application: UIApplication,
      didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
      return true
    }

    // MARK: UISceneSession Lifecycle

    func application(
      _ application: UIApplication,
      configurationForConnecting connectingSceneSession: UISceneSession,
      options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
      // Called when a new scene session is being created.
      // Use this method to select a configuration to create the new scene with.
      return UISceneConfiguration(
        name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(
      _ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>
    ) {
      // Called when the user discards a scene session.
      // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
      // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }

  }

#endif  // !RNS_USE_SCENE_DELEGATE
