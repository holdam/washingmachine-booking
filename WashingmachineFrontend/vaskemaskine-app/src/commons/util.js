export const monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
export const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
export const weekdayNames = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function getStartAndEndDayMillisFromDate(date) {
    let startOfTodayInMillis = date.getTime();
    let endOfTodayInMillis = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
    return {startOfTodayInMillis, endOfTodayInMillis}
}

export function getCookieValueFromName(name) {
    let cookies = document.cookie.split(";");
    let cookie = cookies.filter((cookie) => {
        return cookie.indexOf(name) !== -1;
    });
    if (cookie == null) return null;
    return cookie[0].substring(name.length + 1, cookie[0].length)
}