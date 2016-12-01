import urls from '../../commons/urls';

export const RECEIVE_USAGE = 'RETRIEVE_USAGE';
function receiveUsage(usage) {
    return {
        type: RECEIVE_USAGE,
        usage
    }
}

export function fetchUsage(startDateToFetchFor, endDateToFetchFor) {
    return (dispatch) => {
        fetch(`${urls.api.usage}?startTime=${startDateToFetchFor.getTime()}&endTime=${endDateToFetchFor.getTime()}`, {
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            dispatch(receiveUsage(data));
        });
    }
}