import {CHANGE_MONTH_SUCCESSFUL} from '../actions/calendar';

function calendar(state = {selectedMonthAsDate: undefined}, action) {
    switch (action.type) {
        case CHANGE_MONTH_SUCCESSFUL:
            return Object.assign({}, state, {
                selectedMonthAsDate: action.selectedMonthAsDate
            });
        default:
            return state;
    }
}

export default calendar;
