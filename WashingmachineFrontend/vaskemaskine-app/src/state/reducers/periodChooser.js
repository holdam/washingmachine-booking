import {CHANGE_PERIOD} from '../actions/periodChooser';

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