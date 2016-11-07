import {START_CREATE_USER_FLOW, END_CREATE_USER_FLOW} from '../actions/createUserFlow'

function createUserFlow(state = {showCreateUserModal: false}, action) {
    switch (action.type) {
        case START_CREATE_USER_FLOW:
            return Object.assign({}, state, {
                showCreateUserModal: true
            });
        case END_CREATE_USER_FLOW:
            return Object.assign({}, state, {
                showCreateUserModal: false
            });
        default:
            return state;
    }
}

export default createUserFlow;