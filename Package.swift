// swift-tools-version: 6.0
import Foundation
import PackageDescription

// Header search paths for quoted cross-directory imports (SPM has no CocoaPods
// header maps, and no glob in its manifest API). Discovered at manifest-eval time
// -- the equivalent of the podspec's `ios/**/*.h` -- so contributors never have to
// hand-maintain this list. Every directory containing a header gets an `-I`.
func discoverHeaderSearchPaths() -> [String] {
    let root = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
    var dirs = Set<String>()
    for base in ["ios", "common/cpp", "cpp"] {
        let baseURL = root.appendingPathComponent(base)
        guard let enumerator = FileManager.default.enumerator(
            at: baseURL, includingPropertiesForKeys: nil
        ) else { continue }
        for case let url as URL in enumerator
            where url.pathExtension == "h" && !url.path.contains(".xcodeproj") {
            let dir = url.deletingLastPathComponent().path
                .replacingOccurrences(of: root.path + "/", with: "")
            dirs.insert(dir)
        }
    }
    return dirs.sorted()
}

let headerSearchPaths = discoverHeaderSearchPaths()

let cSettings: [CSetting] = headerSearchPaths.map { .headerSearchPath($0) }

let cxxSettings: [CXXSetting] = [
    .define("DEBUG", .when(configuration: .debug)),
    .define("NDEBUG", .when(configuration: .release)),
] + headerSearchPaths.map { .headerSearchPath($0) }

let package = Package(
    name: "RNScreens",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "RNScreens", targets: ["RNScreens"]),
    ],
    dependencies: [
        // Resolved from the autolinker symlink `<app>/ios/build/generated/autolinking/libs/RNScreens`,
        // not from node_modules: `../../../../xcframeworks` -> `<app>/ios/build/xcframeworks`,
        // `../../../ios` -> `<app>/ios/build/generated/ios`. Same layout `npx react-native spm scaffold` emits.
        // Making this self-contained (remote RN package URL + shipping our own codegen output) is blocked
        // on RN publishing a remote SPM package and would require `codegenConfig.includesGeneratedCode`, see:
        // https://github.com/react/react-native/blob/v0.87.1/packages/react-native/scripts/spm/__docs__/spm-header-paths-contract.md#hand-authored-community-library-contract
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "RNScreens",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: ".",
            exclude: ["ios/RNScreens.xcodeproj"],
            sources: ["ios", "common/cpp", "cpp"],
            publicHeadersPath: "ios",
            cSettings: cSettings,
            cxxSettings: cxxSettings,
            linkerSettings: [
                .linkedFramework("UIKit"),
                .linkedFramework("Foundation"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
