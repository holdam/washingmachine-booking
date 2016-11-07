import {START_LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT, FETCH_USERNAME_FOR_TOKEN} from '../actions/login';

function login(state = {isFetching: false, username: ''}, action) {
    switch (action.type) {
        case START_LOGIN:
            return Object.assign({}, state, {
                isFetching: true
            });
        case LOGIN_SUCCESS:
            localStorage.setItem('userAccessToken', action.userAccessToken);

            return Object.assign({}, state, {
                isFetching: false,
                username: action.username
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false
            });
        case LOGOUT:
            localStorage.removeItem('userAccessToken');
            return Object.assign({}, state, {
                username: ''
            });
        case FETCH_USERNAME_FOR_TOKEN:
            // TODO load username with fetch

            return Object.assign({}, state, {
                username: '123'
            });
        default:
            return state;
    }
}

export default login;