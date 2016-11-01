import {combineReducers} from 'redux';
import bookings from './bookings';
import misc from './misc';

const washingMachineApp = combineReducers({
    bookings,
    misc
});

export default washingMachineApp;
