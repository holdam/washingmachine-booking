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
                        {`${booking.id}, ${booking.owner}, ${booking.startTime}, ${booking.endTime}, `}
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
