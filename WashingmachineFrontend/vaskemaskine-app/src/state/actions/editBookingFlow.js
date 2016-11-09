export const START_EDIT_BOOKING_FLOW = 'START_EDIT_BOOKING_FLOW';
export function startEditBookingFlow(id, owner, startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses, date) {
    return {
        type: START_EDIT_BOOKING_FLOW,
        id,
        owner,
        startTime,
        endTime,
        numberOfWashingMachineUses,
        numberOfTumbleDryUses,
        date
    }
}

export const END_EDIT_BOOKING_FLOW = 'END_EDIT_BOOKING_FLOW';
export function endEditBookingFlow() {
    return {
        type: END_EDIT_BOOKING_FLOW
    }
}