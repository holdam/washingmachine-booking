import {RECEIVE_USAGE} from '../actions/usage';

function usage(state = {sumOfWashingMachineUses: 0, sumOfTumbleDryUses: 0}, action) {
    switch (action.type) {
        case RECEIVE_USAGE:
            return Object.assign({}, state, {
                sumOfWashingMachineUses: action.sumOfWashingMachineUses,
                sumOfTumbleDryUses: action.sumOfTumbleDryUses
            });
        default:
            return state;
    }
}

export default usage;