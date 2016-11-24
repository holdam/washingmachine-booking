import urls from '../../commons/urls';

export const RECEIVE_USAGE = 'RETRIEVE_USAGE';
function retrieveUsage(sumOfWashingMachineUses, sumOfTumbleDryUses) {
    return {
        type: RECEIVE_USAGE,
        sumOfWashingMachineUses,
        sumOfTumbleDryUses
    }
}

export function fetchUsage(startDateToFetchFor, endDateToFetchFor) {
    return (dispatch) => {
        fetch(`${urls.api.usage}?startTime=${startDateToFetchFor.getTime()}&endTime=${endDateToFetchFor.getTime()}`, {
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            dispatch(retrieveUsage(data.sumOfWashingMachineUses, data.sumOfTumbleDryUses));
        });
    }
}