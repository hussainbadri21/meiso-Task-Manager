const initialState = {};

export const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return state = action.payload;
        case 'ADD_TASK':
            state[Object.keys(state).length] = action.payload;
            return state = {...state}
        case 'DELETE_TASK':
            delete state[Object.keys(state).find(key => state[key].tid === action.payload)]
            return state = {...state}
        case 'UPDATE_TASK':
            let key = Object.keys(state).find(key => state[key].tid === action.payload.tid)
            state[key] = action.payload
            return state = {...state}
        default:
            return state;
    }
}

export const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TASK':
            return state = action.payload;
        default:
            return state;
    }
}


export const taskModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_TASK_MODAL_VISIBILITY':
            return state = action.payload;
        default:
            return state;
    }
}