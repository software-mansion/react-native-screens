buildscript {
    extra.apply {
        set("buildToolsVersion", "34.0.0")
        set("minSdkVersion", 23)
        set("compileSdkVersion", 34)
        set("targetSdkVersion", 34)
        set("ndkVersion", "26.1.10909125")
        set("kotlinVersion", "1.9.22")
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
    }
}

apply(plugin = "com.facebook.react.rootproject")
