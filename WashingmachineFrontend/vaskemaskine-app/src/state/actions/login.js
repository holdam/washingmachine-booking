import fetch from 'isomorphic-fetch';
import urls from '../../commons/urls';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
function loginSuccessful(userAccessToken, username) {
    return {
        type: LOGIN_SUCCESS,
        userAccessToken,
        username
    }
}

export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export function loginFailed(error) {
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

export function fetchUsernameForToken(userAccessToken) {
    return function(dispatch) {
        // TODO don't use user access tokens
        fetch(`${urls.api.user}/user_from_user_access_token?userAccessToken=${userAccessToken}`)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
            dispatch(loginSuccessful(userAccessToken, data.name))
        });
    }
}

export function createUser(username, password) {
    return function(dispatch) {
        fetch(`${urls.api.user}/create_user`, {
            method: 'POST',
            body: `username=${username}&password=${password}`,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }).then(function () {
            dispatch(login(username, password));
        });
    };
}

export function login(username, password) {
    return function (dispatch) {
        fetch(`${urls.api.auth}/signin`, {
            method: 'POST',
            body: `username=${username}&password=${password}`,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        }).then(function (response) {
            if (response.status !== 200) {
                dispatch(loginFailed(response.statusText));
                throw new Error(response.statusText);
            }
        });
    }
}