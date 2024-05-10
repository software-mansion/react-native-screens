// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    val buildToolsVersion: String by extra("34.0.0")
    val compileSdkVersion: Int by extra(34)
    val minSdkVersion: Int by extra(21)
    val targetSdkVersion: Int by extra(34)
    val ndkVersion: String by extra("25.1.8937393")
    val kotlinVersion: String by extra("1.8.0")
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

apply(plugin = "com.facebook.react.rootproject")
