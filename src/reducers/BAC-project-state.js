import keyMirror from 'keymirror';

const FETCH_PROJECT = 'scratch-gui/BAC-project-state/FETCH_PROJECT';
const DONE_FETCH_PROJECT = 'scratch-gui/BAC-project-state/DONE_FETCH_PROJECT';
const APPLY_PROJECT = 'scratch-gui/BAC-project-state/APPLY_PROJECT';
const DONE_APPLY_PROJECT = 'scratch-gui/BAC-project-state/DONE_APPLY_PROJECT';
const SAVE_PROJECT = 'scratch-gui/BAC-project-state/SAVE_PROJECT';
const DONE_SAVE_PROJECT = 'scratch-gui/BAC-project-state/DONE_SAVE_PROJECT';

const LoadingState = keyMirror({
    NOT_LOADED: null,
    ERROR: null,
    FETCHING_PROJECT: null,
    APPLYING_PROJECT: null,
    SAVING_PROJECT: null,
    SHOWING_PROJECT: null,
})

const LoadingStates = Object.keys(LoadingState);

const getIsIdleProject = loadingState => (
    loadingState === LoadingState.NOT_LOADED ||
    loadingState === LoadingState.SHOWING_PROJECT
);
const getIsFetchingProject = loadingState => (
    loadingState === LoadingState.FETCHING_PROJECT
)
const getIsApplyingProject = loadingState => (
    loadingState === LoadingState.APPLYING_PROJECT
)
const getIsSavingProject = loadingState => (
    loadingState === LoadingState.SAVING_PROJECT
)

const initialState = {
    error: null,
    projectURI: null,
    loadingState: LoadingState.NOT_LOADED
}

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
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
                projectData: action.projectData
            })

        }
        return state;
    default:
        return state;
    }
};

const fetchProject = projectURI =>({
    type: FETCH_PROJECT,
    projectURI: projectURI
});
const applyProject = projectURI => ({
    type: APPLY_PROJECT,
    projectURI: projectURI
});
const saveProject = projectURI => ({
    type: SAVE_PROJECT,
    projectURI: projectURI
});
const doneFetchProject = error => ({
    type: DONE_FETCH_PROJECT,
    error: error
});
const doneApplyProject = error => ({
    type: DONE_APPLY_PROJECT,
    error: error
});
const doneSaveProject = error => ({
    type: DONE_SAVE_PROJECT,
    error: error
});

export {
    reducer as default,
    initialState as BACProjectStateInitialState,
    getIsIdleProject,
    getIsFetchingProject,
    getIsApplyingProject,
    getIsSavingProject,
    fetchProject,
    applyProject,
    saveProject,
    doneFetchProject,
    doneApplyProject,
    doneSaveProject
};