import {CREATE_BOOKING} from '../actions/bookings';

function bookings(state = [], action) {
    switch (action.type) {
        case CREATE_BOOKING:
            return [
                ...state,
                {
                    id: action.id,
                    startTime: action.startTime,
                    endTime: action.endTime,
                    owner: action.owner
                }
            ];
        default:
            return state;
    }
}

export default bookings;