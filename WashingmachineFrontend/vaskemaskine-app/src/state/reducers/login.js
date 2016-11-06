import {START_LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT} from '../actions/login';

function login(state = {isFetching: false}, action) {
    switch (action.type) {
        case START_LOGIN:
            return Object.assign({}, state, {
                isFetching: true
            });
        case LOGIN_SUCCESS:
            localStorage.setItem('userAccessToken', action.userAccessToken);

            return Object.assign({}, state, {
                isFetching: false
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false
            });
        case LOGOUT:
            localStorage.removeItem('userAccessToken');
            return state;
        default:
            return state;
    }
}

export default login;