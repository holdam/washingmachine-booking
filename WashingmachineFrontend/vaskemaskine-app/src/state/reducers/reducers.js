import {combineReducers} from 'redux';
import bookings from './bookings';
import bookingFlow from './bookingFlow';
import login from './login';
import createUserFlow from './createUserFlow';

const washingMachineApp = combineReducers({
    bookings,
    bookingFlow,
    login,
    createUserFlow
});

export default washingMachineApp;
