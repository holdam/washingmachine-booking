import {combineReducers} from 'redux';
import bookings from './bookings';

const washingMachineApp = combineReducers({
    bookings
});

export default washingMachineApp;
