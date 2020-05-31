import keyMirror from 'keymirror';

const FETCH_JSON = 'scratch-gui/BAC-project-state/FETCH_JSON';
const FETCH_ICON = 'scratch-gui/BAC-project-state/FETCH_ICON';
const FETCH_PROJECT = 'scratch-gui/BAC-project-state/FETCH_PROJECT';
const DONE_FETCH_PROJECT = 'scratch-gui/BAC-project-state/DONE_FETCH_PROJECT';
const SAVE_JSON = 'scratch-gui/BAC-project-state/SAVE_JSON';
const SAVE_ICON = 'scratch-gui/BAC-project-state/SAVE_ICON';
const SAVE_PROJECT = 'scratch-gui/BAC-project-state/SAVE_PROJECT';
const DONE_SAVE_PROJECT = 'scratch-gui/BAC-project-state/DONE_SAVE_PROJECT';

const LoadingState = keyMirror({
    NOT_LOADED: null,
    ERROR: null,
    FETCHING_JSON: null,
    FETCHING_ICON: null,
    FETCHING_PROJECT: null,
    SAVING_JSON: null,
    SAVING_ICON: null,
    SAVING_PROJECT: null,
    SHOWING_PROJECT: null,
})

const LoadingStates = Object.keys(LoadingState);

const getIsIdleProject = loadingState => (
    loadingState === LoadingState.NOT_LOADED ||
    loadingState === LoadingState.SHOWING_PROJECT
);
const getIsFetchingJSON = loadingState => (
    loadingState === LoadingState.FETCHING_JSON
)
const getIsFetchingICON = loadingState => (
    loadingState === LoadingState.FETCHING_ICON
)
const getIsFetchingProject = loadingState => (
    loadingState === LoadingState.FETCHING_PROJECT
)
const getIsSavingJSON = loadingState => (
    loadingState === LoadingState.SAVING_JSON
)
const getIsSavingICON = loadingState => (
    loadingState === LoadingState.SAVING_ICON
)
const getIsSavingProject = loadingState => (
    loadingState === LoadingState.SAVING_PROJECT
)

const initialState = {
    error: null,
    projectURI: null,
    projectTitle: null,
    loadingState: LoadingState.NOT_LOADED
}

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
    case FETCH_JSON:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.FETCHING_JSON,
                projectURI: action.projectURI
            });
        }
        return state;
    case FETCH_ICON:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.FETCHING_ICON,
                projectURI: action.projectURI
            });
        }
        return state;
    case FETCH_PROJECT:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.FETCHING_PROJECT,
                projectURI: action.projectURI
            });
        }
        return state;
    case DONE_FETCH_PROJECT:
        if (state.loadingState === LoadingState.FETCHING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_PROJECT,
                error: action.error
            })
        }
        return state;
    case SAVE_JSON:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SAVING_JSON,
                projectURI: action.projectURI
            })
        }
        return state;
    case SAVE_ICON:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SAVING_ICON,
                projectURI: action.projectURI
            })
        }
        return state;
    case SAVE_PROJECT:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SAVING_PROJECT,
                projectURI: action.projectURI
            })
        }
        return status;
    case DONE_SAVE_PROJECT:
        if (state.loadingState === LoadingState.SAVING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_PROJECT,
                error: action.error
            })
        }
        return status;
    default:
        return state;
    }
};
const fetchJSON = projectURI =>({
    type: FETCH_JSON,
    projectURI: projectURI
})
const fetchICON = projectURI =>({
    type: FETCH_ICON,
    projectURI: projectURI
})
const fetchProject = projectURI =>({
    type: FETCH_PROJECT,
    projectURI: projectURI
});
const doneFetchProject = error => ({
    type: DONE_FETCH_PROJECT,
    error: error
});
const saveJSON = projectURI => ({
    type: SAVE_JSON,
    projectURI: projectURI
});
const saveICON = projectURI => ({
    type: SAVE_ICON,
    projectURI: projectURI
});
const saveProject = projectURI => ({
    type: SAVE_PROJECT,
    projectURI: projectURI
});
const doneSaveProject = error => ({
    type: DONE_SAVE_PROJECT,
    error: error
});

export {
    reducer as default,
    initialState as BACProjectStateInitialState,
    getIsIdleProject,
    getIsFetchingJSON,
    getIsFetchingICON,
    getIsFetchingProject,
    getIsSavingJSON,
    getIsSavingICON,
    getIsSavingProject,
    fetchJSON,
    fetchICON,
    fetchProject,
    doneFetchProject,
    saveJSON,
    saveICON,
    saveProject,
    doneSaveProject
};