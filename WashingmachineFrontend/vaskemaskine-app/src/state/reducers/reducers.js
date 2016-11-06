import {combineReducers} from 'redux';
import bookings from './bookings';
import bookingFlow from './bookingFlow';
import login from './login'

const washingMachineApp = combineReducers({
    bookings,
    bookingFlow,
    login
});

export default washingMachineApp;
