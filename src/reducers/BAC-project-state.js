import keyMirror from 'keymirror';
import projectData from '../lib/default-project/project-data';

const FETCH_PROJECT = 'scratch-gui/BAC-project-state/FETCH_PROJECT';
const DONE_FETCH_PROJECT = 'scratch-gui/BAC-project-state/DONE_FETCH_PROJECT';
const SAVE_PROJECT = 'scratch-gui/BAC-project-state/SAVE_PROJECT';
const DONE_SAVE_PROJECT = 'scratch-gui/BAC-project-state/DONE_SAVE_PROJECT';

const LoadingState = keyMirror({
    NOT_LOADED: null,
    ERROR: null,
    FETCHING_PROJECT: null,
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
const getIsSavingProject = loadingState => (
    loadingState === LoadingState.SAVING_PROJECT
)

const initialState = {
    error: null,
    projectURI: null,
    projectJson: null,
    projectImage: null,
    projectData: null,
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
                projectJson: action.projectJson,
                projectImage: action.projectImage,
                projectData: action.projectData,
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
    case SAVE_PROJECT:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SAVING_PROJECT,
                projectJson: action.projectJson,
                projectImage: action.projectImage,
                projectData: action.projectData,
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
const fetchProject = (projectJson, projectImage, projectData, projectURI) =>({
    type: FETCH_PROJECT,
    projectJson: projectJson,
    projectImage: projectImage,
    projectData: projectData,
    projectURI: projectURI
});
const doneFetchProject = error => ({
    type: DONE_FETCH_PROJECT,
    error: error
});
const saveProject = (projectJson, projectImage, projectData, projectURI) => ({
    type: SAVE_PROJECT,
    projectJson: projectJson,
    projectImage: projectImage,
    projectData: projectData,
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
    getIsFetchingProject,
    getIsSavingProject,
    fetchProject,
    doneFetchProject,
    saveProject,
    doneSaveProject
};