import fetch from 'isomorphic-fetch';
import urls from '../../commons/urls';
import {endCreateBookingFlow} from './createBookingFlow';
import {endEditBookingFlow} from './editBookingFlow';
import {properModulo} from '../../commons/util';

export const INSERT_BOOKING = 'INSERT_BOOKING';
export function insertBooking(id, startTime, endTime, owner, numberOfWashingMachineUses, numberOfTumbleDryUses) {
    return {
        type: INSERT_BOOKING,
        id,
        startTime,
        endTime,
        owner,
        numberOfWashingMachineUses,
        numberOfTumbleDryUses
    }
}

export const REMOVE_BOOKING = 'REMOVE_BOOKING';
export function removeBooking(id) {
    return {
        type: REMOVE_BOOKING,
        id
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

export function createBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses) {
    return (dispatch) => {
        fetch(urls.api.booking, {
            method: 'POST',
            body: `startTime=${startTime}&endTime=${endTime}&numberOfWashingMachineUses=${numberOfWashingMachineUses}&numberOfTumbleDryUses=${numberOfTumbleDryUses}`,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            dispatch(endCreateBookingFlow());
            dispatch(insertBooking(data.id, data.startTime, data.endTime, data.owner, data.numberOfWashingMachineUses, data.numberOfTumbleDryUses));
        });
    }
}

export function editBooking(id, startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses) {
    return (dispatch) => {
        fetch(urls.api.booking, {
            method: 'PUT',
            body: `id=${id}&startTime=${startTime}&endTime=${endTime}&numberOfWashingMachineUses=${numberOfWashingMachineUses}&numberOfTumbleDryUses=${numberOfTumbleDryUses}`,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            dispatch(endEditBookingFlow());
            dispatch(removeBooking(data.id));
            dispatch(insertBooking(data.id, data.startTime, data.endTime, data.owner, data.numberOfWashingMachineUses, data.numberOfTumbleDryUses));
        });
    }
}

export function fetchBookingsForMonth(year, month) {
    return (dispatch) => {
        dispatch(requestBookings());

        let firstDayOfMonth = new Date(year, month, 1);
        let lastDayOfMonth = new Date(year, month + 1, 0);

        let numberOfDaysBeforeFirstDayInMonth = properModulo(firstDayOfMonth.getDay() - 1, 7);
        let startDateToFetchFor = new Date(year, month, firstDayOfMonth.getDate() - numberOfDaysBeforeFirstDayInMonth);
        startDateToFetchFor.setHours(0);
        startDateToFetchFor.setMinutes(0);

        // Letting 42 staying as a magic variable for teh lulz
        let numberOfDaysAfterLastDayInMonth = 42 - numberOfDaysBeforeFirstDayInMonth - lastDayOfMonth.getDate();
        let endDateToFetchFor = new Date(year, month, lastDayOfMonth.getDate() + numberOfDaysAfterLastDayInMonth);
        endDateToFetchFor.setHours(23);
        endDateToFetchFor.setMinutes(59);

        fetch(`${urls.api.booking}/interval?startTime=${startDateToFetchFor.getTime()}&endTime=${endDateToFetchFor.getTime()}`, {
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            dispatch(receiveBookings(data));
        });
    }
}

export function deleteBooking(id) {
    return (dispatch) => {
        fetch(urls.api.booking, {
            method: 'DELETE',
            body: `id=${id}`,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            credentials: 'include'
        }).then(() => {
            dispatch(endEditBookingFlow());
            dispatch(removeBooking(id));
        });
    }
}