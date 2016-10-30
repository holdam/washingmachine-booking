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