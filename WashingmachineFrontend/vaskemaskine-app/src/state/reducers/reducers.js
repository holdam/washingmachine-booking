import {combineReducers} from 'redux';
import bookings from './bookings';
import bookingFlow from './bookingFlow';
import login from './login';
import createUserFlow from './createUserFlow';
import editBookingFlow from './editBookingFlow'

const washingMachineApp = combineReducers({
    bookings,
    bookingFlow,
    login,
    createUserFlow,
    editBookingFlow
});

export default washingMachineApp;
