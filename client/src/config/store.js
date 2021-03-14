import {createStore} from 'redux';
import allReducers from '../reducers';


const store = createStore(
    allReducers,{modalVisible:false,taskModalVisible:false}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


export default store;