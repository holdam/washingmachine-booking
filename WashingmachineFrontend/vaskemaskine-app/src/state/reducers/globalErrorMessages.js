import {SET_ERROR} from '../actions/globalErrorMessages'

function globalErrorMessages(state = {errorMessage: ''}, action) {
    switch (action.type) {
        case SET_ERROR:
            return Object.assign({}, state, {
                errorMessage: action.errorMessage
            });
        default:
            return state;
    }
}

export default globalErrorMessages;