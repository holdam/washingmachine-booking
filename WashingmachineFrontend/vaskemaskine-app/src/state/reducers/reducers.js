import {combineReducers} from 'redux';
import bookings from './bookings';
import misc from './bookingFlow';

const washingMachineApp = combineReducers({
    bookings,
    misc
});

export default washingMachineApp;
