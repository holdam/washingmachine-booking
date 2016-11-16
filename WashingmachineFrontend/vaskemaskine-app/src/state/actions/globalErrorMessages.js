export const SET_ERROR = 'SET_ERROR';
export function setError(errorMessage) {
    return {
        type: SET_ERROR,
        errorMessage
    }
}