import {INSERT_BOOKING, REQUEST_BOOKINGS, RECEIVE_BOOKINGS, REMOVE_BOOKING} from '../actions/bookings';

function bookings(state = {bookings: [], isFetching: false}, action) {
    switch (action.type) {
        case INSERT_BOOKING:
            return Object.assign({}, state, {
                bookings: [
                    ...state.bookings,
                    action.booking
                ]});
        case REQUEST_BOOKINGS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVE_BOOKINGS:
            return {
                bookings: action.bookings,
                isFetching: false
            };
        case REMOVE_BOOKING:
            return Object.assign({}, state, {
                bookings: state.bookings.filter((booking) => {
                    return booking.id !== action.id;
                })
            });
        default:
            return state;
    }
}

export default bookings;
