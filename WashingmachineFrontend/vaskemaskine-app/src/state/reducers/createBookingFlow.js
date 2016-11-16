import {START_CREATE_BOOKING_FLOW, END_CREATE_BOOKING_FLOW} from '../actions/createBookingFlow';

function createBookingFlow(state = {showBookingModal: false, date: undefined}, action) {
    switch (action.type) {
        case START_CREATE_BOOKING_FLOW:
            return Object.assign({}, state, {
                showBookingModal: true,
                date: action.date
            });
        case END_CREATE_BOOKING_FLOW:
            return Object.assign({}, state, {
                showBookingModal: false,
                date: undefined
            });
        default:
            return state;
    }
}

export default createBookingFlow;