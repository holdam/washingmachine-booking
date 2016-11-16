export const START_CREATE_BOOKING_FLOW = 'START_CREATE_BOOKING_FLOW';
export function startCreateBookingFlow(date) {
    return {
        type: START_CREATE_BOOKING_FLOW,
        date
    }
}

export const END_CREATE_BOOKING_FLOW = 'END_CREATE_BOOKING_FLOW';
export function endCreateBookingFlow() {
    return {
        type: END_CREATE_BOOKING_FLOW
    }
}