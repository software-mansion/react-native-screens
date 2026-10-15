package com.swmansion.rnscreens.core.common.safearea

enum class InsetType {
    ALL,
    SYSTEM,
    INTERFACE,
    ;

    fun containsSystem(): Boolean = this == ALL || this == SYSTEM

    fun containsInterface(): Boolean = this == ALL || this == INTERFACE
}
