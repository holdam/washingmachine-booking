import React from 'react';
import {getStartAndEndDayMillisFromDate} from '../../../../commons/util';
import './Day.css'

export class Day extends React.Component {
    render() {
        let today = new Date();
        let classes = "col-md-1 day ";
        if (this.props.offMonthDay === true) {
            classes += "off-month-day "
        }

        if (this.props.date.getFullYear() === today.getFullYear() && this.props.date.getMonth() === today.getMonth() && this.props.date.getDate() === today.getDate()) {
            classes += "today "
        }

        // Get events for the day
        let startOfTodayInMillis, endOfTodayInMillis;
        ({startOfTodayInMillis, endOfTodayInMillis} = getStartAndEndDayMillisFromDate(this.props.date));
        let bookingsAsNodes = this.props.bookings.map((booking) => {
            if (booking.startTime >= startOfTodayInMillis && booking.endTime <= endOfTodayInMillis) {
                let startTime = new Date(booking.startTime);
                let endTime = new Date(booking.endTime);
                let startHour = (startTime.getHours() < 10) ? `0${startTime.getHours()}` : startTime.getHours();
                let startMinutes = (startTime.getMinutes() < 10) ? `0${startTime.getMinutes()}` : startTime.getMinutes();
                let endHour = (endTime.getHours() < 10) ? `0${endTime.getHours()}` : endTime.getHours();
                let endMinutes = (endTime.getMinutes() < 10) ? `0${endTime.getMinutes()}` : endTime.getMinutes();

                return (
                    <div onClick={(e) => {
                        e.stopPropagation(); this.props.onBookingClick(
                            booking.id,
                            booking.owner,
                            booking.startTime,
                            booking.endTime,
                            booking.numberOfWashingMachineUses,
                            booking.numberOfTumbleDryUses,
                            this.props.date
                        )
                    }} key={booking.id} className="booking">
                        <div>{booking.owner}</div>
                        <div>{`${startHour}:${startMinutes} - ${endHour}:${endMinutes}`}</div>
                    </div>
                )
            }
        });

        return (
            <div onClick={() => this.props.onClick(this.props.date)} className={classes}>
                {this.props.children}
                {bookingsAsNodes}
            </div>
        )

    }
}

export default Day;
