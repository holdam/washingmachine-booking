import {createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import washingMachineApp from '../reducers/reducers';

export default () =>
    createStore(
        washingMachineApp,
        composeWithDevTools(
            applyMiddleware(thunkMiddleware, createLogger())
        ));