import {combineReducers} from 'redux';
import bookings from './bookings';
import bookingFlow from './bookingFlow';

const washingMachineApp = combineReducers({
    bookings,
    bookingFlow
});

export default washingMachineApp;
