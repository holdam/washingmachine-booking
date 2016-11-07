export const START_LOGIN = 'START_LOGIN';
function startLogin() {
    return {
        type: START_LOGIN
    }
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
function loginSuccessful(userAccessToken, username) {
    return {
        type: LOGIN_SUCCESS,
        userAccessToken,
        username
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

export const FETCH_USERNAME_FOR_TOKEN = 'FETCH_USERNAME_FOR_TOKEN';
export function fetchUsernameForToken(userAccessToken) {
    return {
        type: FETCH_USERNAME_FOR_TOKEN
    }
}

export function createUser(username, password) {
    return function(dispatch) {
        // TODO attempt to create user
        // error handling
        // succesful -> login
        // TODO use returned token
        dispatch(loginSuccessful("bogus", username));
    }
}


export function login(username, password) {
    return function (dispatch) {
        dispatch(startLogin());

        // TODO attempt to login (prob using fetch)
        // TODO error handling
        let userAccessToken = "token";


        // todo also set in local storage som vi kan loade in når siden starter

        dispatch(loginSuccessful(userAccessToken, username));
    }
}