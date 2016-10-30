export const CREATE_BOOKING = 'CREATE_BOOKING';

export function createBooking(startTime, endTime, owner) {
    return {
        type: CREATE_BOOKING,
        startTime,
        endTime,
        owner
    }
}

// TODO change month