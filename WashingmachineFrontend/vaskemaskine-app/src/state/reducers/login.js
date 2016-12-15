import {LOGIN_FAILURE, LOGIN_SUCCESS, LOGIN_IN_PROGRESS, LOGOUT} from '../actions/login';

const initialState = {
    username: '',
    hasLoginFailed: false,
    loginInProgress: false,
    role: -1,
    realName: '',
    apartment: ''
};

function login(state = initialState, action) {
    switch (action.type) {
        case LOGIN_IN_PROGRESS:
            return Object.assign({}, state, {
                loginInProgress: true
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                username: action.username,
                role: action.role,
                realName: action.realName,
                apartment: action.apartment,
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
                username: '',
                role: -1,
                realName: '',
                apartment: ''
            });
        default:
            return state;
    }
}

export default login;