import {LOGIN_FAILURE, LOGIN_SUCCESS, LOGIN_IN_PROGRESS, LOGOUT} from '../actions/login';

function login(state = {username: '', hasLoginFailed: false, loginInProgress: false}, action) {
    switch (action.type) {
        case LOGIN_IN_PROGRESS:
            return Object.assign({}, state, {
                loginInProgress: true
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                username: action.username,
                hasLoginFailed: false,
                loginInProgress: false
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                username: '',
                hasLoginFailed: true,
                loginInProgress: false
            });
        case LOGOUT:
            return Object.assign({}, state, {
                username: ''
            });
        default:
            return state;
    }
}

export default login;