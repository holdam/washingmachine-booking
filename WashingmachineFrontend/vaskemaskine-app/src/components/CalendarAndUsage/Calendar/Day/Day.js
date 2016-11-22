import React from 'react';
import {getPrettyStartEndHoursAndMinutesFromBooking, getBookingsOfDate} from '../../../../commons/util';
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

        let bookingsOfTheDay = getBookingsOfDate(this.props.bookings, this.props.date);

        // Turn into nice html
        let bookingsAsNodes = bookingsOfTheDay.map((booking) => {
            let startHour, startMinutes, endHour, endMinutes;
            ({startHour, startMinutes, endHour, endMinutes} = getPrettyStartEndHoursAndMinutesFromBooking(booking));
            const ownOrOthersBookingClass = (booking.owner === this.props.username) ? 'own-booking' : 'others-booking';

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
