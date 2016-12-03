import fetch from 'isomorphic-fetch';
import urls from '../../commons/urls';
import {getCookieValueFromName} from '../../commons/util';
import {fetchBookingsForMonth} from './bookings';


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
function loginSuccessful(username, role, realName, apartment) {
    return {
        type: LOGIN_SUCCESS,
        username,
        role,
        realName,
        apartment
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
    return (dispatch) => {
        fetch(`${urls.api.auth}/sign_out`, {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            dispatch(logoutSuccessful());
        });
    }
}

export function fetchUserDataIfTokenIsPresent() {
    return function(dispatch) {
        let userAccessToken = getCookieValueFromName('userAccessToken');
        if (userAccessToken === null) return;

        fetch(`${urls.api.user}/user_from_user_access_token`, {
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            dispatch(loginSuccessful(data.name, data.role, data.realName, data.apartment));
        });
    }
}

export function createUser(username, password, name, apartment, selectedYear, selectedMonth) {
    return (dispatch) => {
        fetch(`${urls.api.user}/create_user`, {
            method: 'POST',
            body: `username=${username}&password=${password}&name=${name}&apartment=${apartment}`,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }).then(() => {
            dispatch(login(username, password, name, apartment, selectedYear, selectedMonth));
        });
    };
}

// I hate shit like this
export function login(username, password, name, apartment, selectedYear, selectedMonth) {
    return (dispatch) => {
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
                throw new Error("Log in failed");
            }
            return response.json();
        }).then(() => {
            // Fetch username and role as token is present now
            // TODO test in prod
            dispatch(fetchUserDataIfTokenIsPresent);
            dispatch(fetchBookingsForMonth(selectedYear, selectedMonth));
        });
    }
}