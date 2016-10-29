import {CREATE_BOOKING} from 'actions';

const initialState = {
    bookings: []
};

function booking(state = initialState, action) {
    switch (action.type) {
        case CREATE_BOOKING:
            return Object.assign({}, state, {
                bookings: [
                    ...state.bookings,
                    {

                    }
                ]
            });
        default:
            return state;
    }
}