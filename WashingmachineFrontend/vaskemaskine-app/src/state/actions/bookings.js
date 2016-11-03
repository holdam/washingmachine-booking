import fetch from 'isomorphic-fetch';

export const CREATE_BOOKING = 'CREATE_BOOKING';
export function createBooking(id, startTime, endTime, owner) {
    return {
        type: CREATE_BOOKING,
        id,
        startTime,
        endTime,
        owner
    }
}

export const REQUEST_BOOKINGS = 'REQUEST_BOOKINGS';
function requestBookings() {
    return {type: REQUEST_BOOKINGS}
}

export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS';
function receiveBookings(bookings) {
    return {
        type: RECEIVE_BOOKINGS,
        bookings
    }
}

export function fetchBookings(startDate, endDate) {
    return function (dispatch) {
        dispatch(requestBookings());
        

        // TODO use backend return fetch ->
        let bookings = [
            {
                id: 1,
                startTime: 1478045557049,
                endTime: 1478045567049,
                owner: 'Jens'
            },
            {
                id: 2,
                startTime: 1478045567050,
                endTime: 1478045577050,
                owner: 'Kasper'
            },
            {
                id: 3,
                startTime: 1477998000000,
                endTime: 1478005200000,
                owner: 'Jens'
            }
        ];

        dispatch(receiveBookings(bookings));
    }
}