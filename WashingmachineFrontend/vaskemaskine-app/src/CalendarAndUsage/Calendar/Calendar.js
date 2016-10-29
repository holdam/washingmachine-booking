import './Calendar.css';
import React from 'react';
import {monthNamesShort, weekdayNames} from '../../Commons/util';

class Calendar extends React.Component {
    render() {
        let weeks = this.props.weeks.map((week) => {
                return (
                    <Week key={week.weekOfCalendar} week={week} currentlySelectedMonth={this.props.month} onDayClick={this.props.onDayClick} />
                )
            }
        );

        return (
            <div className="calendar">
                {weeks}
            </div>
        )
    }
}

class Week extends React.Component {
    render() {
        let daysOfWeek = this.props.week.days.map((date) => {
            // Check if we're in the first week, since we will add weekday names
            if (this.props.week.weekOfCalendar === 1) {
                let dayOfTheWeek = weekdayNames[new Date(date.year, date.month, date.day).getUTCDay()];

                // First week offmonth-days
                if (this.props.currentlySelectedMonth !== date.month) {
                    return <OffMonthDay key={`${date.year}-${date.month}-${date.day}`}>{`${dayOfTheWeek} ${date.day}`}</OffMonthDay>
                }

                // First week, regular days
                // Check if the first day of month, since we will add month rather than weekday
                if (date.day === 1) {
                    return <InMonthDay key={`${date.year}-${date.month}-${date.day}`}>{`${monthNamesShort[date.month]} ${date.day}`}</InMonthDay>
                }

                return <InMonthDay key={`${date.year}-${date.month}-${date.day}`}>{`${dayOfTheWeek} ${date.day}`}</InMonthDay>
            }

            // Check if we're in an off-month
            if (this.props.currentlySelectedMonth !== date.month) {
                if (date.day === 1) {
                    return <OffMonthDay key={`${date.year}-${date.month}-${date.day}`}>{`${monthNamesShort[date.month]} ${date.day}`}</OffMonthDay>
                }
                return <OffMonthDay key={`${date.year}-${date.month}-${date.day}`}>{date.day}</OffMonthDay>
            }
            // Else we're in a regular month
            if (date.day === 1) {
                return <InMonthDay key={`${date.year}-${date.month}-${date.day}`}>{`${monthNamesShort[date.month]} ${date.day}`}</InMonthDay>
            }
            return <InMonthDay key={`${date.year}-${date.month}-${date.day}`}>{date.day}</InMonthDay>
        });

        return (
            <div className="week row seven-cols">
                {daysOfWeek}
            </div>
        )
    }
}

function OffMonthDay(props) {
    return (
        <div className="col-md-1 off-month-day day">
            {props.children}
        </div>
    )
}

function InMonthDay(props) {
    return (
        <div className="col-md-1 day">
            {props.children}
        </div>
    )
}


// push events live :D ? lav en lytter der sidder og kigger hele tiden
// evt. nye år

export default Calendar;