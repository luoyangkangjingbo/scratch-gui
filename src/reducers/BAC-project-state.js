import keyMirror from 'keymirror';

const SET_PROJECT = 'scratch-gui/BAC-project-state/SET_PROJECT';
const DONE_FETCH_PROJECT = 'scratch-gui/BAC-project-state/DONE_FETCH_PROJECT';

const LoadingState = keyMirror({
    NOT_LOADED: null,
    ERROR: null,
    FETCHING_PROJECT: null,
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

const initialState = {
    error: null,
    projectURI: null,
    loadingState: LoadingState.NOT_LOADED
}

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
    case SET_PROJECT:
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

const setProject = (projectURI) =>({
    type: SET_PROJECT,
    projectURI: projectURI
});

const doneFetchProject = () => ({
    type: DONE_FETCH_PROJECT,
    projectData: ''
});

export {
    reducer as default,
    initialState as BACProjectStateInitialState,
    getIsIdleProject,
    getIsFetchingProject,
    setProject,
    doneFetchProject
};