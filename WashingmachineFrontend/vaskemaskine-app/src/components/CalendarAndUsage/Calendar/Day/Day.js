import React from 'react';
import {getStartAndEndDayMillisFromDate} from '../../../../commons/util';
import './Day.css'

export class Day extends React.Component {
    render() {
        // Add appropriate calsses
        let today = new Date();
        let classes = "col-md-1 day ";
        if (this.props.offMonthDay === true) {
            classes += "off-month-day "
        }

        if (this.props.date.getFullYear() === today.getFullYear() && this.props.date.getMonth() === today.getMonth() && this.props.date.getDate() === today.getDate()) {
            classes += "today "
        }

        let weekendDayValues = {0: '', 6: ''};
        if (this.props.date.getDay() in weekendDayValues) {
            classes += "weekend "
        }

        // Get events for the day
        let startOfTodayInMillis, endOfTodayInMillis;
        ({startOfTodayInMillis, endOfTodayInMillis} = getStartAndEndDayMillisFromDate(this.props.date));

        // Filter out the ones not residing in this day
        let bookingsOfTheDay = this.props.bookings.filter((booking) => {
            return booking.startTime >= startOfTodayInMillis && booking.endTime <= endOfTodayInMillis;
        });

        // Sort bookings by time
        bookingsOfTheDay = bookingsOfTheDay.sort((booking, booking2) => {
            if (booking.startTime < booking2.startTime) {
                return -1;
            }
            return 1;
        });

        // Turn into nice html
        let bookingsAsNodes = bookingsOfTheDay.map((booking) => {
            let startTime = new Date(booking.startTime);
            let endTime = new Date(booking.endTime);
            let startHour = (startTime.getHours() < 10) ? `0${startTime.getHours()}` : startTime.getHours();
            let startMinutes = (startTime.getMinutes() < 10) ? `0${startTime.getMinutes()}` : startTime.getMinutes();
            let endHour = (endTime.getHours() < 10) ? `0${endTime.getHours()}` : endTime.getHours();
            let endMinutes = (endTime.getMinutes() < 10) ? `0${endTime.getMinutes()}` : endTime.getMinutes();
            let ownOrOthersBookingClass = (booking.owner === this.props.username) ? 'own-booking' : 'others-booking';

            return (
                <div onClick={
                    // If owner of event open editing menu, otherwise do nothing
                    (booking.owner === this.props.username) ?
                        ((e) => {e.stopPropagation();
                            this.props.onBookingClick(
                                booking.id,
                                booking.owner,
                                booking.startTime,
                                booking.endTime,
                                booking.numberOfWashingMachineUses,
                                booking.numberOfTumbleDryUses,
                                this.props.date
                            )}) :
                        ((e) => {e.stopPropagation();})
                } key={booking.id} className={ownOrOthersBookingClass}>
                    <div>{booking.owner}</div>
                    <div>{`${startHour}:${startMinutes} - ${endHour}:${endMinutes}`}</div>
                </div>
            )
        });

        return (
            <div onClick={() => { if(this.props.isLoggedIn) this.props.onClick(this.props.date)}} className={classes}>
                {this.props.children}
                {bookingsAsNodes}
            </div>
        )

    }
}

export default Day;
