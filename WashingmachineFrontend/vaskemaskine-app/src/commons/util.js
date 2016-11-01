export const monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
export const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
export const weekdayNames = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function convertDateToString(date) {
    return `d. ${date.getDate()}. ${monthNames[date.getMonth()]}, ${date.getFullYear()}`
}