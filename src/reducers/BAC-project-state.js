import keyMirror from 'keymirror';

const SET_PROJECTID      = 'scratch-gui/BAC-project-state/SET_PROJECTID';
const GET_PROJECT        = 'scratch-gui/BAC-project-state/GET_PROJECT';
const DONE_GET_PROJECT   = 'scratch-gui/BAC-project-state/DONE_GET_PROJECT';
const UPDATE_PROJECT     = 'scratch-gui/BAC-project-state/UPDATE_PROJECT';
const DONE_UPDATE_PROJECT= 'scratch-gui/BAC-project-state/DONE_UPDATE_PROJECT';
const UPLOAD_PROJECT     = 'scratch-gui/BAC-project-state/UPLOAD_PROJECT';
const DONE_UPLOAD_PROJECT= 'scratch-gui/BAC-project-state/DONE_UPLOAD_PROJECT';

const LoadingState = keyMirror({
    NOT_LOADED       : null,
    ERROR            : null,
    GETTING_PROJECT  : null,
    UPDATING_PROJECT : null,
    UPLOADING_PROJECT: null,
    SHOWING_PROJECT  : null,
})

const LoadingStates = Object.keys(LoadingState);

const getIsIdleProject = loadingState => (
    loadingState === LoadingState.NOT_LOADED ||
    loadingState === LoadingState.SHOWING_PROJECT
);

const getIsBusyProject = loadingState => (
    loadingState === LoadingState.GETTING_PROJECT  ||
    loadingState === LoadingState.UPDATING_PROJECT ||
    loadingState === LoadingState.UPLOADING_PROJECT
);

const getIsGettingProject = loadingState => (
    loadingState === LoadingState.SETING_PROJECTID,
    loadingState === LoadingState.GETTING_PROJECT
);

const getIsUpdatingProject = loadingState => (
    loadingState === LoadingState.UPDATING_PROJECT
);

const getIsUploadingProject = loadingState => (
    loadingState === LoadingState.UPLOADING_PROJECT
);

const getIsErrorProject = loadingState => (
    loadingState === LoadingState.ERROR
);

const initialState = {
    error       : null,
    projectId   : null,
    loadingState: LoadingState.NOT_LOADED,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState
    }

    switch(action.type) {
        case SET_PROJECTID:
            if (state.loadingState === LoadingState.NOT_LOADED ||
                state.loadingState === LoadingState.SHOWING_PROJECT) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.SHOWING_PROJECT,
                    projectId   : action.projectId,
                })
            }
            return state
        case GET_PROJECT:
            if (state.loadingState === LoadingState.NOT_LOADED ||
                state.loadingState === LoadingState.SHOWING_PROJECT) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.GETTING_PROJECT,
                    projectId   : action.projectId,
                })
            }
            return state
        case DONE_GET_PROJECT:
            if (state.loadingState === LoadingState.GETTING_PROJECT) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.SHOWING_PROJECT,
                })
            }
            return state
        case UPDATE_PROJECT:
            if (state.loadingState === LoadingState.NOT_LOADED ||
                state.loadingState === LoadingState.SHOWING_PROJECT) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.UPDATING_PROJECT,
                })
            }
            return state
        case DONE_UPDATE_PROJECT:
            if (state.loadingState === LoadingState.UPDATING_PROJECT) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.SHOWING_PROJECT
                })
            }
            return state
        case UPLOAD_PROJECT:
            if (state.loadingState === LoadingState.NOT_LOADED ||
                state.loadingState === LoadingState.SHOWING_PROJECT) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.UPLOADING_PROJECT
                })
            }
            return state;
        case DONE_UPLOAD_PROJECT:
            if (state.loadingState === LoadingState.UPLOADING_PROJECT) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.SHOWING_PROJECT
                })
            }
            return state;
        default:
            return state
    }
};

const setProjectId = (projectId) => ({
    type     : SET_PROJECTID,
    projectId: projectId,
})

const getProject = (projectId) => ({
    type     : GET_PROJECT,
    projectId: projectId,
});

const doneGetProject = (error) => ({
    type : DONE_GET_PROJECT,
    error: error,
});

const updateProject = () => ({
    type: UPDATE_PROJECT,
});

const doneUpdateProject = (error) => ({
    type : DONE_UPDATE_PROJECT,
    error: error,
});

const uploadProject = () => ({
    type: UPLOAD_PROJECT,
});

const doneUploadProject = (error) => ({
    type : DONE_UPLOAD_PROJECT,
    error: error
});

export {
    reducer      as default,
    initialState as BACProjectStateInitialState,
    getIsIdleProject,
    getIsBusyProject,
    getIsErrorProject,
    getIsGettingProject,
    getIsUpdatingProject,
    getIsUploadingProject,
    setProjectId,
    getProject,
    doneGetProject,
    updateProject,
    doneUpdateProject,
    uploadProject,
    doneUploadProject,
};