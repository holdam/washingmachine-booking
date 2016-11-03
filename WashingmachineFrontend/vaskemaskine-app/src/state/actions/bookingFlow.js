export const START_BOOKING_FLOW = 'START_BOOKING_FLOW';
export const END_BOOKING_FLOW = 'END_BOOKING_FLOW';

export function startBookingFlow(date) {
    return {
        type: START_BOOKING_FLOW,
        date
    }
}

export function endBookingFlow() {
    return {
        type: END_BOOKING_FLOW
    }
}