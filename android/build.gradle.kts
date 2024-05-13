import com.android.Version
import java.util.Properties

plugins {
    id ("com.android.library")
    id ("kotlin-android")
}

val rnsDefaultTargetSdkVersion: Int by extra(34)
val rnsDefaultCompileSdkVersion: Int by extra(34)
val rnsDefaultMinSdkVersion: Int by extra(1)
val rnsDefaultKotlinVersion: String by extra("1.8.0")
val safeExtGet: (String, String) -> Any? by extra ({ prop: String, fallback: String -> rootProject.extra[prop] ?: extra[fallback] })

fun isNewArchitectureEnabled(): Boolean {
    // To opt-in for the New Architecture, you can either:
    // - Set `newArchEnabled` to true inside the `gradle.properties` file
    // - Invoke gradle with `-newArchEnabled=true`
    // - Set an environment variable `ORG_GRADLE_PROJECT_newArchEnabled=true`
    return project.hasProperty("newArchEnabled") && project.property("newArchEnabled") == "true"
}

// spotless is only accessible within react-native-screens repo
if (project == rootProject) {
    apply(from = "spotless.gradle")
}

if (isNewArchitectureEnabled()) {
    apply(plugin = "com.facebook.react")
}

fun reactNativeArchitectures(): List<String> {
    val value = project.properties["reactNativeArchitectures"] as? String
    return value?.split(",") ?: listOf("armeabi-v7a", "x86", "x86_64", "arm64-v8a")
}

fun safeAppExtGet(prop: String, fallback: Any?): Any? {
    val appProject = rootProject.allprojects.find { it.plugins.hasPlugin("com.android.application") }
    return if (appProject != null && appProject.extra.has(prop)) {
        appProject.extra.get(prop)
    } else {
        fallback
    }
}

fun resolveReactNativeDirectory(): File {
    val reactNativeLocation = safeAppExtGet("REACT_NATIVE_NODE_MODULES_DIR", null) as String?
    if (reactNativeLocation != null) {
        return File(reactNativeLocation)
    }

    val reactNativeFromAppNodeModules = File("$projectDir/../../react-native")
    if (reactNativeFromAppNodeModules.exists()) {
        return reactNativeFromAppNodeModules
    }

    val reactNativeFromProjectNodeModules = File("${rootProject.projectDir}/../node_modules/react-native")
    if (reactNativeFromProjectNodeModules.exists()) {
        return reactNativeFromProjectNodeModules
    }

    throw GradleException("[RNScreens] Unable to resolve react-native location in node_modules. You should project extension property (in `app/build.gradle`) `REACT_NATIVE_NODE_MODULES_DIR` with path to react-native.")
}

val reactNativeRootDir = resolveReactNativeDirectory()
val reactProperties = Properties()
File("$reactNativeRootDir/ReactAndroid/gradle.properties").inputStream().use { inputStream ->
    reactProperties.load(inputStream)
}
val REACT_NATIVE_VERSION = reactProperties.getProperty("VERSION_NAME")
val REACT_NATIVE_MINOR_VERSION = if (REACT_NATIVE_VERSION.startsWith("0.0.0-")) {
    1000
} else {
    REACT_NATIVE_VERSION.split(".")[1].toInt()
}

android {
    compileSdkVersion(safeExtGet("compileSdkVersion", "rnsDefaultCompileSdkVersion") as Int)
    val agpVersion = Version.ANDROID_GRADLE_PLUGIN_VERSION
    if (agpVersion.split(".")[0].toInt() >= 7) {
        namespace = "com.swmansion.rnscreens"
        buildFeatures {
            buildConfig = true
        }
    }

    // Used to override the NDK path/version on internal CI or by allowing
    // users to customize the NDK path/version from their root project (e.g. for M1 support)
    if (rootProject.hasProperty("ndkPath")) {
        ndkPath = rootProject.extra["ndkPath"] as String
    }
    if (rootProject.hasProperty("ndkVersion")) {
        ndkVersion = rootProject.extra["ndkVersion"] as String
    }

    defaultConfig {
        minSdkVersion(safeExtGet("minSdkVersion", "rnsDefaultMinSdkVersion") as Int)
        targetSdkVersion(safeExtGet("targetSdkVersion", "rnsDefaultTargetSdkVersion") as Int)
        buildConfigField("boolean", "IS_NEW_ARCHITECTURE_ENABLED", isNewArchitectureEnabled().toString())
        ndk {
            abiFilters += reactNativeArchitectures()
        }
        externalNativeBuild {
            cmake {
                arguments("-DANDROID_STL=c++_shared")
            }
        }
    }
    if (REACT_NATIVE_MINOR_VERSION >= 71) {
        buildFeatures {
            prefab = true
        }
        externalNativeBuild {
            cmake {
                path("CMakeLists.txt")
            }
        }
    }
    lintOptions {
        isAbortOnError = false
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    packagingOptions {
        // For some reason gradle only complains about the duplicated version of libreact_render libraries
        // while there are more libraries copied in intermediates folder of the lib build directory, we exclude
        // only the ones that make the build fail (ideally we should only include librnscreens_modules but we
        // are only allowed to specify exclude patterns)
        excludes.add("META-INF")
        excludes.add("META-INF/**")
        excludes.add("**/libjsi.so")
        excludes.add("**/libc++_shared.so")
        excludes.add("**/libreact_render*.so")
    }
    sourceSets {
        getByName("main") {
            val androidResDir: String by extra("src/main/res")
            java {
                if (isNewArchitectureEnabled()) {
                    srcDirs("src/fabric/java")
                } else {
                    srcDirs("src/paper/java", "build/generated/source/codegen/java")
                }
            }
            res {
                if (safeExtGet("compileSdkVersion", "rnsDefaultCompileSdkVersion") as Int >= 33) {
                    srcDirs("${androidResDir}/base", "${androidResDir}/v33")
                } else {
                    srcDirs("${androidResDir}/base")
                }
            }

        }
    }
}

repositories {
    maven {
        // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
        // Matches the RN Hello World template
        // https://github.com/facebook/react-native/blob/1e8f3b11027fe0a7514b4fc97d0798d3c64bc895/local-cli/templates/HelloWorld/android/build.gradle#L21
        url = uri("$projectDir/../node_modules/react-native/android")
    }
    mavenCentral()
    mavenLocal()
    google()
}

dependencies {
    implementation("com.facebook.react:react-native:+")
    implementation("androidx.appcompat:appcompat:1.4.2")
    implementation("androidx.fragment:fragment:1.3.6")
    implementation("androidx.coordinatorlayout:coordinatorlayout:1.2.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("com.google.android.material:material:1.6.1")
    implementation("androidx.core:core-ktx:1.8.0")

    constraints {
        implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.1") {
            because("on older React Native versions this dependency conflicts with react-native-screens")
        }
    }
}
