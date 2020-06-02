import keyMirror from 'keymirror';
import projectData from '../lib/default-project/project-data';

const CREATE_PROJECT = 'scratch-gui/BAC-project-state/CREATE_PROJECT';
const DONE_CREATE_PROJECT = 'scratch-gui/BAC-project-state/DONE_CREATE_PROJECT';
const FETCH_PROJECT = 'scratch-gui/BAC-project-state/FETCH_PROJECT';
const DONE_FETCH_PROJECT = 'scratch-gui/BAC-project-state/DONE_FETCH_PROJECT';
const SAVE_PROJECT = 'scratch-gui/BAC-project-state/SAVE_PROJECT';
const DONE_SAVE_PROJECT = 'scratch-gui/BAC-project-state/DONE_SAVE_PROJECT';

const LoadingState = keyMirror({
    NOT_LOADED: null,
    ERROR: null,
    CREATING_PROJECT: null,
    FETCHING_PROJECT: null,
    SAVING_PROJECT: null,
    SHOWING_PROJECT: null,
})

const LoadingStates = Object.keys(LoadingState);

const getIsIdleProject = loadingState => (
    loadingState === LoadingState.NOT_LOADED ||
    loadingState === LoadingState.SHOWING_PROJECT
);
const getIsCreatingProject = loadingState => (
    loadingState === LoadingState.CREATING_PROJECT
);
const getIsFetchingProject = loadingState => (
    loadingState === LoadingState.FETCHING_PROJECT
);
const getIsSavingProject = loadingState => (
    loadingState === LoadingState.SAVING_PROJECT
);

const initialState = {
    error: null,
    projectURI: null,
    projectJson: null,
    projectImage: null,
    projectData: null,
    projectJsonContent: null,
    loadingState: LoadingState.NOT_LOADED
}

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
    case CREATE_PROJECT:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.CREATING_PROJECT,
            });
        }
        return state;
    case DONE_CREATE_PROJECT:
        if (state.loadingState === LoadingState.CREATING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_PROJECT,
                projectJsonContent: null,
                error: action.error
            })
        }
        return state;
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
                projectJsonContent: action.projectJsonContent,
                error: action.error
            })
        }
        return state;
    case SAVE_PROJECT:
        if (state.loadingState === LoadingState.NOT_LOADED ||
            state.loadingState === LoadingState.SHOWING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SAVING_PROJECT
            })
        }
        return status;
    case DONE_SAVE_PROJECT:
        if (state.loadingState === LoadingState.SAVING_PROJECT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_PROJECT,
                projectJsonContent: action.projectJsonContent,
                error: action.error
            })
        }
        return status;
    default:
        return state;
    }
};
const createProject = () => ({
    type: CREATE_PROJECT
});
const doneCreateProject = () => ({
    type: DONE_CREATE_PROJECT
});
const fetchProject = (projectJson, projectImage, projectData, projectURI) =>({
    type: FETCH_PROJECT,
    projectJson: projectJson,
    projectImage: projectImage,
    projectData: projectData,
    projectURI: projectURI
});
const doneFetchProject = (error, projectJsonContent) => ({
    type: DONE_FETCH_PROJECT,
    projectJsonContent: projectJsonContent,
    error: error
});
const saveProject = () => ({
    type: SAVE_PROJECT
});
const doneSaveProject = (error, projectJsonContent) => ({
    type: DONE_SAVE_PROJECT,
    projectJsonContent: projectJsonContent,
    error: error
});

export {
    reducer as default,
    initialState as BACProjectStateInitialState,
    getIsIdleProject,
    getIsCreatingProject,
    getIsFetchingProject,
    getIsSavingProject,
    saveProject,
    fetchProject,
    createProject,
    doneFetchProject,
    doneSaveProject,
    doneCreateProject
};