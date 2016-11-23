import React from 'react';
import {getPrettyStartEndHoursAndMinutesFromBooking, getBookingsOfDate} from '../../../../commons/util';
import './Day.css'

export class Day extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnDayClick = this.handleOnDayClick.bind(this);
        this.handleBookingClick = this.handleBookingClick.bind(this);
    }

    render() {
        // Add appropriate classes
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

        if (this.props.isLoggedIn) {
            classes += "is-logged-in "
        }

        let bookingsOfTheDay = getBookingsOfDate(this.props.bookings, this.props.date);

        // Turn into nice html
        let bookingsAsNodes = bookingsOfTheDay.map((booking) => {
            let startHour, startMinutes, endHour, endMinutes;
            ({startHour, startMinutes, endHour, endMinutes} = getPrettyStartEndHoursAndMinutesFromBooking(booking));
            const ownOrOthersBookingClass = (booking.owner === this.props.username) ? 'own-booking' : 'others-booking';

            return (
                <div onClick={(e) => this.handleBookingClick(e, booking)} key={booking.id} className={ownOrOthersBookingClass}>
                    <div>{booking.owner}</div>
                    <div>{`${startHour}:${startMinutes} - ${endHour}:${endMinutes}`}</div>
                </div>
            )
        });

        return (
            <div onClick={this.handleOnDayClick} className={classes}>
                {this.props.children}
                {bookingsAsNodes}
            </div>
        )
    }

    handleBookingClick(event, booking) {
        event.stopPropagation();
        // If owner of booking open editing menu, otherwise do nothing
        if (booking.owner === this.props.username) {
            this.props.onBookingClick(
                booking.id,
                booking.owner,
                booking.startTime,
                booking.endTime,
                booking.numberOfWashingMachineUses,
                booking.numberOfTumbleDryUses,
                this.props.date
            )
        }
    }

    handleOnDayClick() {
        if (this.props.isLoggedIn) {
            this.props.onClick(this.props.date)
        } else {

        }
    }
}

export default Day;
