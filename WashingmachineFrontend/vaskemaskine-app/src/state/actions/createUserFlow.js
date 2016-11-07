export const START_CREATE_USER_FLOW = 'START_CREATE_USER_FLOW';
export function startCreateUserFlow() {
    return {
        type: START_CREATE_USER_FLOW
    }
}

export const END_CREATE_USER_FLOW = 'END_CREATE_USER_FLOW';
export function endCreateUserFlow() {
    return {
        type: END_CREATE_USER_FLOW
    }
}