import {START_EDIT_BOOKING_FLOW, END_EDIT_BOOKING_FLOW} from '../actions/editBookingFlow';

function bookingFlow(state = {showBookingModal: false, id: -1, owner: '', startTime: -1, endTime: -1, numberOfWashingMachineUses: -1, numberOfTumbleDryUses: -1, date: undefined}, action) {
    switch (action.type) {
        case START_EDIT_BOOKING_FLOW:
            return Object.assign({}, state, {
                showBookingModal: true,
                id: action.id,
                owner: action.owner,
                startTime: action.startTime,
                endTime: action.endTime,
                numberOfWashingMachineUses: action.numberOfWashingMachineUses,
                numberOfTumbleDryUses: action.numberOfTumbleDryUses,
                date: action.date
            });
        case END_EDIT_BOOKING_FLOW:
            return Object.assign({}, state, {
                showBookingModal: false,
                date: undefined
            });
        default:
            return state;
    }
}

export default bookingFlow;
