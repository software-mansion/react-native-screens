const fs = require('fs');
const path = require('path');

const SCENE_MANIFEST = {
  UIApplicationSupportsMultipleScenes: false,
  UISceneConfigurations: {
    UIWindowSceneSessionRoleApplication: [
      {
        UISceneConfigurationName: 'Default Configuration',
        UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
      },
    ],
  },
};

// Replaces the template's AppDelegate, which starts React Native in its own
// window, with the minimal UIScene setup: an AppDelegate that is only the
// `@main` entry point, plus a SceneDelegate that starts React Native in the
// scene's window. The scene configuration comes from `UIApplicationSceneManifest`
// in Info.plist, so AppDelegate does not need to implement any methods.
// SceneDelegate lives in AppDelegate.swift, so the Xcode project does not need
// a new file reference.
function sceneLifecycleSource(moduleName) {
  return `@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  // Unused under the UIScene life cycle (the window belongs to SceneDelegate);
  // kept for code that reads \`UIApplication.shared.delegate?.window\`.
  var window: UIWindow?
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(windowScene: windowScene)

    factory.startReactNative(
      withModuleName: "${moduleName}",
      in: window
    )
  }
}

`;
}

function setupSceneDelegate(config, { runTask, runCommand }) {
  const { paths, appName } = config;
  const iosAppDir = path.join(paths.app, 'ios', appName);
  const appDelegatePath = path.join(iosAppDir, 'AppDelegate.swift');
  const infoPlistPath = path.join(iosAppDir, 'Info.plist');

  // Templates from RN 0.88 already use UIScene: `UIApplicationSceneManifest`
  // in Info.plist, with SceneDelegate in a separate file.
  const infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
  if (infoPlist.includes('UIApplicationSceneManifest')) {
    console.log(
      config['scene-delegate']
        ? `🔍 The template already uses UIScene. Skipping...\n`
        : `⚠️ --no-scene-delegate has no effect: the template already uses UIScene (RN 0.88+).\n`,
    );
    return;
  }

  if (!config['scene-delegate']) {
    console.log(
      `🔍 --no-scene-delegate: keeping the template's AppDelegate. ` +
        `Built with the iOS 27 SDK, the app will not launch on iOS 27+.\n`,
    );
    return;
  }

  runTask('Switching iOS app to the UIScene life cycle', paths.log, () => {
    const appDelegate = fs.readFileSync(appDelegatePath, 'utf8');

    // The template (RN 0.79–0.87): `@main class AppDelegate` that starts React
    // Native, followed by `class ReactNativeDelegate`, which is kept.
    const appDelegateStart = appDelegate.indexOf('@main');
    const appDelegateEnd = appDelegate.indexOf('class ReactNativeDelegate');
    const moduleName = appDelegate.match(/withModuleName:\s*"([^"]+)"/)?.[1];
    if (appDelegateStart === -1 || appDelegateEnd === -1 || !moduleName) {
      throw new Error(
        `Unsupported AppDelegate in ${appDelegatePath}. Pass --no-scene-delegate to keep it.`,
      );
    }

    fs.writeFileSync(
      appDelegatePath,
      appDelegate.slice(0, appDelegateStart) +
        sceneLifecycleSource(moduleName) +
        appDelegate.slice(appDelegateEnd),
    );

    runCommand(
      'plutil',
      [
        '-insert',
        'UIApplicationSceneManifest',
        '-json',
        JSON.stringify(SCENE_MANIFEST),
        infoPlistPath,
      ],
      paths.app,
      paths.log,
    );
  });
}

module.exports = setupSceneDelegate;
