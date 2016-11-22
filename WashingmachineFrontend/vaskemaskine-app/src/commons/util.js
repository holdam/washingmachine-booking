export const monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
export const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
export const weekdayNames = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function getCookieValueFromName(name) {
    let cookies = document.cookie.split(";");
    let cookie = cookies.filter((cookie) => {
        return cookie.indexOf(name) !== -1;
    });
    if (cookie.length === 0) return null;
    return cookie[0].substring(name.length + 1, cookie[0].length)
}

export function getBookingsOfDate(bookings, date) {
    if (date === undefined) return [];

    // Get events for the day
    let startOfTodayInMillis = date.getTime();
    let endOfTodayInMillis = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();

    // Filter out the ones not residing in this day
    let bookingsOfTheDay = bookings.filter((booking) => {
        return booking.startTime >= startOfTodayInMillis && booking.endTime <= endOfTodayInMillis;
    });

    // Sort bookings by time
    bookingsOfTheDay = bookingsOfTheDay.sort((booking, booking2) => {
        if (booking.startTime < booking2.startTime) {
            return -1;
        }
        return 1;
    });

    return bookingsOfTheDay;
}

export function getPrettyStartEndHoursAndMinutesFromBooking(booking) {
    let startTime = new Date(booking.startTime);
    let endTime = new Date(booking.endTime);
    let startHour = (startTime.getHours() < 10) ? `0${startTime.getHours()}` : startTime.getHours();
    let startMinutes = (startTime.getMinutes() < 10) ? `0${startTime.getMinutes()}` : startTime.getMinutes();
    let endHour = (endTime.getHours() < 10) ? `0${endTime.getHours()}` : endTime.getHours();
    let endMinutes = (endTime.getMinutes() < 10) ? `0${endTime.getMinutes()}` : endTime.getMinutes();
    return {startHour, startMinutes, endHour, endMinutes};
}