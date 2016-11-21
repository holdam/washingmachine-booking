import fetch from 'isomorphic-fetch';
import urls from '../../commons/urls';
import {getCookieValueFromName} from '../../commons/util';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
function loginSuccessful(username) {
    return {
        type: LOGIN_SUCCESS,
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
function logoutSuccess() {
    return {
        type: LOGOUT
    }
}

export function logout() {
    return function (dispatch) {
        fetch(`${urls.api.auth}/sign_out`, {
            method: 'POST',
            credentials: 'include'
        }).then(function () {
            dispatch(logoutSuccess());
        });
    }
}

export function fetchUsernameIfUserAccessTokenIsPresent() {
    return function(dispatch) {
        let userAccessToken = getCookieValueFromName('userAccessToken');
        if (userAccessToken === null) return;

        fetch(`${urls.api.user}/user_from_user_access_token`, {
            credentials: 'include'
        }).then(function (response) {
                return response.json();
            }).then(function (data) {
            dispatch(loginSuccessful(data.name))
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
        fetch(`${urls.api.auth}/sign_in`, {
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