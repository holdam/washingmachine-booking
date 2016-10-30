import {combineReducers} from 'redux';
import periodChooser from './periodChooser';
import bookings from './bookings';

const washingMachineApp = combineReducers({
    bookings,
    periodChooser
});

export default washingMachineApp;
