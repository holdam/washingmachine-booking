import './Calendar.css';
import React from 'react';
import {monthNamesShort, weekdayNames, getStartAndEndDayMillisFromDate} from '../../../commons/util';
import CreateBookingModal from './CreateBookingModal/CreateBookingModal';
import DayContainer from '../../../containers/DayContainer';

class Calendar extends React.Component {
    render() {
        let weeks = this.props.weeks.map((week) => {
                return (
                    <Week key={week.weekOfCalendar}
                          week={week}
                          currentlySelectedMonth={this.props.month}
                    />
                )
            }
        );

        return (
            <div className="calendar">
                <CreateBookingModal showModal={this.props.showBookingModal}
                                    onCreateBooking={this.props.onCreateBooking}
                                    onCancelBookingCreation={this.props.onCancelBookingCreation}
                                    bookingDate={this.props.bookingDate}
                                    bookings={this.props.bookings}
                />
                {weeks}
            </div>
        )
    }
}

class Week extends React.Component {
    render() {
        let daysOfWeek = this.props.week.days.map((date) => {
            let keyForDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

            // Check if we're in the first week, since we will add weekday names
            if (this.props.week.weekOfCalendar === 1) {
                let dayOfTheWeek = weekdayNames[new Date(date.getFullYear(), date.getMonth(), date.getDate()).getUTCDay()];

                // First week offmonth-days
                if (this.props.currentlySelectedMonth !== date.getMonth()) {
                    return <DayContainer key={keyForDate} date={date} offMonthDay={true}>{`${dayOfTheWeek} ${date.getDate()}`}</DayContainer>
                }

                // First week, regular days
                // Check if the first day of month, since we will add month rather than weekday
                if (date.getDate() === 1) {
                    return <DayContainer key={keyForDate} date={date}>{`${monthNamesShort[date.getMonth()]} ${date.getDate()}`}</DayContainer>
                }

                return <DayContainer key={keyForDate} date={date}>{`${dayOfTheWeek} ${date.getDate()}`}</DayContainer>
            }

            // Not in first week
            // Check if we're in an off-month
            if (this.props.currentlySelectedMonth !== date.getMonth()) {
                if (date.getDate() === 1) {
                    return <DayContainer key={keyForDate} date={date} offMonthDay={true}>{`${monthNamesShort[date.getMonth()]} ${date.getDate()}`}</DayContainer>
                }
                return <DayContainer key={keyForDate} date={date} offMonthDay={true}>{date.getDate()}</DayContainer>
            }

            // Else we're in a regular month
            if (date.getDate() === 1) {
                return <DayContainer key={keyForDate} date={date}>{`${monthNamesShort[date.getMonth()]} ${date.getDate()}`}</DayContainer>
            }
            return <DayContainer key={keyForDate} date={date}>{date.getDate()}</DayContainer>
        });

        return (
            <div className="week row row-eq-height seven-cols">
                {daysOfWeek}
            </div>
        )
    }
}

export function Day(props) {
    let today = new Date();
    let classes = "col-md-1 day ";
    if (props.offMonthDay === true) {
        classes += "off-month-day "
    }

    if (props.date.getFullYear() === today.getFullYear() && props.date.getMonth() === today.getMonth() && props.date.getDate() === today.getDate()) {
        classes += "today "
    }

    // Get events for the day
    let startOfTodayInMillis, endOfTodayInMillis;
    ({startOfTodayInMillis, endOfTodayInMillis} = getStartAndEndDayMillisFromDate(props.date));
    let bookingsAsNodes = props.bookings.map((booking) => {
        if (booking.startTime >= startOfTodayInMillis && booking.endTime <= endOfTodayInMillis) {
            return (
                <div key={booking.id} className="booking">
                    {`${booking.id}, ${booking.owner}, ${booking.startTime}, ${booking.endTime}, `}
                </div>
            )
        }
    });

    return (
        <div onClick={() => props.onClick(props.date)} className={classes}>
            {props.children}
            {bookingsAsNodes}
        </div>
    )
}


// TODO push events live :D ? lav en lytter der sidder og kigger hele tiden

export default Calendar;