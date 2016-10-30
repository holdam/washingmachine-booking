import {CREATE_BOOKING} from './actions';
import {combineReducers} from 'redux';

function bookings(state = [], action) {
    switch (action.type) {
        case CREATE_BOOKING:
            return [
                ...state,
                {
                    startTime: action.startTime,
                    endTime: action.endTime,
                    owner: action.owner
                }
            ];
        default:
            return state;
    }
}

const washingMachineApp = combineReducers({
    bookings
});

export default washingMachineApp;

// TODO split reducers, use combineReducers()