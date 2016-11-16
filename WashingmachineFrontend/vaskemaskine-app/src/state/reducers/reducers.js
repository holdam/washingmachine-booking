import {combineReducers} from 'redux';
import bookings from './bookings';
import bookingFlow from './bookingFlow';
import login from './login';
import createUserFlow from './createUserFlow';
import editBookingFlow from './editBookingFlow'
import globalErrorMessages from './globalErrorMessages'

const washingMachineApp = combineReducers({
    bookings,
    bookingFlow,
    login,
    createUserFlow,
    editBookingFlow,
    globalErrorMessages
});

export default washingMachineApp;
