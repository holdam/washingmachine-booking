import {CHANGE_PERIOD} from '../actions/periodChooser';

// TODO Since we are not allowed to use Date.now(), we default to 2000 january
function periodChooser(state = {year: new Date().getFullYear(), month: new Date().getMonth()}, action) {
    switch (action.type) {
        case CHANGE_PERIOD:
            return {
                year: action.year,
                month: action.year
            };
        default:
            return state;
    }
}

export default periodChooser;