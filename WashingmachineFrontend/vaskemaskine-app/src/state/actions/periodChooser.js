export const CHANGE_PERIOD = 'CHANGE_PERIOD';

export function changePeriod(year, month) {
    return {
        type: CHANGE_PERIOD,
        year,
        month
    }
}