// swift-tools-version: 6.0
import PackageDescription

// Header search paths for quoted cross-directory imports (SPM has no CocoaPods header maps).
// Keep in sync when adding new ios/ subdirectories that contain headers.
let headerSearchPaths: [String] = [
    "ios",
    "ios/bridging",
    "ios/conversion",
    "ios/helpers/container",
    "ios/helpers/image",
    "ios/helpers/scroll-view",
    "ios/legacy",
    "ios/legacy/events",
    "ios/legacy/integrations",
    "ios/legacy/utils",
    "ios/modals/form-sheet",
    "ios/modals/utils",
    "ios/safe-area",
    "ios/scroll-to-top-guard",
    "ios/scroll-view-marker",
    "ios/split",
    "ios/stack",
    "ios/stack/header",
    "ios/stack/host",
    "ios/stack/screen",
    "ios/tabs",
    "ios/tabs/bottom-accessory",
    "ios/tabs/extensions",
    "ios/tabs/host",
    "ios/tabs/screen",
    "ios/utils",
    "ios/utils/extensions",
    "common/cpp",
    "common/cpp/react/renderer/components/rnscreens",
    "common/cpp/react/renderer/components/rnscreens/legacy",
    "common/cpp/react/renderer/components/rnscreens/legacy/utils",
    "cpp/legacy",
]

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
