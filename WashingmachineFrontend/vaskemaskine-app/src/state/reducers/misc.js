import {START_BOOKING_FLOW, END_BOOKING_FLOW} from '../actions/misc';

function misc(state = {showBookingModal: false, date: undefined}, action) {
    switch (action.type) {
        case START_BOOKING_FLOW:
            return Object.assign({}, state, {
                showBookingModal: true,
                date: action.date
            });
        case END_BOOKING_FLOW:
            return Object.assign({}, state, {
                showBookingModal: false,
                date: undefined
            });
        default:
            return state;
    }
}

export default misc;