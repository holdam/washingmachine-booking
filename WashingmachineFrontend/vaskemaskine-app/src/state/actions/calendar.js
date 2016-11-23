import {fetchBookingsForMonth} from './bookings'

export const CHANGE_MONTH_SUCCESSFUL = 'CHANGE_MONTH_SUCCESSFUL';
function changeMonthSuccessful(selectedMonthAsDate) {
    return {
        type: CHANGE_MONTH_SUCCESSFUL,
        selectedMonthAsDate
    }
}

export function changeMonth(selectedMonthAsDate) {
    return (dispatch) => {
        dispatch(changeMonthSuccessful(selectedMonthAsDate));
        dispatch(fetchBookingsForMonth(selectedMonthAsDate.getFullYear(), selectedMonthAsDate.getMonth()));
    }
}