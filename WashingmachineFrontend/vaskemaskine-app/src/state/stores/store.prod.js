import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk'
import washingMachineApp from '../reducers/reducers';

export default () =>
    createStore(
        washingMachineApp,
        applyMiddleware(thunkMiddleware)
    );