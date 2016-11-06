export const START_LOGIN = 'START_LOGIN';
function startLogin() {
    return {
        type: START_LOGIN
    }
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
function loginSuccessful(userAccessToken) {
    return {
        type: LOGIN_SUCCESS,
        userAccessToken
    }
}

export const LOGIN_FAILURE = 'LOGIN_FAILURE';
function loginFailed(error) {
    return {
        type: LOGIN_FAILURE,
        error
    }
}

export const LOGOUT = 'LOGOUT';
export function logout() {
    return {
        type: LOGOUT
    }
}


export function login(username, password) {
    return function (dispatch) {
        dispatch(startLogin());

        // TODO attempt to login (prob using fetch)
        // TODO error handling
        let userAccessToken = "token";


        // todo also set in local storage som vi kan loade in når siden starter

        dispatch(loginSuccessful(userAccessToken));
    }
}