import {START_BOOKING_FLOW, END_BOOKING_FLOW} from '../actions/bookingFlow';

function bookingFlow(state = {showBookingModal: false, date: undefined}, action) {
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

export default bookingFlow;