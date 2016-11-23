import fetch from 'isomorphic-fetch';
import urls from '../../commons/urls';
import {getCookieValueFromName} from '../../commons/util';
import {fetchBookingsForMonth} from './bookings';


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
function loginSuccessful(username) {
    return {
        type: LOGIN_SUCCESS,
        username
    }
}

export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export function loginFailed() {
    return {
        type: LOGIN_FAILURE
    }
}

export const LOGOUT = 'LOGOUT';
function logoutSuccessful() {
    return {
        type: LOGOUT
    }
}

export const LOGIN_IN_PROGRESS = 'LOGIN_IN_PROGRESS';
function loginInProgress() {
    return {
        type: LOGIN_IN_PROGRESS
    }
}

export function logout() {
    return function (dispatch) {
        fetch(`${urls.api.auth}/sign_out`, {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            dispatch(logoutSuccessful());
        });
    }
}

export function fetchUsernameIfUserAccessTokenIsPresent() {
    return function(dispatch) {
        let userAccessToken = getCookieValueFromName('userAccessToken');
        if (userAccessToken === null) return;

        fetch(`${urls.api.user}/user_from_user_access_token`, {
            credentials: 'include'
        }).then((response) => {
                return response.json();
            }).then((data) => {
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
        }).then(() => {
            dispatch(login(username, password));
        });
    };
}

// TODO
export function login(username, password, selectedYear, selectedMonth) {
    return function (dispatch) {
        dispatch(loginInProgress());
        fetch(`${urls.api.auth}/sign_in`, {
            method: 'POST',
            body: `username=${username}&password=${password}`,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        }).then((response) => {
            if (response.status !== 200) {
                dispatch(loginFailed());
            } else {
                dispatch(loginSuccessful(username));
                dispatch(fetchBookingsForMonth(selectedYear, selectedMonth));
            }
        })
    }
}