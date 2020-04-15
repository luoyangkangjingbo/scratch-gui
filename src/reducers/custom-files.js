const SET_CUSTOM_LOAD_FILE_FROM_CLOUD  = 'customLoadFileFromCloud';
const SET_CUSTOM_LOAD_FILE_TO_COMPUTER = 'customLoadFileToComputer';
const SET_CUSTOM_LOAD_FILE_TO_CLOUD    = 'customLoadFileToCloud';

const initialState = {
    operation : '',
    name      : '',
    path      : ''
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_CUSTOM_LOAD_FILE_FROM_CLOUD:
        return Object.assign({}, state, {
            operation: 'LoadFileFromCloud',
            name: action.name,
            path: action.path
        });
    case SET_CUSTOM_LOAD_FILE_TO_COMPUTER:
        return Object.assign({}, state, {
            operation: 'LoadFileToComputer',
            name: action.name,
            path: action.path
        });
    case SET_CUSTOM_LOAD_FILE_TO_CLOUD:
        return Object.assign({}, state, {
            operation: 'LoadFileToCloud',
            name: action.name,
            path: action.path
        });
    default:
        return state;
    }
};

const setCustomLoadFileFromCloud = function (name, path) {
    return {
        type: SET_CUSTOM_LOAD_FILE_FROM_CLOUD,
        name: name,
        path: path
    };
};

const setCustomLoadFileToComputer = function (name, path) {
    return {
        type: SET_CUSTOM_LOAD_FILE_TO_COMPUTER,
        name: name,
        path: path
    };
};

const setCustomLoadFileToCloud = function (name, path) {
    return {
        type: SET_CUSTOM_LOAD_FILE_TO_CLOUD,
        name: name,
        path: path
    };
}

export {
    reducer as default,
    initialState as customFilesInitialState,
    setCustomLoadFileFromCloud,
    setCustomLoadFileToComputer,
    setCustomLoadFileToCloud
};
