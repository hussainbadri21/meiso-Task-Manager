const initialState = {};

export const projectsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROJECTS':
            return state = action.payload;
        case 'ADD_PROJECT':
            state[Object.keys(state).length] = action.payload;
            return state = {...state}
        case 'DELETE_PROJECT':
            delete state[Object.keys(state).find(key => state[key].pid === action.payload)]
            return state = {...state}
        case 'UPDATE_PROJECT':
            let key = Object.keys(state).find(key => state[key].pid === action.payload.pid)
            state[key] = action.payload
            return state = {...state}
        default:
            return state;
    }
}

export const projectModeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_PROJECT_EDIT_MODE':
            return state = action.payload;
        default:
            return state;
    }
}

export const projectModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_PROJECT_MODAL_VISIBILITY':
            return state = action.payload;
        default:
            return state;
    }
}