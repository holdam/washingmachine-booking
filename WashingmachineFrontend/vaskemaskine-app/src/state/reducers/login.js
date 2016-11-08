import {LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT} from '../actions/login';

function login(state = {username: '', hasLoginFailed: false}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            localStorage.setItem('userAccessToken', action.userAccessToken);

            return Object.assign({}, state, {
                username: action.username,
                hasLoginFailed: false
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                username: '',
                hasLoginFailed: true
            });
        case LOGOUT:
            localStorage.removeItem('userAccessToken');
            return Object.assign({}, state, {
                username: ''
            });
        default:
            return state;
    }
}

export default login;