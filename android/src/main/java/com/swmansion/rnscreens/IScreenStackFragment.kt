package com.swmansion.rnscreens

interface IScreenStackFragment : IScreenFragment {
    var searchView: CustomSearchView?
    var onSearchViewCreate: ((searchView: CustomSearchView) -> Unit)?
}
