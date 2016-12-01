import {RECEIVE_USAGE} from '../actions/usage';

function usage(state = {usage: []}, action) {
    switch (action.type) {
        case RECEIVE_USAGE:
            return Object.assign({}, state, {
                usage: action.usage
            });
        default:
            return state;
    }
}

export default usage;