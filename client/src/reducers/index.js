import {tasksReducer,taskModalReducer,taskReducer} from './tasks';
import {projectModeReducer,projectModalReducer,projectsReducer} from './projects';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    projects: projectsReducer,
    tasks: tasksReducer,
    mode: projectModeReducer,
    modalVisible: projectModalReducer,
    taskModalVisible: taskModalReducer,
    task_data: taskReducer,
});

export default allReducers;