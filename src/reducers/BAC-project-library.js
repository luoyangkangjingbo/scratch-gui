import keyMirror from 'keymirror';

const LOAD_PROJECT_LIBRARY = 'scratch-gui/BAC-project-library/PROJECT_LIBRARY';
const DONE_LOAD_PROJECT_LIBRARY = 'scratch-gui/BAC-project-library/DONE_PROJECT_LIBRARY';

const LoadingState = keyMirror({
    PROJECT_LIBRARY_IDLE: null,
    // PROJECT_LIBRARY_LOAD_ALL_ID: null,
    // PROJECT_LIBRARY_LOAD_PROJECT_JSON: null,
    // PROJECT_LIBRARY_LOAD_PROJECT_IMAGE:null,    
    PROJECT_LIBRARY_BUSY: null,
    PROJECT_LIBRARY_ERROR:null
})

const LoadingStates = Object.keys(LoadingState);

const getIsProjectLibraryIdle = loadingState => (
    loadingState === LoadingState.PROJECT_LIBRARY_IDLE
);
const getIsProjectLibraryBusy = loadingState => (
    loadingState === LoadingState.PROJECT_LIBRARY_BUSY
);
const getIsProjectLibraryError = loadingState => (
    loadingState === LoadingState.PROJECT_LIBRARY_ERROR
);

const initialState = {
    error: null,
    loadingState: LoadingState.PROJECT_LIBRARY_IDLE
}

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch(action.type){
    case LOAD_PROJECT_LIBRARY:
        if (state.loadingState === LoadingState.PROJECT_LIBRARY_IDLE) {
            return Object.assign({}, state, {
                loadingState: LoadingState.PROJECT_LIBRARY_BUSY
            });
        }
        return state;
    case DONE_LOAD_PROJECT_LIBRARY:
        if (state.loadingState === LoadingState.PROJECT_LIBRARY_BUSY ||
            state.loadingState === LoadingState.PROJECT_LIBRARY_ERROR) {
            return Object.assign({}, state, {
                loadingState: LoadingState.PROJECT_LIBRARY_IDLE,
                error: action.error
            });
        }
        return state;
    default:
        return state;
    }
}

const loadProjectLibrary = () => ({
    type: LOAD_PROJECT_LIBRARY
});
const doneLoadProjectLibrary = (error) => ({
    type: DONE_LOAD_PROJECT_LIBRARY,
    error: error
});

export {
    reducer as default,
    initialState as BACProjectLibraryInitialState,
    getIsProjectLibraryIdle,
    getIsProjectLibraryBusy,
    getIsProjectLibraryError,
    loadProjectLibrary,
    doneLoadProjectLibrary
};